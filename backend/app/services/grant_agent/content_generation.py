import traceback
import sys
import os
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(project_root)
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import  ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
load_dotenv()
google_api_key = os.environ.get('GOOGLE_API_KEY')
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)
from pydantic import BaseModel, Field

BASE_PROMPT = """
    You are a professional grant writer.
    You are writing a grant proposal for a non-profit organization.
    always add the "\n" at the end of the sentence.
    if there is a line break needed add "\n" at the end of the sentence.
"""

class GrantBudgetSection(BaseModel):
    """
    Represents the parsed output for the Budget and Budget Narrative section of a grant proposal.
    """
    budget_breakdown: str = Field(
        ...,
        description="The structured presentation of the budget, such as a table or list of budget categories and totals."
    )
    budget_narrative: str = Field(
        ...,
        description="The narrative explaining and justifying the budget items and demonstrating alignment with the project goals and organizational mission/vision."
    )
def generate_cover_letter(company_object, user_input):
    overall_summary = company_object["overall_summary"]
    profile_summary = company_object["profile_summary"]
    input_cover_letter = user_input["cover_letter"]
    project_summary = user_input["project_summary"]
    print("overall_summary type", type(overall_summary) )
    try:
        prompt_cover_letter = PromptTemplate(
        input_variables=["overall_summary","profile_summary","input_cover_letter","project_summary", "base_prompt"],
        template=("""
        You are a professional grant writer.
        {base_prompt}
        Write a cover letter for a grant proposal for a non-profit organization.
        ### Organizational Context:
        {overall_summary} and {profile_summary}
        ### Current Funding Request:
        {project_summary} is the overall summary of the project.
        {input_cover_letter}
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work,""")
        )
        chain = prompt_cover_letter | llm
        print("About to invoke the chain for cover letter")
        cover_letter = chain.invoke({
            "overall_summary": overall_summary,
            "profile_summary": profile_summary,
            "input_cover_letter": input_cover_letter,
            "project_summary": project_summary,
            "base_prompt": BASE_PROMPT
            })
        print("cover letter   ", cover_letter)
        return cover_letter
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None

def generate_executive_summary(company_object, user_input):
    try:
        prompt_executive_summary = PromptTemplate(
        input_variables=["overall_summary","profile_summary","project_summary","input_executive_summary", "base_prompt"],
        template=("""
        You are a professional grant writer.
        Write an executive summary for a grant proposal for a non-profit organization.
                  {base_prompt}
        ### Organizational Context:
        {overall_summary} and {profile_summary}
        ### Current Funding Request:
        this is the overall summary of the project: {project_summary}
        {input_executive_summary}
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work,""")
        )
        chain = prompt_executive_summary | llm
        print("About to invoke the chain for executive summary")
        executive_summary = chain.invoke({
            "overall_summary": company_object["overall_summary"],
            "profile_summary": company_object["profile_summary"],
            "input_executive_summary": user_input["executive_summary"],
            "project_summary": user_input["project_summary"],
            "base_prompt": BASE_PROMPT
            })
        return executive_summary
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None

def generate_organization_background(company_object):
    try:
        prompt_organization_background = PromptTemplate(
        input_variables=["overall_summary","profile_summary", "base_prompt"],
        template=("""
        You are a professional grant writer.
                  {base_prompt}
        Write an organization background for a grant proposal for a non-profit organization.
        ### Organizational Context:
        {overall_summary} and {profile_summary}
    
        These are the overall summary and profile summary of the organization.
        generate an impressive background content for the organization.
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work,""")
        )
        chain =  prompt_organization_background | llm
        print("About to invoke the chain for organization background")
        organization_background = chain.invoke({
            "overall_summary": company_object["overall_summary"],
            "profile_summary": company_object["profile_summary"],
            "base_prompt": BASE_PROMPT
            })
        return organization_background
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None

def generate_statement_need(company_object, user_input):
    try:
        prompt_statement_need = PromptTemplate(
        input_variables=["mission_vision","project_summary","input_statement_need", "base_prompt"],
        template=("""
        You are a professional grant writer.
                  {base_prompt}
        Write a statement of need for a grant proposal for a non-profit organization.
        ### Organizational Context:
        {project_summary} is the overall summary of the project.
        {mission_vision} is the mission and vision of the organization.
        ### Current Funding Request:
        {project_summary} is the overall summary of the project.
        {input_statement_need} is the statement of need for this current project.
        incorporate the mission and vision of the organization into the statement of need.
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work,""")
        )
        chain =  prompt_statement_need | llm 
        print("About to invoke the chain for statement need")
        statement_need = chain.invoke({
            "mission_vision": company_object["mission_vision"],
            "input_statement_need": user_input["statement_need"],
            "project_summary": user_input["project_summary"],
            "base_prompt": BASE_PROMPT
            })
        return statement_need
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None

def generate_project_description(company_object, user_input):
    try:
        prompt_project_description = PromptTemplate(
        input_variables=["mission_vision","project_summary","input_project_description","base_prompt"],
        template=("""
        You are a professional grant writer.
        Write a project description for a grant proposal for a non-profit organization.
                  {base_prompt}
        ### Organizational Context:
        {project_summary} is the overall summary of the project.
        {mission_vision} is the mission and vision of the organization.
        ### Project Description:
        {project_summary} is the overall summary of the project.
        {input_project_description}
        incorporate the mission and vision of the organization into the project description.
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work that is their mission vision,""")
        )
        chain =  prompt_project_description | llm 
        print("About to invoke the chain for project description")
        project_description = chain.invoke({
            "mission_vision": company_object["mission_vision"],
            "input_project_description": user_input["project_description"],
            "project_summary": user_input["project_summary"],
            "base_prompt": BASE_PROMPT
            })
        return project_description
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None
    
def generate_evaluation_plan(company_object, user_input):
    try:
        prompt_evaluation_plan = PromptTemplate(
        input_variables=["mission_vision","project_summary","input_evaluation_plan", "base_prompt"],
        template=("""
        {base_prompt}
        ### Organizational Context:
        {mission_vision} is the mission and vision of the organization.
        ### Evaluation Plan:
        {project_summary} is the overall summary of the project.
        {input_evaluation_plan}
        incorporate the mission and vision of the organization into the evaluation plan.
        Ensure the writing is persuasive, clearly articulates the value of the organization’s past work that is their mission vision,""")
        )
        chain = prompt_evaluation_plan | llm  
        print("About to invoke the chain for evaluation plan")
        evaluation_plan = chain.invoke({
            "mission_vision": company_object["mission_vision"],
            "input_evaluation_plan": user_input["evaluation_plan"],
            "project_summary": user_input["project_summary"],
            "base_prompt": BASE_PROMPT
            })
        return evaluation_plan
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None
    
def generate_budgets(company_object, user_input):
    try:
        parser = PydanticOutputParser(pydantic_object=GrantBudgetSection)
        prompt_budgets = PromptTemplate(
        input_variables=["input_budgets","mission_vision","format_instructions","base_prompt"],
        template=("""
        {base_prompt}
        You are an AI assistant specializing in writing grant proposals for non-profit organizations, specifically for AI-related projects. Your task is to generate the "Budget and Budget Narrative" section based on the provided budget details and the organization's mission and vision.

        The Budget section should clearly present the project costs. The Budget Narrative should explain and justify these costs, demonstrating how they are necessary for the project's success and how they align with the organization's mission and vision.

        **Input Variables:**

        1.  `input_budgets`: This variable contains the detailed budget breakdown for the AI project. This could be in various formats (e.g., a list of line items with costs, a dictionary, or plain text describing the budget). Process this information to create a structured budget presentation.
        2.  `mission_vision`: This variable contains the mission and vision statement of the organization applying for the grant.

        **Output Structure:**

        Generate the content for the "Budget and Budget Narrative" section, which should include:

        1.  **Budget Table/Breakdown:** Present the budget information from `input_budgets` in a clear, organized format (e.g., a simple table, a list of categories with totals). Include major cost categories relevant to an AI project (e.g., Personnel, Technology/Software, Equipment, Travel, Other Direct Costs, Indirect Costs if applicable).
        2.  **Budget Narrative:** Write a narrative that:
        * Explains each major cost category and the key expenses within it.
        * Justifies why each expense is necessary for the successful implementation of the proposed AI project.
        * Explicitly connects how the requested funds, as detailed in the budget, will enable the achievement of the project's goals and contribute to the organization's overall `mission_vision`.
        * Mention any matching funds or in-kind contributions if that information is available in `input_budgets`.
        * Ensure the tone is professional, transparent, and persuasive.

        **Prompt:**

        Generate the "Budget and Budget Narrative" section for an AI grant proposal using the following information:

        **Budget Details (`input_budgets`):**
        {input_budgets}

        **Organization's Mission and Vision (`mission_vision`):**
        {mission_vision}

        ---
        ***Output Instructions: {format_instructions}***
        Please provide the Budget Table/Breakdown followed by the Budget Narrative. Ensure the narrative effectively links the expenses to the project activities, expected outcomes, and the organization's mission and vision.,""")
        )
        chain =  prompt_budgets | llm | parser
        print("About to invoke the chain for budgets")
        budgets = chain.invoke({
            "mission_vision": company_object["mission_vision"],
            "input_budgets": user_input["budgets"],
            "base_prompt": BASE_PROMPT,
            "format_instructions": parser.get_format_instructions()
            })
        return budgets
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None

def generate_sustainibility_plan(company_object, user_input):
    try:
        prompt_sustainibility_plan = PromptTemplate(
        input_variables=["mission_vision","achievements","history","input_sustainibility_plan","project_summary","base_prompt"],
        template=("""
           {base_prompt}
            ***ORganization Context:***
            mission vision: {mission_vision}
            achievements: {achievements}
            history: {history}
            And this is the overall summary of the project: {project_summary}
            And this is the current project's sustainibility plan: {input_sustainibility_plan}
            generate a sustainibility plan for the project.
            incoroprating the organization's context and """)
        )
        chain = prompt_sustainibility_plan | llm 
        print("About to invoke the chain for sustainability plan")
        sustainability_plan = chain.invoke({
            "mission_vision": company_object["mission_vision"],
            "input_sustainibility_plan": user_input["sustainibility_plan"],
            "achievements": company_object["achievements"],
            "history": company_object["history"],
            "project_summary": user_input["project_summary"],
            "base_prompt": BASE_PROMPT
            })
        return sustainability_plan
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 
        return None