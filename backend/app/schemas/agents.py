from pydantic import BaseModel, Field
from typing import List

class ContentItem(BaseModel):
    section: str
    content: str

class SectionContent(BaseModel):
    section: str
    content: str


class SearchGrantInput(BaseModel):
    keyword: str
    description: str


class PodcastRequest(BaseModel):
    user_input: str | None = None


class GrantReviewOutput(BaseModel):
    score: int = Field(description="The score of the grant proposal out of 100")
    recommendation: List[str] = Field(description="A list of detailed suggestions for improvement")
    