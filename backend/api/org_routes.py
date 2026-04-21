from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any
from pydantic import BaseModel
from beanie import PydanticObjectId

from models.user import User
from models.organization import Organization
from services.organization_service import (
    create_organization_service,
    update_organization_service
)

from utils.auth import get_current_user

router = APIRouter()


class CreateOrgRequest(BaseModel):
    name: str
    org_data: Dict[str, Any]


class UpdateOrgRequest(BaseModel):
    org_data: Dict[str, Any]


@router.get("/organization")
async def get_organization(
    current_user: User = Depends(get_current_user)
):
    if not current_user.org_id:
        return {"status":"failure", "organization": None}

    org = await Organization.get(PydanticObjectId(current_user.org_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    return {"status": "success", "organization": org}


@router.post("/organization")
async def create_organization(
    request: CreateOrgRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Create organization and vectorize data
        org = await create_organization_service(
            name=request.name,
            org_data_dict=request.org_data
        )
        
        # Store org_id into respective user's table
        current_user.org_id = org.id
        await current_user.save()
        
        return {"status": "success", "organization": org}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/organization")
async def update_organization(
    request: UpdateOrgRequest,
    current_user: User = Depends(get_current_user)
):
    if not current_user.org_id:
        raise HTTPException(status_code=400, detail="User does not have an organization assigned")
        
    try:
        # Update organization data and sync vector DB
        org = await update_organization_service(
            org_id=str(current_user.org_id),
            updated_org_data_dict=request.org_data
        )
        
        return {"status": "success", "organization": org}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

