from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse
from services.proposal_service import get_proposal_service, get_all_proposals_service, update_proposal_service, delete_proposal_service
from beanie import PydanticObjectId
from utils.auth import get_current_user
from models.user import User
from models.proposal import Proposal
from utils.docx_generator import generate_docx_stream
from typing import Dict

router = APIRouter()

@router.get("/proposal/{proposal_id}")
async def get_proposal(
    proposal_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        proposal = await get_proposal_service(proposal_id)
        return {"status": "success", "proposal": proposal}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get proposal: {str(e)}")

@router.get("/proposal/project/{project_id}")
async def get_all_proposals(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        
        proposals = await get_all_proposals_service(PydanticObjectId(project_id))
        return {"status": "success", "proposals": proposals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get all proposals: {str(e)}")



@router.delete("/proposal/{proposal_id}")
async def delete_proposal(
    proposal_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        await delete_proposal_service(proposal_id)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete proposal: {str(e)}")

@router.put("/proposal/{proposal_id}")
async def update_proposal(
    proposal_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        proposal = await update_proposal_service(proposal_id)
        return {"status": "success", "proposal": proposal}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update proposal: {str(e)}")

@router.post("/proposal/download")
async def download_grant_proposal(
    data: Dict[str, str] = Body(...),
    current_user: User = Depends(get_current_user)
):
    try:
        stream = generate_docx_stream(data)
        
        return StreamingResponse(
            stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": "attachment; filename=grant_proposal.docx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate document: {str(e)}")