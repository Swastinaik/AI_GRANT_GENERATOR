"""
test_auth_routes.py — Integration tests for /api/auth endpoints

═══════════════════════════════════════════════════════════════════════════════
UNDERSTANDING INTEGRATION TESTS vs UNIT TESTS
═══════════════════════════════════════════════════════════════════════════════

UNIT TESTS (what we did before):
  - Test ONE function in complete isolation
  - Mock EVERYTHING external (DB, auth, AI)
  - Very fast, very focused
  - Example: "does serialize_doc() correctly convert an ObjectId to a string?"

INTEGRATION TESTS (what we're doing now):
  - Test the ENTIRE REQUEST → ROUTE HANDLER → RESPONSE flow
  - Send a real HTTP request (via httpx.AsyncClient) to your FastAPI app
  - Mock only what's truly external (DB via mongomock, third-party APIs)
  - The route handler, request parsing, validation, and response serialization
    all run for REAL — nothing is skipped
  - Example: "when I POST to /api/auth/register with valid data, does the
    server actually return 200 with the expected message?"

THINK OF IT THIS WAY:
  Unit test  → Test the ENGINE of a car in isolation on a stand
  Integration test → Drive the car on a test track (no real traffic yet)

═══════════════════════════════════════════════════════════════════════════════
HOW THE TEST CLIENT WORKS
═══════════════════════════════════════════════════════════════════════════════

  async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
      response = await client.post("/api/auth/register", json={...})

  ASGITransport is the KEY: instead of making a real TCP network connection,
  it feeds requests directly into FastAPI's internal ASGI interface in memory.

  This means:
    ✅  Middleware runs (CORS, auth)
    ✅  FastAPI validates request body via Pydantic
    ✅  Route function executes
    ✅  Response is serialized to JSON
    ❌  No real network — no port needed, no server to start

═══════════════════════════════════════════════════════════════════════════════
HOW THE AUTH ROUTES WORK (what we're testing)
═══════════════════════════════════════════════════════════════════════════════

  POST /api/auth/register
    1. Receives { fullname, email, password } as JSON
    2. Checks if email already exists → 400 if so
    3. Hashes the password
    4. Saves User to MongoDB
    5. Returns { "message": "User registered successfully" }

  POST /api/auth/login
    1. Receives form data { username (= email), password }
    2. Finds user by email → 401 if not found
    3. Verifies password hash → 401 if wrong
    4. Creates a JWT token
    5. Sets token as an httpOnly cookie
    6. Returns { "message": "Login successful" }

  POST /api/auth/logout
    1. Protected by Depends(get_current_user) → needs valid cookie token
    2. Deletes the "token" cookie
    3. Returns { "message": "Successfully logged out." }

  GET /api/auth/me
    1. Protected by Depends(get_current_user)
    2. Returns the full User object for the authenticated user

═══════════════════════════════════════════════════════════════════════════════
THE MOCKING CHALLENGE: why we can't just mock everything
═══════════════════════════════════════════════════════════════════════════════

  The auth routes use Beanie's User model DIRECTLY (not through a service):
    - User.find_one(...)  → in register and login
    - user.insert()       → in register
    - get_current_user()  → uses User.find_one() for cookie auth

  STRATEGY:
    - We patch "api.auth_routes.User" for the register/login handlers
    - We override "get_current_user" using dependency_overrides for protected
      endpoints (/logout, /me) — the cleanest way to fake auth

  WHY dependency_overrides for auth:
    get_current_user() reads the cookie, decodes JWT, and queries the DB.
    That's 3 things to mock. Instead, we tell FastAPI:
      "For this test, replace get_current_user with a lambda that returns
       our fake user directly — skip all the token/DB logic."

    app.dependency_overrides[get_current_user] = lambda: fake_user
"""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId

# We import the real FastAPI app and the auth dependency we'll override
from main import app
from utils.auth import get_current_user
from models.user import User


# ─────────────────────────────────────────────────────────────────────────────
# FIXTURES — shared setup for multiple tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
async def client():
    """
    Creates an async HTTP test client for our FastAPI app.

    ASGITransport(app=app) → routes requests directly into FastAPI in-memory
    base_url="http://test" → a fake domain needed by httpx (never resolves)

    Using 'async with' ensures the client is properly closed after each test.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def mock_user():
    """
    A pre-built fake User object for tests that need an authenticated user.

    We use MagicMock (not a real User document) because:
      1. No DB needed — it's just a Python object with attributes
      2. We control exactly what attributes it has
      3. The route just reads attributes like current_user.email — MagicMock handles this
    """
    user = MagicMock()
    user.id = ObjectId()
    user.fullname = "Test User"
    user.email = "test@example.com"
    user.org_id = ObjectId()
    user.password = "hashed_pw"
    return user


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: POST /api/auth/register
# ─────────────────────────────────────────────────────────────────────────────

class TestRegister:
    """
    Integration tests for user registration.

    Key mocking pattern here:
      patch("api.auth_routes.User") replaces the entire User class inside the
      auth_routes module. This controls:
        - User.find_one(...) → class method for email lookup
        - User(...)          → constructor call to build new user
        - user.insert()      → instance method to save to DB
    """

    @pytest.mark.asyncio
    async def test_register_success(self, client):
        """
        WHAT: A valid registration creates a user and returns HTTP 200.
        WHY:  This is the primary happy path — verifies the entire
              register pipeline works end-to-end from HTTP request to response.

        WHAT RUNS FOR REAL:
          ✅ FastAPI parses the JSON body into UserRegister pydantic model
          ✅ Route handler logic executes
          ✅ get_password_hash() runs (real argon2 hashing)
          ✅ Response is serialized to JSON
        WHAT IS MOCKED:
          ❌ User.find_one() → returns None (no existing user)
          ❌ user.insert()   → pretends to save to DB
        """
        with patch("api.auth_routes.User") as MockUser:
            # ARRANGE: simulate no existing user found for this email
            MockUser.find_one = AsyncMock(return_value=None)
            MockUser.email = MagicMock()  # Beanie field comparison expression

            mock_instance = MagicMock()
            mock_instance.insert = AsyncMock()
            MockUser.return_value = mock_instance

            # ACT: send a real HTTP POST request
            response = await client.post(
                "/api/auth/register",
                json={
                    "fullname": "Jane Doe",
                    "email": "jane@example.com",
                    "password": "SecurePass123!"
                }
            )

        # ASSERT: check the HTTP status and JSON response body
        assert response.status_code == 200
        assert response.json() == {"message": "User registered successfully"}
        mock_instance.insert.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_duplicate_email_returns_400(self, client):
        """
        WHAT: Registering with an already-taken email returns HTTP 400.
        WHY:  Prevents duplicate accounts. The route checks for existing users
              before saving, and must reject duplicates with a clear message.

        This tests the GUARD CLAUSE in the route:
          if existing_user:
              raise HTTPException(status_code=400, detail="Email already registered")
        """
        with patch("api.auth_routes.User") as MockUser:
            # ARRANGE: simulate an existing user found for this email
            MockUser.find_one = AsyncMock(return_value=MagicMock())  # ← user exists!
            MockUser.email = MagicMock()

            # ACT
            response = await client.post(
                "/api/auth/register",
                json={
                    "fullname": "Jane Doe",
                    "email": "jane@example.com",
                    "password": "SecurePass123!"
                }
            )

        # ASSERT
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_register_missing_fields_returns_422(self, client):
        """
        WHAT: A request body missing required fields returns HTTP 422.
        WHY:  FastAPI uses Pydantic to validate the request body. If a required
              field is absent, it auto-rejects with 422 Unprocessable Entity
              BEFORE our route handler even runs.

        422 means: "I understood your request format, but the data is invalid."
        This is different from 400 (bad data we caught) or 404 (not found).

        We do NOT need to mock anything here — the validation failure happens
        before any DB or business logic code runs.
        """
        # ACT: send a request with only one of the three required fields
        response = await client.post(
            "/api/auth/register",
            json={"email": "only@email.com"}  # Missing fullname and password
        )

        # ASSERT
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_password_is_hashed(self, client):
        """
        WHAT: Verifies that the stored password is NEVER the plain-text password.
        WHY:  A critical security test. If the route accidentally saves the plain
              password, user accounts are compromised if the DB is breached.

        HOW: We capture the arguments the User() constructor was called with
             and verify that the 'password' argument doesn't match the input.
        """
        captured_args = {}

        with patch("api.auth_routes.User") as MockUser:
            MockUser.find_one = AsyncMock(return_value=None)
            MockUser.email = MagicMock()

            def capture_constructor(**kwargs):
                captured_args.update(kwargs)  # ← capture what was passed to User()
                instance = MagicMock()
                instance.insert = AsyncMock()
                return instance

            MockUser.side_effect = capture_constructor

            # ACT
            await client.post(
                "/api/auth/register",
                json={
                    "fullname": "Jane",
                    "email": "jane@example.com",
                    "password": "PlainTextPassword"
                }
            )

        # ASSERT: password stored must NOT be the plain text input
        assert "password" in captured_args
        assert captured_args["password"] != "PlainTextPassword"
        assert len(captured_args["password"]) > 20  # Hashed passwords are long


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: POST /api/auth/login
# ─────────────────────────────────────────────────────────────────────────────

class TestLogin:
    """
    Integration tests for user login.

    IMPORTANT — LOGIN USES FORM DATA NOT JSON:
      The login route uses OAuth2PasswordRequestForm which expects:
        Content-Type: application/x-www-form-urlencoded
        Body: username=...&password=...

      With httpx you send this as:
        await client.post("/api/auth/login", data={"username": ..., "password": ...})
        NOT: json={...}

      The field is called 'username' (OAuth2 standard) but it holds the email.
    """

    @pytest.mark.asyncio
    async def test_login_success_sets_cookie(self, client):
        """
        WHAT: Valid credentials return HTTP 200 and set an httpOnly cookie.
        WHY:  The cookie is the auth mechanism for the entire app. Every
              subsequent protected request reads this cookie. If it's not set
              correctly, no authenticated feature will work.

        WHAT WE CHECK:
          1. Status code is 200
          2. Response body has success message
          3. The "Set-Cookie" header is present in the response
          4. The cookie contains "HttpOnly" (cannot be read by JavaScript)
        """
        with patch("api.auth_routes.User") as MockUser, \
             patch("api.auth_routes.verify_password", return_value=True) as mock_verify:
            # ARRANGE
            mock_user = MagicMock()
            mock_user.email = "jane@example.com"
            mock_user.password = "hashed_password"
            MockUser.find_one = AsyncMock(return_value=mock_user)
            MockUser.email = MagicMock()

            # ACT: login uses form data (OAuth2 standard), NOT json
            response = await client.post(
                "/api/auth/login",
                data={
                    "username": "jane@example.com",
                    "password": "SecurePass123!"
                }
            )

        # ASSERT
        assert response.status_code == 200
        assert response.json()["message"] == "Login successful"
        # Verify the cookie was actually set in the response headers
        assert "set-cookie" in response.headers
        assert "token" in response.headers["set-cookie"]
        assert "HttpOnly" in response.headers["set-cookie"]

    @pytest.mark.asyncio
    async def test_login_wrong_password_returns_401(self, client):
        """
        WHAT: Incorrect password returns HTTP 401 Unauthorized.
        WHY:  Security baseline — wrong credentials must never succeed.
              401 specifically means "authentication failed."

        We mock verify_password to return False, simulating a hash mismatch.
        """
        with patch("api.auth_routes.User") as MockUser, \
             patch("api.auth_routes.verify_password", return_value=False):
            # ARRANGE: user found, but password check fails
            mock_user = MagicMock()
            mock_user.email = "jane@example.com"
            mock_user.password = "hashed_password"
            MockUser.find_one = AsyncMock(return_value=mock_user)
            MockUser.email = MagicMock()

            # ACT
            response = await client.post(
                "/api/auth/login",
                data={
                    "username": "jane@example.com",
                    "password": "WrongPassword!"
                }
            )

        # ASSERT
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_login_nonexistent_user_returns_401(self, client):
        """
        WHAT: Logging in with an unknown email returns HTTP 401.
        WHY:  Security — should NOT return 404 (which would leak info that
              the email doesn't exist). Both wrong email and wrong password
              must return the same generic 401 message to prevent enumeration.
        """
        with patch("api.auth_routes.User") as MockUser:
            # ARRANGE: no user found for this email
            MockUser.find_one = AsyncMock(return_value=None)
            MockUser.email = MagicMock()

            # ACT
            response = await client.post(
                "/api/auth/login",
                data={
                    "username": "nobody@example.com",
                    "password": "AnyPassword123!"
                }
            )

        # ASSERT: same error message as wrong password — no user enumeration
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_login_missing_credentials_returns_422(self, client):
        """
        WHAT: Sending an empty form body returns HTTP 422.
        WHY:  OAuth2PasswordRequestForm requires 'username' and 'password'.
              FastAPI validates this automatically and rejects malformed requests.
        """
        # ACT: send empty form data
        response = await client.post("/api/auth/login", data={})

        # ASSERT
        assert response.status_code == 422


# ─────────────────────────────────────────────────────────────────────────────
# TESTS FOR: POST /api/auth/logout  and  GET /api/auth/me
# ─────────────────────────────────────────────────────────────────────────────

class TestProtectedRoutes:
    """
    Integration tests for routes protected by Depends(get_current_user).

    THE KEY TECHNIQUE: dependency_overrides

    Instead of mocking get_current_user's internals (cookie parsing, JWT
    decoding, DB lookup), we tell FastAPI to swap the whole dependency:

        app.dependency_overrides[get_current_user] = lambda: fake_user

    Now every route that has `Depends(get_current_user)` will instantly
    receive 'fake_user' without running the real auth logic.

    IMPORTANT CLEANUP RULE:
      Always call app.dependency_overrides.clear() after the test.
      If you don't, the override leaks into OTHER tests and can cause
      false positives (tests pass even without proper auth).
      We handle this cleanly with a try/finally block.
    """

    @pytest.mark.asyncio
    async def test_logout_success(self, client, mock_user):
        """
        WHAT: An authenticated user can log out and the token cookie is cleared.
        WHY:  Verifies the logout mechanism actually removes the cookie.
              Without this, users who click "logout" remain authenticated.

        WHAT WE CHECK:
          1. Status code is 200
          2. The response body has the correct message
          3. The Set-Cookie header explicitly expires/clears the "token" cookie
        """
        # ARRANGE: override auth dependency with our fake user
        app.dependency_overrides[get_current_user] = lambda: mock_user
        try:
            # ACT
            response = await client.post("/api/auth/logout")

            # ASSERT
            assert response.status_code == 200
            assert response.json() == {"message": "Successfully logged out."}
            # FastAPI's delete_cookie() sets the cookie with max-age=0
            # which tells the browser to delete it
            assert "set-cookie" in response.headers
            assert "token" in response.headers["set-cookie"]
        finally:
            # CLEANUP: always remove the override so it doesn't bleed into other tests
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_logout_without_auth_returns_401(self, client):
        """
        WHAT: Calling /logout without authentication returns HTTP 401.
        WHY:  The logout endpoint is protected. Unauthenticated users should
              not be able to reach it — FastAPI's dependency injection handles this.

        NOTE: We do NOT set dependency_overrides here.
              The real get_current_user runs, finds no cookie, and raises 401.
        """
        # ACT: no cookie, no override → real auth runs → should fail
        response = await client.post("/api/auth/logout")

        # ASSERT
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_me_returns_current_user(self, client, mock_db):
        """
        WHAT: GET /api/auth/me returns the data of the authenticated user.
        WHY:  This endpoint is how the frontend knows "who am I?" after login.
              The response must contain the authenticated user's data.

        HOW: We use the 'mock_db' fixture to ensure Beanie is initialized.
             This allows us to create real User objects that pass FastAPI's
             response_model validation without triggering CollectionWasNotInitialized.
        """
        # ARRANGE: build a real User object
        real_user = User(
            id=ObjectId(),
            fullname="Test User",
            email="test@example.com",
            password="hashed_pw_not_returned",
        )
        # We don't even need to save it to DB because we're overriding the dependency
        app.dependency_overrides[get_current_user] = lambda: real_user
        try:
            # ACT
            response = await client.get("/api/auth/me")

            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert data["email"] == "test@example.com"
            assert data["fullname"] == "Test User"
            assert "password" not in data
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_me_without_auth_returns_401(self, client):
        """
        WHAT: Calling /me without authentication returns HTTP 401.
        WHY:  The /me endpoint reveals user identity info — it must require
              valid authentication.
        """
        # ACT: no auth → real get_current_user runs → no cookie → 401
        response = await client.get("/api/auth/me")

        # ASSERT
        assert response.status_code == 401
