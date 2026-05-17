from fastapi import APIRouter, Depends, HTTPException, Body
import logging
from fastapi.responses import StreamingResponse
from services.proposal_service import get_proposal_service, get_all_proposals_service, update_proposal_service, delete_proposal_service
from beanie import PydanticObjectId
from utils.auth import get_current_user
from models.user import User
from models.proposal import Proposal
from pydantic import BaseModel
from models.grant import Grant
from utils.docx_generator import generate_docx_stream
from typing import Dict

router = APIRouter()

logger = logging.getLogger(__name__)

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
    

class SaveGrantInput(BaseModel):
    grant_id: str
    title: str
    agency: str
    agencyCode: str
    openDate: str
    closeDate: str
    link: str
    score: str = ""


@router.post("/save-grant")
async def save_grant(
    grant_data: SaveGrantInput,
    user: User = Depends(get_current_user)
):
    try:
        grant = Grant(
            grant_id=grant_data.grant_id,
            title=grant_data.title,
            agency=grant_data.agency,
            agencyCode=grant_data.agencyCode,
            openDate=grant_data.openDate,
            closeDate=grant_data.closeDate,
            link=grant_data.link,
            score=grant_data.score,
            user_id=user.id
        )
        await grant.insert()
        return {"message": "Grant saved successfully", "grant": grant}
    except Exception as e:
        logger.error(f"Failed to save grant: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to save grant: {str(e)}")



@router.get("/save-grant")
async def get_saved_grants(
    user: User = Depends(get_current_user)
):
    try:
        grants = await Grant.find(Grant.user_id == user.id).to_list()
        return {"grants": grants}
    except Exception as e:
        logger.error(f"Failed to retrieve saved grants: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to retrieve saved grants: {str(e)}")