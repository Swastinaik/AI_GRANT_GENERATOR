import traceback
import sys
import json
import os
import shutil
import datetime
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(project_root)
from fastapi import FastAPI, UploadFile, Form, HTTPException, Depends, status, Response, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from services.chat_services import generate_grant_proposal
from utils.document_uploader import generate_loader, convert_docs_to_text
from utils.summarize_documents import summarize_company_profile
from utils.generate_pdf import generate_pdf, delete_file
from utils.generate_filename import generate_alphabet_string
import security, database
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()



app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_user(email: str):
    user = await database.user_collection.find_one({"email": email})
    if user:
        return user


origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SectionContent(BaseModel):
    section: str
    content: str

UPLOAD_DIRECTORY = "uploaded_file"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
class ContentItem(BaseModel):
    section: str
    content: str
@app.post("/register/", response_model=database.User)
async def create_user(user: database.UserCreate):
    db_user = await get_user(user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_password = security.get_password_hash(user.password)
    user_object = user.dict()
    user_object["hashed_password"] = hashed_password
    del user_object["password"]
    await database.user_collection.insert_one(user_object)
    del user_object["hashed_password"]
    return user_object

@app.post("/token")
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user(form_data.username) # Here username is the email
    if not user or not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True, # Set to True if using HTTPS
        samesite="Lax",  # Adjust based on your requirements
        path="/"
    )
    return {"access_token": "Successfully done it ", "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = security.TokenData(email=email)
    except security.JWTError:
        raise credentials_exception
    user = await get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

#Routes to handle chat functionality
@app.post("/chat")
async def chat(file: UploadFile, user_input: str = Form(...)):
    user_input = json.loads(user_input)
    print(" user_input ", user_input)
    print(" user_input after remove_outer_quotes ", user_input)
    try:
        file_location = os.path.join(UPLOAD_DIRECTORY, "new_file.pdf")
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
        absolute_file_path = os.path.abspath(file_location)
        loader = generate_loader(absolute_file_path)
        company_text = convert_docs_to_text(loader)
        company_detail = summarize_company_profile(company_text)
        print("company_detail ------ \n ", company_detail)
        # Generate the grant proposal using the chat service
        grant_proposal = generate_grant_proposal(company_object=company_detail, user_input=user_input)
        print("grant_proposal ------ \n", grant_proposal)
        return grant_proposal
    except Exception as e:
        print("Error-------------------------", e)
        traceback.print_exc()
        return {"error": "An error occurred while processing the request.", "details": str(e)}

#Just a test route to check if the server is running 
@app.get("/users/me/", response_model=database.User)
async def read_users_me(current_user: database.User = Depends(get_current_user)):
    return current_user

# Route to generate PDF from the grant proposal
@app.post("/generate-pdf")
def generate_pdf_for_request(background_tasks: BackgroundTasks, grant_proposal: str = Form(...)):
    try:
        grant_proposal = json.loads(grant_proposal)
        print("grant_proposal in generate_pdf ", grant_proposal['downloadResponse'])
        current_time = datetime.datetime.now().time()
        #file_path = f'/uploaded_file/grant_{current_time}.pdf'
        content_list = grant_proposal['downloadResponse']
        filename = generate_alphabet_string(4) + "_grant_proposal.pdf"
        file_path = os.path.join("tmp", filename) 
        os.makedirs("tmp", exist_ok=True)
        generate_pdf(content_list, file_path)
        background_tasks.add_task(delete_file, file_path)
        return FileResponse(file_path, filename=filename)
    except Exception as e:
        print("Error generating PDF:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while generating the PDF.")
