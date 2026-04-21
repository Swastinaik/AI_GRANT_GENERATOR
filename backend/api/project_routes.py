import os
import tempfile
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from services.rfp_parser import parse_rfp
from services.project_service import create_project_service, get_all_projects_service, get_project_service
from utils.auth import get_current_user
from models.user import User


router = APIRouter()

@router.post("/project")
async def create_project(
    title: str = Form(...),
    description: str = Form(...),
     rfp: UploadFile = File(...),
     current_user: User = Depends(get_current_user)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await rfp.read()
            tmp_file.write(content)
            tmp_pdf_path = tmp_file.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
        
    try:
        rfp_parsed = await parse_rfp(tmp_pdf_path)
    except Exception as e:
        os.remove(tmp_pdf_path)
        raise HTTPException(status_code=500, detail=f"Failed to parse RFP: {str(e)}")
    finally:
        if os.path.exists(tmp_pdf_path):
            os.remove(tmp_pdf_path)
    try:
        project = await create_project_service(
            title=title,
            description=description,
            rfp_data=rfp_parsed,
            user_id=current_user.id
        )
        return {"status": "success", "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")
    


@router.get("/project")
async def get_all_projects(
    current_user: User = Depends(get_current_user)
):
    try:
        projects = await get_all_projects_service(current_user.id)
        return {"status": "success", "projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get all projects: {str(e)}")


@router.get("/project/{project_id}")
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        project = await get_project_service(project_id)
        return {"status": "success", "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get project: {str(e)}")