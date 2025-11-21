# app/api/deps.py
import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, ExpiredSignatureError
from app.core import security
from app.models.users import User, Usage
from app.db.client import db
from app.services.users import user as crud_users

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # used for docs & retrieving token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    1) Extracts token from Authorization header using OAuth2PasswordBearer dependency.
    2) Decodes and validates the token (signature, expiry, type).
    3) Loads the user from DB using 'sub' claim.
    4) Returns user dict (or raises 401).
    """
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing access token")

    try:
        payload = security.decode_token(token)
    except ExpiredSignatureError:
        # token expired
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Ensure token is an access token, not refresh
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = await crud_users.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    user = User(**user)
    user = user.model_dump()  # Convert to User model
    return user


async def check_usage(user: User = Depends(get_current_user)):
    # ... (Authentication check remains the same)
    user = user
    email = user.get("email")
    today_midnight = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    # 1. Find today's usage record
    users_usage = await db.usage.find_one({
        "email": email,
    })

    if not users_usage:
        # First use today, create a new record with count 0 (to be incremented later)
        new_usage_dict = {
            "email": email,
            "count": 0,
            "date": datetime.datetime.now()
        }
        await db.usage.insert_one(new_usage_dict)
        return new_usage_dict # Count is 0

    if users_usage['date'] < today_midnight:
        updated_doc = await db.usage.find_one_and_update(
            {"email":email},
            {"$set":{"email":email, "count":0, "date":datetime.datetime.now()}})
        updated_doc['_id'] = str(updated_doc['_id'])
        return updated_doc
    # 2. Check the limit
    if users_usage["count"] >= 4: # Checking for >= 4 means the 5th use is forbidden
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usage limit exceeded (5 per day)")

    # 3. If passed the check, return the document for the update function
    users_usage['_id'] = str(users_usage['_id'])  # Convert ObjectId to string for consistency
    return users_usage
    



async def update_usage(usage):
    """
    Increment the usage count for the user using the correct key (user_id).
    """
    email = usage.get("email")
    # FIX: Use the user_id (the key used in the document)
    await db.usage.update_one(
        {"email": email}, 
        {"$inc": {"count": 1}}
    )    
    return {"message": "Usage updated successfully"}

