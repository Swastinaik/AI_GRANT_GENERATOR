from fastapi import APIRouter, Form, HTTPException, Depends
import json
from typing import Dict, Any
from models.user import User
from agents.grant_agent.graphs.graph_builder import graph
from services.project_service import get_project_service
from services.proposal_service import store_proposal
from utils.auth import get_current_user

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
        final_state = await graph.ainvoke(initial_state)
        final_output = final_state.get("final_output")
        grant = await store_proposal(None, "generate", final_output, None, project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate grant: {str(e)}")    
    # Return the dictionary from the agent to the frontend
    return grant
