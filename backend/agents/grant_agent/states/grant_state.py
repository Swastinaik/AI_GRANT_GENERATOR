from typing import Optional
from typing_extensions import TypedDict, Annotated, Dict, Any


class SectionContext(TypedDict):
    description: Optional[str]
    org_data_required: Optional[str]
    org_data: Optional[str]
    predefined_name: Optional[str]

class Section(TypedDict):
    constraints: Optional[Dict[str, str]]
    context: Optional[SectionContext]
    content: Optional[str]

class GrantState(TypedDict):
    default_section: bool
    orgId: str
    user_input: Dict[str, str]
    sections: Dict[str, Section]
    rfp_constraints: Dict[str, str]
    error: Optional[str]  # populated by any node on failure
    final_output: Optional[Dict[str, Any]]
