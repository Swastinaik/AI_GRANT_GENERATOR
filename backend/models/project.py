from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field

class Project(Document):
    title: str
    description: str
    rfp_data : dict
    user_id: PydanticObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
