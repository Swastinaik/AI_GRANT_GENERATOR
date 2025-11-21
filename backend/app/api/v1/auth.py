from fastapi import APIRouter, HTTPException, status, Response, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from app.services.users import user as crud_users
from app.models.users import User
from app.core import security
from app.core.config import settings
from datetime import datetime
from jose import JWTError

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=201)
async def register(payload: dict):
    # expect {"email": "...", "password": "..."}
    username = payload.get("username")
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    # try create; unique index will enforce uniqueness
    try:
        user = await crud_users.create_user(username, email, password)
    except Exception as e:
        # simplistic; in prod, check for duplicate key error specifically
        raise HTTPException(status_code=400, detail="User with that email already exists")
    user = User(**user)  # convert to Pydantic model
    user = user.model_dump()
    return user


@router.post("/login")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    # form_data.username = email
    user = await crud_users.verify_user_credentials(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    # create access token and refresh token (with jti)
    access = security.create_access_token(subject=user["_id"])
    refresh_token = security.create_refresh_token(subject=user["_id"])
    # set refresh token cookie (HttpOnly, Secure)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # set True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS,
        path="/"
    )
    return {"access_token": access, "token_type": "bearer"}


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    try:
        payload = security.decode_token(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not a refresh token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    # compare stored hashed jti
    user = await crud_users.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="USer not found")
    exp = payload.get('exp')
    token_valid = security.validate_token_expiry(exp)
    if  token_valid == False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="refrsh token expired ")
    # rotation: issue new refresh token and replace stored jti
    new_access = security.create_access_token(subject=user_id)
    new_refresh = security.create_refresh_token(subject=user_id)
    # set cookie with new refresh token
    response.set_cookie(
        key="refresh_token",
        value=new_refresh,
        httponly=True,
        secure=False,  # True in prod
        samesite="lax",
        max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_EXPIRE_DAYS,
        path="/"
    )
    return {"access_token": new_access, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token", path="/")
    return JSONResponse({"detail": "Logged out"}, status_code=200)
