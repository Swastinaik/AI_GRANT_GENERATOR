from typing import List, Optional, Literal
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


ReviewCategory = Literal[
    "RFP Alignment & Compliance",
    "Problem & Impact Definition",
    "Program Design, Feasibility & Budget Logic",
    "Organizational Capacity & Sustainability",
    "Writing Quality & Persuasiveness"
]


class CategoryEvaluation(BaseModel):
    category: ReviewCategory = Field(
        ...,
        description="User-facing evaluation category name. Must exactly match one of the 5 allowed categories."
    )

    score: int = Field(
        ...,
        ge=0,
        le=20,
        description="Score for the category out of 20"
    )

    strengths: List[str] = Field(
        default_factory=list,
        description="Key strengths identified in the proposal"
    )

    weaknesses: List[str] = Field(
        default_factory=list,
        description="Key weaknesses or concerns identified in the proposal"
    )

    missing_requirements: List[str] = Field(
        default_factory=list,
        description="RFP requirements or expectations missing from the proposal"
    )

    recommendations: List[str] = Field(
        default_factory=list,
        description="Specific actionable recommendations for improvement"
    )


class GrantReviewResponse(BaseModel):
    overall_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Overall proposal score normalized to 100"
    )

    overall_summary: str = Field(
        ...,
        description="Concise overall assessment of the proposal"
    )

    categories: List[CategoryEvaluation] = Field(
        ...,
        min_length=5,
        max_length=5,
        description="Evaluation results for the 5 user-facing categories"
    )


class GrantReviewState(TypedDict):
    rfp: str
    proposal: str
    review_result: Optional[GrantReviewResponse]
    error: Optional[str]
