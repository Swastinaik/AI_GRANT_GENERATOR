import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dotenv import load_dotenv
from app.api.v1 import agents, auth, users


load_dotenv()


vercel_frontend_url = os.getenv("VERCEL_FRONTEND_URL")
vercel_current_url = os.getenv("VERCEL_URL")
vercel_env = os.getenv("VERCEL_ENV")




origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:3001",
    f"https://{os.getenv('RENDER_EXTERNAL_HOSTNAME')}" if os.getenv("RENDER_EXTERNAL_HOSTNAME") else None,
]
if vercel_frontend_url:
    origins.append(vercel_frontend_url)
trusted_origins = [o for o in origins if o is not None]





app = FastAPI(title="AI Agent Applicatiion")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(users.router)