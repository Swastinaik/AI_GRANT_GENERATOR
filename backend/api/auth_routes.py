from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict, Any
from pydantic import BaseModel
from datetime import timedelta

from models.user import User
from utils.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user
)

router = APIRouter()

class UserRegister(BaseModel):
    fullname: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Dict[str, Any])
async def register(user_data: UserRegister):
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user = User(
        fullname=user_data.fullname,
        email=user_data.email,
        password=hashed_password
    )
    await user.insert()
    
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    # Set token as an httpOnly cookie — not accessible by JS
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {"message": "Login successful"}

@router.post("/logout")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    # Clear the httpOnly cookie on the client
    response.delete_cookie(key="token", path="/")
    return {"message": "Successfully logged out."}

@router.get("/me", response_model=User)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
    
