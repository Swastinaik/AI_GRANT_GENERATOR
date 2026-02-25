from app.utils.document_uploader import generate_loader, convert_docs_to_text
from .prompt import prompt
from langchain_core.output_parsers import PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas.agents import GrantReviewOutput
from langchain_core.prompts import ChatPromptTemplate

def generate_grant_text(file_path):
    """
    This function converts the whole grant file into string
    
    :param file_path: String Temporary path of grant file
    """
    loader = generate_loader(file_path)
    docs = convert_docs_to_text(loader)
    return docs


async def generate_grant_review(grant_proposal: str, grant_description: str):
    """
    This function generates the grant review based on the grant proposal and grant description
    
    :param grant_proposal: String Grant proposal
    :param grant_description: String Grant description
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    parser = PydanticOutputParser(pydantic_object=GrantReviewOutput)
    template = ChatPromptTemplate.from_messages([
        ("system", prompt),
        ("human","""
        Grant Proposal: {grant_proposal}
        Grant Description: {grant_description}
        Output format (JSON Only):
         {format_instructions}
        """)
    ])
    chain = template | model | parser
    grant_review = await chain.ainvoke({"grant_proposal": grant_proposal, 
                                        "grant_description": grant_description, 
                                        "format_instructions": parser.get_format_instructions()})
    return grant_review.model_dump()