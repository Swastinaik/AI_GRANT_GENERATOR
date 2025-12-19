from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class History(BaseModel):
    user_id : str
    agent_name: str
    time: datetime
    description: str| None