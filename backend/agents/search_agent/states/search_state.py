from typing_extensions import TypedDict, Dict, Optional

class UserInput(TypedDict):
    description: str
    eligibilities: str
    domain: str
    target_benef: str

class Grant(TypedDict):
    id: str
    title: str
    agency: str
    agencyCode: str
    openDate: str
    closeDate: str
    link: str
    score: Optional[int]

class SearchState(TypedDict):
    user_input : UserInput
    keyword: Optional[str]
    grants: Optional[list[Grant]]
    error: Optional[str]