import os
import json
import shutil
import traceback
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Response,  BackgroundTasks,Body, Request, UploadFile, Form
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.schemas import user
from app.services.grant_agent.summarize_documents import summarize_company_profile
from app.utils.background_tasks import delete_file
from app.utils.document_uploader import generate_loader, convert_docs_to_text
from app.utils.generate_filename import generate_alphabet_string
from app.services.grant_agent import generate_pdf
from app.ai_agents.generate_grant import GrantGeneration
from app.ai_agents.search_grant import SearchGrants
from app.ai_agents.resume_agent import ResumeAgent
from app.services.podcast_agent.nodes import generate_podcast_script, build_tts_chunk_stream, create_wav_header, stream_generator_wrapper
from app.schemas.agents import SearchGrantInput, PodcastRequest
from app.core.deps import check_usage, update_usage

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

UPLOAD_DIRECTORY = "uploaded_file"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


router = APIRouter(tags=["agents"])

#Routes to handle chat functionality
@router.post("/generate-grant")
async def chat(backgroundtaks: BackgroundTasks, file: UploadFile, user_input: str = Form(...), usage: dict = Depends(check_usage)):
    user_input = json.loads(user_input)
    try:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        absolute_file_path = os.path.abspath(file_location)
        loader = generate_loader(absolute_file_path)
        company_text = convert_docs_to_text(loader)
        organizations_detail = summarize_company_profile(company_text)
        
        # Generate the grant proposal using the chat service
        generate_grant= GrantGeneration(user_input=user_input,organizations_detail=organizations_detail)
        grant_proposal=await generate_grant.run_graph()
        
        await update_usage(usage)
        backgroundtaks.add_task(delete_file, absolute_file_path)
        return grant_proposal
        
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc()
        return {"error": "An error occurred while processing the request.", "details": str(e)}


@router.post("/generate-pdf/{style}")
def generate_pdf_for_request(background_tasks: BackgroundTasks, style: str, grant_proposal: str = Form(...)):
    try:
        grant_proposal = json.loads(grant_proposal)
        print("grant_proposal in generate_pdf ", grant_proposal['downloadResponse'])
        current_time = datetime.datetime.now().time()
        #file_path = f'/uploaded_file/grant_{current_time}.pdf'
        content_list = grant_proposal['downloadResponse']
        filename = generate_alphabet_string(4) + "_grant_proposal.pdf"
        file_path = os.path.join("tmp", filename) 
        os.makedirs("tmp", exist_ok=True)
        generate_pdf(content_list, file_path, template_style=style)
        background_tasks.add_task(delete_file, file_path)
        return FileResponse(file_path, filename=filename)
    except Exception as e:
        print("Error generating PDF:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while generating the PDF.")
    



@router.post('/search-grant')
async def search_grants(user_input: SearchGrantInput=Body(...), usage: dict = Depends(check_usage)):
    try:
        search_grant=SearchGrants(user_input.keyword,user_input.description)
        result= await search_grant.invoke_graph()
       
        await update_usage(usage)
        return result
    except json.JSONDecodeError:  # If you still need manual parsing elsewhere
        raise HTTPException(status_code=400, detail="Invalid JSON input")
    except ValueError as e:  # Example: Catch specific errors from SearchGrants
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while searching for grants: {str(e)}")


@router.post("/resume-generator")
async def generate_resume(background_tasks: BackgroundTasks,
                    job_description: str= Form(...),
                    style: str= Form(...),
                    user_information: str = Form(None),
                    file: UploadFile | None = None
                    ,usage: dict = Depends(check_usage)):
 
    job_description = job_description
    style = style
    agent = None
    file_location = None
    if file:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        agent = ResumeAgent(job_description=job_description, file_path=file_location,style=style)
    else:
        user_input = user_information
        agent = ResumeAgent(job_description=job_description,user_input = user_input, style=style)
    output_file_path = agent.run_graph()
    if file_location and os.path.exists(file_location):
        os.remove(file_location)
    file_name = os.path.basename(output_file_path)
    background_tasks.add_task(delete_file, output_file_path)
    
    await update_usage(usage)
    response = FileResponse(
        path=output_file_path,
        filename=file_name,
        media_type="application/pdf"
    )
    return response



@router.post("/generate-podcast")
async def generate_podcast_script_endpoint(request: PodcastRequest,
                                        usage: dict = Depends(check_usage)):
    try:
        user_input = request.user_input
        if not user_input:
            raise HTTPException(status_code=400, detail="User input is required for podcast script generation.")
        
        # Generate the podcast script
        podcast_script = generate_podcast_script(user_input)
        await update_usage(usage)

        return StreamingResponse(
            stream_generator_wrapper(podcast_script),
            media_type="audio/wav",
        )
    
    except Exception as e:
        print("Error generating podcast script:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while generating the podcast script.")