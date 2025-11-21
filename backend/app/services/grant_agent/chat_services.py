import sys
import os
import traceback
import json
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(project_root)
from services.grant_agent.content_generation import generate_cover_letter, generate_sustainibility_plan, generate_executive_summary, generate_organization_background, generate_statement_need, generate_project_description, generate_evaluation_plan, generate_budgets




def generate_grant_proposal(company_object, user_input):
    company_object = json.loads(company_object)
    try:
        answers = []
        cover_letter = generate_cover_letter(company_object, user_input)
        answers.append({"section":"Cover Letter", "answer":cover_letter.content})
        executive_summary = generate_executive_summary(company_object, user_input)
        answers.append({"section": "Executive Summary","answer": executive_summary.content })
        organization_background = generate_organization_background(company_object)
        answers.append({"section": "Organization Background", "answer": organization_background.content})
        project_description = generate_project_description(company_object, user_input)
        answers.append({"section":"Project Description", "answer":project_description.content})
        statement_need = generate_statement_need(company_object, user_input)
        answers.append({"section":"Statement Need", "answer":statement_need.content})
        evaluation_plan = generate_evaluation_plan(company_object, user_input)
        answers.append({"section":"Evaluation Plan", "answer": evaluation_plan.content})
        budgets = generate_budgets(company_object, user_input)
        answers.append({"section": "Budget Breakdown", "answer": budgets.budget_breakdown})
        answers.append({"section": "Budget Narrative", "answer": budgets.budget_narrative})
        sustainability_plan = generate_sustainibility_plan(company_object, user_input)
        answers.append({"section":"Sustainability Plan", "answer": sustainability_plan.content})
        return answers
    except Exception as e:
        print("Error while generating grant proposal:", e)
        traceback.print_exc()
        return None