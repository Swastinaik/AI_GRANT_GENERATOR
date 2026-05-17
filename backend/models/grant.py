from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field
from typing import Optional

class Grant(Document):
    grant_id: str
    title: str
    agency: str
    agencyCode: str
    openDate: str
    closeDate: str
    link: str
    score: Optional[str] = ""
    user_id: PydanticObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "grants"
