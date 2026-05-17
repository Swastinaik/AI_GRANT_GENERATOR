"""
test_project_routes.py — Integration tests for /api/project endpoints

WHAT WE'RE TESTING:
  The project routes handle fetching and creating projects. These tests
  ensure that the API correctly interacts with the Project model and
  services, and returns the expected status codes and data structures.

WHY THESE TESTS MATTER:
  - Verifies that projects can be retrieved for the logged-in user.
  - Ensures that the 'get single project' endpoint works correctly.
  - Confirms that authentication is enforced for all project routes.

PATTERN: Integration testing with dependency overrides for auth.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from bson import ObjectId
from main import app
from utils.auth import get_current_user
from models import Project, User

@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest.fixture
def fake_user():
    return User(
        id=ObjectId(),
        fullname="Test User",
        email="test@example.com",
        password="hashed_password"
    )

class TestProjectRoutes:

    @pytest.mark.asyncio
    async def test_get_all_projects_empty(self, client, mock_db, fake_user):
        """
        WHAT: GET /api/project returns an empty list when no projects exist.
        WHY:  Ensures the basic list endpoint is working and returns 200.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        
        try:
            # ACT
            response = await client.get("/api/project")
            
            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert data["projects"] == []
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_all_projects_with_data(self, client, mock_db, fake_user):
        """
        WHAT: GET /api/project returns the user's projects.
        WHY:  Ensures that projects stored in the DB are correctly retrieved and filtered.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        
        project1 = Project(
            title="Project 1",
            description="Desc 1",
            rfp_data={},
            user_id=fake_user.id
        )
        await project1.insert()
        
        try:
            # ACT
            response = await client.get("/api/project")
            
            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert len(data["projects"]) == 1
            assert data["projects"][0]["title"] == "Project 1"
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_single_project_success(self, client, mock_db, fake_user):
        """
        WHAT: GET /api/project/{id} returns the specific project.
        WHY:  Verifies that a project can be fetched by its ID.
        """
        # ARRANGE
        app.dependency_overrides[get_current_user] = lambda: fake_user
        
        project = Project(
            title="Single Project",
            description="Specific Desc",
            rfp_data={"key": "value"},
            user_id=fake_user.id
        )
        await project.insert()
        project_id = str(project.id)
        
        try:
            # ACT
            response = await client.get(f"/api/project/{project_id}")
            
            # ASSERT
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            assert data["project"]["title"] == "Single Project"
            assert data["project"]["rfp_data"]["key"] == "value"
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_project_routes_require_auth(self, client, mock_db):
        """
        WHAT: Project routes return 401 if no user is authenticated.
        WHY:  Ensures security for sensitive project data.
        """
        # ACT
        response = await client.get("/api/project")
        
        # ASSERT
        assert response.status_code == 401
