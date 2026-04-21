import json
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from utils.pdf_parser import load_pdf

async def parse_rfp(file_path: str) -> Dict[str, Any]:
    """
    Loads an RFP PDF and parses it into a structured JSON formatting using Langchain and Gemini.
    """
    # Load the PDF content
    content = load_pdf(file_path)
    
    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite-preview",
        temperature=0
    )
    
    # Define the extraction prompt
    template = """You are an expert grant writer and analyst. Your task is to extract all the relevant fields from the provided RFP (Request for Proposal) document text into a structured JSON object.

The output MUST be a valid JSON object. Do not wrap the JSON output in markdown blocks like ```json ... ```. Output raw JSON only.

Rules for Extraction:
1. Extract any relevant fields found in the document (these will be dynamic and optional). Examples include: word count limits, funders details, formatting rules, deadlines, eligibility criteria, etc.
2. MANDATORY FIELD: You must include a field named "sections_required". 
   - If no sections are required or mentioned in the RFP, this field MUST be set to null.
        Example Output type: null
   - If sections are present, this field should contain an object detailing what sections are required along with all the constraints of each field (e.g., max word count, mandatory vs optional, required content).
        Example Output type: {{"section_name1": {{"constraints": {{"max_word_count": "100", "mandatory": "true", "required_content": "description"}}}}, "section_name2": {{"constraints": {{"max_word_count": "100", "mandatory": "true", "required_content": "description"}}}}}}

   - If just sections names are present, but no constraints or rules are present then each section name as the key and value as None.
        Example Output type : {{"section_name1": {{"constraints": null}}, "section_name2": {{"constraints": null}}}}
3. Ensure no data is lost and all constraints of each field are accurately captured.

RFP Content:
{content}
"""
    
    prompt = PromptTemplate.from_template(template)
    
    # Run the chain
    # JsonOutputParser already parses the LLM response into a Python dict
    chain = prompt | llm | JsonOutputParser()
    parsed_data = await chain.ainvoke({"content": content})

    # Enforce the mandatory field if the LLM hallucinated its removal
    if "sections_required" not in parsed_data:
        parsed_data["sections_required"] = None

    return parsed_data
