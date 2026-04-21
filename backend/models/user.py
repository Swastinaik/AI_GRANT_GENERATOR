from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field

class User(Document):
    id: Optional[PydanticObjectId] = Field(default_factory=None, alias="_id")
    fullname: str
    email: str
    password: str
    org_id: Optional[PydanticObjectId] = None

    class Settings:
        name = "users"
