from typing import Optional
from beanie import Document
from pydantic import BaseModel

class OrgData(BaseModel):
    organization_overview: Optional[str] = None
    programs_and_key_activities: Optional[str] = None
    impact_and_achievements: Optional[str] = None
    past_projects_and_funding_experience: Optional[str] = None
    team_and_leadership: Optional[str] = None
    organizational_capacity_and_finance: Optional[str] = None
    areas_of_operation: Optional[str] = None

class Organization(Document):
    name: str
    org_data: Optional[OrgData] = None

    class Settings:
        name = "organizations"
