from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import app.core.security as security
from app.models.users import User
from app.utils.users import get_user
from app.db.client import client
from app.core.deps import check_usage, get_current_user


router = APIRouter(tags=["users"], prefix="/users")



@router.post("/me")
async def read_users_me(current_user: User = Depends(get_current_user), usage = Depends(check_usage)):
    """
    Get the current authenticated user.
    """
    if not current_user or not usage:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated or usage limit exceeded",
        )
    
    return {"user": current_user, "usage": usage}

    
    

