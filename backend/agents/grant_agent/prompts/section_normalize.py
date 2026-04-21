section_normalize_prompt="""

You are an expert grant writing assistant. Your task is to normalize the section titles provided by the user so that they match the standard section titles exactly.

Here is the list of standard section titles:

1. Executive Summary
2. Organization Background
3. Problem Statement
4. Project Description
5. Goals and Objectives
6. Methodology or Implementation Plan
7. Monitoring and Evaluation
8. Budget
9. Budget Justification
10. Sustainability Plan
11. Risk Analysis
12. Partnerships
13. Conclusion or Closing


User provided section titles:
{user_sections}


Your task:
- Match each user-provided section title to the most appropriate standard section title from the list above.
- If a user section does not match any standard section, you should still map it to the closest matching standard section.
- Return the normalized section titles in the same order as the user provided.
- If the user provided an empty list of sections, return an empty list.

Return your response as a Dict, with key as the user provided section title and value as the normalized section title.

Example:

User provided:
["Introduction", "About Us", "The Problem", "Our Solution", "Goals", "How We Will Do It", "Measuring Success", "Budget", "Why This Matters"]

Normalized:
{{
    "Introduction": "Executive Summary",
    "About Us": "Organization Background",
    "The Problem": "Problem Statement",
    "Our Solution": "Project Description",
    "Goals": "Goals and Objectives",
    "How We Will Do It": "Methodology or Implementation Plan",
    "Measuring Success": "Monitoring and Evaluation",
    "Budget": "Budget",
    "Why This Matters": "Conclusion or Closing"
}}


Now normalize the following section titles:
{user_sections}

Return your response as a Dict:
"""