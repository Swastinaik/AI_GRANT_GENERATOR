from typing import Optional, Literal, Any
from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field

class Proposal(Document):
    file_url: Optional[str] = None
    type: Literal["review", "generate"]
    output_json: Optional[Any] = None  # Using Any for generic JSON structure
    review: Optional[str] = None
    project_id: PydanticObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "proposals"
