section_prompts = {

    "Executive Summary": f"""
You are an expert grant writer.

Write the Executive Summary section of a grant proposal.

SECTION PURPOSE:
Provide a concise summary of the entire proposal including problem, solution, beneficiaries, outcomes, and funding need.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}


AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Clearly summarize the problem and urgency
- Describe the proposed solution
- Highlight target beneficiaries
- Include expected outcomes with measurable impact
- Keep it concise and compelling

OUTPUT RULES:
- Return ONLY the final section text
- Do NOT include headings, labels, or explanations
- Ensure clarity, coherence, and professional tone
""",



"Organization Background": f"""
You are an expert grant writer.

Write the Organization Background section.

SECTION PURPOSE:
Demonstrate the organization’s credibility, experience, and ability to execute the project.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}


AVAILABLE DATA:
- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Describe mission and vision
- Highlight years of experience
- Include key programs and past projects
- Emphasize measurable impact and achievements
- Showcase team expertise and operational capacity

OUTPUT RULES:
- Return ONLY the final section text
- No headings or meta commentary
""",



    "Problem Statement": f"""
You are an expert grant writer.

Write the Problem Statement section.

SECTION PURPOSE:
Clearly define the problem being addressed with strong justification.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Clearly describe the problem
- Identify affected population and geography
- Include relevant statistics or evidence if available
- Explain urgency and significance
- Align problem with funder priorities if present

OUTPUT RULES:
- Return ONLY the final section text
- No headings or explanations
""",

    "Project Description": f"""
You are an expert grant writer.

Write the Project Description section.

SECTION PURPOSE:
Explain what the project is and how it addresses the problem.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Describe the project clearly
- Explain how it solves the problem
- Identify key components of the project
- Highlight beneficiaries and scope
- Ensure logical flow from problem to solution

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Goals and Objectives": f"""
You are an expert grant writer.

Write the Goals and Objectives section.

SECTION PURPOSE:
Define clear goals and measurable objectives.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

INSTRUCTIONS:
- State high-level goals
- Define specific, measurable objectives (SMART)
- Include numbers and timelines
- Ensure objectives align with project activities

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Methodology or Implementation Plan": f"""
You are an expert grant writer.

Write the Methodology / Implementation Plan section.

SECTION PURPOSE:
Describe how the project will be executed.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Describe key activities
- Explain implementation approach
- Include timeline or phases
- Define roles and responsibilities
- Ensure feasibility and clarity

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Monitoring and Evaluation": f"""
You are an expert grant writer.

Write the Monitoring and Evaluation section.

SECTION PURPOSE:
Explain how project success will be measured.

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

INSTRUCTIONS:
- Define key performance indicators (KPIs)
- Explain data collection methods
- Describe evaluation process
- Link outcomes to measurable results

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Budget": f"""
You are an expert grant writer.

Write the Budget section.

SECTION PURPOSE:
Present a clear financial overview of the project.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

INSTRUCTIONS:
- Summarize major cost categories
- Ensure alignment with project activities
- Present realistic and justified estimates

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Budget Justification": f"""
You are an expert grant writer.

Write the Budget Justification section.

SECTION PURPOSE:
Explain why each cost is necessary.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

INSTRUCTIONS:
- Justify major expenses
- Link costs to activities
- Ensure logical reasoning and transparency

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Sustainability Plan": f"""
You are an expert grant writer.

Write the Sustainability Plan section.

SECTION PURPOSE:
Explain how the project will continue after funding ends.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Describe long-term impact strategy
- Include future funding or revenue plans
- Highlight community involvement
- Explain scalability if applicable

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Risk Analysis": f"""
You are an expert grant writer.

Write the Risk Analysis section.

SECTION PURPOSE:
Identify risks and mitigation strategies.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

INSTRUCTIONS:
- Identify key risks
- Explain likelihood and impact
- Provide mitigation strategies
- Show preparedness

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Partnerships": f"""
You are an expert grant writer.

Write the Partnerships section.

SECTION PURPOSE:
Highlight collaborations that strengthen the proposal.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

SECTION-SPECIFIC CONSTRAINTS (MUST FOLLOW):
{{section_constraints}}


AVAILABLE DATA:
- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Identify key partners
- Describe roles and contributions
- Explain how partnerships improve outcomes

OUTPUT RULES:
- Return ONLY the final section text
""",

    "Conclusion or Closing": f"""
You are an expert grant writer.

Write the Conclusion section.

SECTION PURPOSE:
Reinforce the proposal and persuade the funder.

STRICT RFP CONSTRAINTS (MUST FOLLOW):
{{rfp_constraints}}

AVAILABLE DATA:
- User Input:
{{user_input}}

- Organization Data:
{{org_data}}

INSTRUCTIONS:
- Summarize key points
- Reinforce impact and alignment
- End with a strong persuasive closing

OUTPUT RULES:
- Return ONLY the final section text
"""
}