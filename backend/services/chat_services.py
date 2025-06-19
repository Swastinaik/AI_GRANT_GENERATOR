import sys
import os
import traceback
import json
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(project_root)
from utils.content_generation import generate_cover_letter, generate_sustainibility_plan, generate_executive_summary, generate_organization_background, generate_statement_need, generate_project_description, generate_evaluation_plan, generate_budgets

from langchain_google_genai import ChatGoogleGenerativeAI


from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

# Now you can access the variables using os.environ.get() as usual
google_api_key = os.environ.get('GOOGLE_API_KEY')
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)



'''
def generate_content(docs, user_input):
    print("Generating content...")
    retriever = build_org_vector(docs)
    answers = []
    for i in range(0,len(RETRIEVAL_QUERIES_ARRAY)-1):
        context = retriever.similarity_search(RETRIEVAL_QUERIES_ARRAY[i]["query"], k=3)
        print("entering context")
        print("Context:", context)
        context_string = "\n".join([doc.page_content for doc in context])
        input = user_input[i]
        prompt = PromptTemplate(
            input_variables=["context", "input", "section"],
            template=("""
                You are a professional grant writer.
                Write the **{section}** of a grant proposal for a non-profit organization.
                ### Organizational Context:
                {context}
                ### Current Funding Request:
                {input}
                Ensure the writing is persuasive, clearly articulates the value of the organization’s past work,
                 and connects it logically to the current funding needs. Use a professional and optimistic tone, and format the content suitable for a grant application.
                Return only the text for the section: **{section_name}**."""
            )
        )
        chain = prompt|llm
        print("About to invoke the chain")
        answer = chain.invoke({
            "context":context_string,
            "input": input,
            "section": RETRIEVAL_QUERIES_ARRAY[i]["section"]
        })
        answers.append({"section":RETRIEVAL_QUERIES_ARRAY[i]["section"], "answer":answer})
    return answers


def text_docs(file_path, user_input):
    try:
        if not os.path.exists(file_path):
            print(f"Error: File not found at {file_path}")
            return None
        

        
        data = generate_content(file_path, user_input)
        print("Generated content:")
        for i, section in enumerate(RETRIEVAL_QUERIES_ARRAY):
            print(f"Section: {section['section']}")
            print("Answer:", data)
            print("\n")
        print("All sections generated successfully.")

    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc() 

text_docs('./text.pdf', user_inputs)
'''

def generate_grant_proposal(company_object, user_input):
    company_object = json.loads(company_object)
    print("Type of company object ", type(company_object))
    try:
        print("Generating content")
        answers = []
        cover_letter = generate_cover_letter(company_object, user_input)
        print("Cover letter generated")
        answers.append({"section":"Cover Letter", "answer":cover_letter.content})
        executive_summary = generate_executive_summary(company_object, user_input)
        print("Executive summary generated ")
        answers.append({"section": "Executive Summary","answer": executive_summary.content })
        organization_background = generate_organization_background(company_object)
        print("Organization background generated")
        answers.append({"section": "Organization Background", "answer": organization_background.content})
        project_description = generate_project_description(company_object, user_input)
        print("Project description generated ")
        answers.append({"section":"Project Description", "answer":project_description.content})
        statement_need = generate_statement_need(company_object, user_input)
        print("Statement of need generated")
        answers.append({"section":"Statement Need", "answer":statement_need.content})
        evaluation_plan = generate_evaluation_plan(company_object, user_input)
        print("Evalution plan generated")
        answers.append({"section":"Evaluation Plan", "answer": evaluation_plan.content})
        budgets = generate_budgets(company_object, user_input)
        print("Budget generated")
        answers.append({"section": "Budget Breakdown", "answer": budgets.budget_breakdown})
        answers.append({"section": "Budget Narrative", "answer": budgets.budget_narrative})
        sustainability_plan = generate_sustainibility_plan(company_object, user_input)
        print("Sustainability plan generated")
        answers.append({"section":"Sustainability Plan", "answer": sustainability_plan.content})
        return answers
    except Exception as e:
        print("Error while generating grant proposal:", e)
        traceback.print_exc()
        return None