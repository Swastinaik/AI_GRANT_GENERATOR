import os
import json
import traceback
from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

google_api_key = os.getenv('GOOGLE_API_KEY')

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

class CompanyProfileDetails(BaseModel):
    """
    Represents the structured details of a company extracted from text for grant writing context.
    """
    overall_summary: str = Field(
        ..., description="A concise, high-level summary of the entire provided text about the company."
    )
    profile_summary: str= Field(
        ..., description="A brief overview summarizing the company's core identity, mission, and activities relevant for an introduction."
    )
    history: str = Field(
        ..., description="A narrative summary of the company's founding, key milestones, evolution, and significant past events."
    )
    achievements: str = Field(
        ..., description="A list of significant accomplishments, awards, recognition, impact metrics, or key successes."
    )
    mission_vision: str = Field(
        None, description="The company's stated mission and/or vision, if available in the text."
    )
    products_services: Optional[str] = Field(
        None, description="A brief description of the main products or services offered by the company, if available."
    )

parser = PydanticOutputParser(pydantic_object=CompanyProfileDetails)


prompt = PromptTemplate(
    input_variables=["company_text", "format_instrauctions"],
    template=("""
    You are a professional grant writer. who is expert in summarzing the large documents and also keeping the full context and meaning.
    Given the following text about a company,summarize the key details with keeping full context and meaning into a structured format.
    These are the provided instructions for the result format {format_instructions}
     generate a summary of the following text: companydetail :  {company_text}
    Generate the output according to provided instrauctions and if any data is missing in company detail then you yourself try to fill the data with your own knowledge. but in the context of the company detail.""")
)


def summarize_company_profile(company_text: str) -> CompanyProfileDetails:
    chain = prompt | llm | parser
    try:
        
        # Invoke the chain with the provided company text
        structured_company_data: CompanyProfileDetails = chain.invoke({"company_text": company_text, "format_instructions": parser.get_format_instructions()})
        print("Raw LLM Output:", structured_company_data.model_dump_json(indent=4))
        dict_data = structured_company_data.model_dump()
        return dict_data
    except json.JSONDecodeError as json_error:
        print("JSON Decode Error:", json_error)
        print("Invalid JSON Output:", structured_company_data)
        return None
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc()
        return