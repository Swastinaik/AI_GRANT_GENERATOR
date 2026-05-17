from fastapi import APIRouter, Form, HTTPException, Depends, File, UploadFile
import json
import logging
import os
import shutil
import tempfile
from typing import Dict, Any
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from models.user import User
from models.grant import Grant
from agents.grant_agent.graphs.graph_builder import grant_graph
from agents.search_agent.graphs.graph_builder import search_graph
from agents.grant_review.graphs.review_graph import review_graph
from services.project_service import get_project_service
from services.proposal_service import store_proposal
from utils.auth import get_current_user
from utils.pdf_parser import process_pdf_sync
from utils.imagekit_client import upload_file_to_imagekit


logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/grant-proposal")
async def generate_grant(
    user_input: str = Form(...),
    project_id: str = Form(...),
    user: User = Depends(get_current_user)
):
    try:
        user_input_dict = json.loads(user_input)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format for user_input. Must be a valid JSON string.")
        
    if not isinstance(user_input_dict, dict):
        raise HTTPException(status_code=400, detail="user_input must be a JSON dictionary.")

    # Save the uploaded file to a temporary location
    try:
        project = await get_project_service(project_id)
        rfp_parsed = project.rfp_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project: {str(e)}")

    sections_required = rfp_parsed.get("sections_required")
    
    # Logic for default_section flag based on whether sections were parsed
    if not sections_required:
        default_section = True
        sections = {}
    else:
        default_section = False
        sections = sections_required

    # Extract all other key-values as constraints
    rfp_constraints = {
        k: v for k, v in rfp_parsed.items() 
        if k != "sections_required"
    } if isinstance(rfp_parsed, dict) else {}

    orgId = str(user.org_id)
    # Prepare initial state for GrantAgent
    initial_state = {
        "default_section": default_section,
        "orgId": orgId,
        "user_input": user_input_dict,
        "sections": sections,
        "rfp_constraints": rfp_constraints
    }
    
    # Invoke the graph
    try:
        final_state = await grant_graph.ainvoke(initial_state)
        final_output = final_state.get("final_output")
        grant = await store_proposal(None, "generate", final_output, None, project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate grant: {str(e)}")    
    # Return the dictionary from the agent to the frontend
    return grant

class SearchGrantInput(BaseModel):
    description: str
    target_benef: str
    domain : str
    eligibilities: str


@router.post("/search-grants")
async def search_grants(
    search_input: SearchGrantInput,
    user: User = Depends(get_current_user)
):
    try:
        description = search_input.description
        target_benef = search_input.target_benef
        domain = search_input.domain
        eligibilities = search_input.eligibilities

        state = {
            "user_input": {
                "description": description,
                "target_benef": target_benef,
                "domain": domain,
                "eligibilities": eligibilities
            },
        }
        final_state = await search_graph.ainvoke(state)
        grants = final_state.get("grants", [])
        return {"grants": grants}
    except Exception as e:
        logger.error(f"search-grants error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to search grants: {str(e)}")




@router.post("/review-grant")
async def review_grant(
    project_id: str = Form(...),
    grant_proposal: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    try:
        # Read the file into memory (async)
        file_content = await grant_proposal.read()
        
        # Upload to ImageKit
        file_url = await upload_file_to_imagekit(file_content, grant_proposal.filename)
        
        # Run the blocking PDF extraction in a separate thread
        proposal_text = await run_in_threadpool(process_pdf_sync, file_content)
    except Exception as e:
        logger.error(f"File processing failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid PDF or file upload error.")

    project = await get_project_service(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    initial_state = {
        "rfp": json.dumps(project.rfp_data, indent=2),
        "proposal": proposal_text,
        "review_result": None,
        "error": None
    }

    # 4. Invoke the AI graph
    try:
        final_state = await review_graph.ainvoke(initial_state)
        
        # Check for logic errors within the agent's state
        if final_state.get("error"):
            logger.error(f"Agent Logic Error: {final_state['error']}")
            raise HTTPException(status_code=500, detail="The AI agent encountered an internal error.")

        result = final_state.get("review_result")
        if not result:
            raise HTTPException(status_code=500, detail="No review result generated.")

        # Store the proposal result
        proposal_record = await store_proposal(
            file_url=file_url,
            type="review",
            output_json=result.model_dump() if hasattr(result, "model_dump") else result,
            review=None,
            project_id=project_id
        )

        return proposal_record
    
    except Exception as e:
        logger.error(f"Review execution failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Grant review process failed.")


