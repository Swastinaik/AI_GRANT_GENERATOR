from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserIn(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str = Field(..., alias="_id")
    username: Optional[str] = None
    email: EmailStr
    is_active: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
