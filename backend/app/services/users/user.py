from app.db.client import db
from app.core.security import hash_password, verify_password, hash_token_identifier
from datetime import datetime
from app.models.users import User, UserCreate, UserInDB
from bson import ObjectId

async def create_user(username: str, email: str, password: str) -> dict:
    doc = {
        "username": username,
        "email": email,
        "hashed_password": hash_password(password),
        "isAdmin": False,
    }
    user = UserInDB(**doc)
    res = await db.users.insert_one(user.model_dump())
    created = await db.users.find_one({"_id": res.inserted_id})
    created["id"] = str(created["_id"])
    return created

async def get_user_by_email(email: str) -> dict | None:
    u = await db.users.find_one({"email": email})
    if not u:
        return None
    u["id"] = str(u["_id"])
    del u['_id']
    return u

async def get_user_by_id(user_id: str) -> dict | None:
    u = await db.users.find_one({"_id": ObjectId(user_id)})
    if not u:
        return None
    u["id"] = str(u["_id"])
    del u['_id']
    return u

async def verify_user_credentials(email: str, password: str) -> dict | None:
    user = await db.users.find_one({"email": email})
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    user["id"] = str(user["_id"])
    del user['_id']
    return user

# Refresh token store (stores hashed jti + user_id + expiry) for revocation and rotation
async def store_refresh_token(user_id: str, jti: str, expires_at: float):
    
    refresh_token_db = await db.refresh_tokens.find_one({"user_id": user_id})
    if refresh_token_db:
        updated_refresh_token = await db.refresh_tokens.update_one(
            {"user_id": user_id}
            )
        return updated_refresh_token
    
    new_refresh_token = await db.refresh_tokens.insert_one({"user_id": user_id})
    return new_refresh_token

async def revoke_refresh_token(user_id: str):
    await db.refresh_tokens.delete_one({"user_id": user_id})

async def get_stored_refresh_token(user_id: str):
    return await db.refresh_tokens.find_one({"user_id": user_id})