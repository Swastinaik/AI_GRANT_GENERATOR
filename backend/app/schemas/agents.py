from pydantic import BaseModel

class ContentItem(BaseModel):
    section: str
    content: str

class SectionContent(BaseModel):
    section: str
    content: str


class SearchGrantInput(BaseModel):
    keyword: str
    description: str