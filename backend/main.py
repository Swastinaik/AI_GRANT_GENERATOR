from fastapi import FastAPI
from api.grant_routes import router as grant_router
from api.org_routes import router as org_router
from api.auth_routes import router as auth_router
from api.project_routes import router as project_router
from api.proposal_routes import router as proposal_router
import uvicorn
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from database import init_db

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "ai_grant_generator")
    await init_db(mongo_uri, db_name)
    yield
    # Shutdown logic goes here

app = FastAPI(
    title="AI Grant Generator API", 
    description="API to process RFPs and generate grant proposals.",
    lifespan=lifespan
)

FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Explicit origins required when allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(grant_router, prefix="/api", tags=["Grants"])
app.include_router(org_router, prefix="/api", tags=["Organizations"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(project_router, prefix="/api", tags=["Projects"])
app.include_router(proposal_router, prefix="/api", tags=["Proposals"])


