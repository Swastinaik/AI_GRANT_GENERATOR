from agents.grant_review.llms.gemini_llm import gemini_llm
from agents.grant_review.prompts.review_prompt import GRANT_REVIEW_PROMPT
from agents.grant_review.states.review_state import GrantReviewState, GrantReviewResponse


async def review_node(state: GrantReviewState):
    """
    Node to evaluate a grant proposal against an RFP using Gemini.
    """
    rfp = state.get("rfp", "")
    proposal = state.get("proposal", "")

    if not rfp or not proposal:
        return {"error": "Missing RFP or Proposal text for evaluation."}

    try:
        # Initialize LLM
        llm = gemini_llm()
        
        # Bind the LLM to the GrantReviewResponse class for structured output
        # This ensures the output matches the Pydantic model structure
        structured_llm = llm.with_structured_output(GrantReviewResponse)
        
        # Format the prompt with inputs
        prompt = GRANT_REVIEW_PROMPT.format(rfp=rfp, proposal=proposal)
        
        # Call the LLM
        response = await structured_llm.ainvoke(prompt)
        
        return {"review_result": response, "error": None}
    
    except Exception as e:
        print(f"Error in review_node: {e}")
        return {"error": f"Evaluation failed: {str(e)}"}
