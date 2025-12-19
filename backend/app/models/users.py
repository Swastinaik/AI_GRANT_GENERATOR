from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: str | None = None
    username: str
    email: str
    isAdmin: bool = False

class UserCreate(User):
    password: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Usage(BaseModel):
    email: str
    count: int
    date: datetime