from pymongo import AsyncMongoClient
from beanie import init_beanie
from models import User, Organization, Project, Proposal

async def init_db(connection_string: str, database_name: str):
    """
    Initialize Beanie with the provided connection string and database name.
    """
    client = AsyncMongoClient(connection_string)
    
    await init_beanie(
        database=client[database_name],
        document_models=[
            User,
            Organization,
            Project,
            Proposal
        ]
    )