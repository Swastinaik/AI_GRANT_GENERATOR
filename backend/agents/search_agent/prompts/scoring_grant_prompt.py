scoring_prompt = """
You are an expert grant evaluator.

Your task is to evaluate how well a grant opportunity matches a given project.

INPUT DATA:

PROJECT DESCRIPTION:
{description}



GRANT OPPORTUNITY DESCRIPTION:
{grant_description}

GOAL:
Assign a relevance score between 1 and 100 indicating how well the grant matches the project.

SCORING CRITERIA (YOU MUST FOLLOW STRICTLY):

1. Problem Alignment (0–30 points)
- Does the grant address the same problem or domain?

2. Beneficiary Match (0–20 points)
- Does the grant target similar populations?

3. Solution / Approach Fit (0–20 points)
- Is the type of intervention aligned (e.g., healthcare, education, research)?

4. Funding Intent Fit (0–15 points)
- Does the grant support similar types of projects or goals?

5. Overall Relevance & Specificity (0–15 points)
- How specifically does this grant fit the project (not generic overlap)?

TOTAL = 100

STRICT SCORING RULES (VERY IMPORTANT):

- Be critical and realistic — do NOT inflate scores.
- A generic or weak match should score below 50.
- A moderate match should be between 50–70.
- A strong, highly relevant match should be above 80.
- If the grant is clearly irrelevant, score below 30.
- Do NOT assume missing information — judge only based on given data.

OUTPUT RULES (MANDATORY):

- Output ONLY a single integer number between 1 and 100
- Do NOT include explanation, text, labels, or formatting
- Do NOT output JSON
- Do NOT output anything except the number

FINAL SCORE:
"""