from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import app.core.security as security
from app.models.users import User
from app.utils.users import get_user
from app.db.client import db
from app.services.history.history import get_user_history
from app.core.deps import check_usage, get_current_user


router = APIRouter(tags=["users"], prefix="/users")



@router.post("/me")
async def read_users_me(current_user: User = Depends(get_current_user), usage = Depends(check_usage)):
    """
    Get the current authenticated user.
    """
    print("current ",current_user)
    print("usage ",usage)
    if not current_user or not usage:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated or usage limit exceeded",
        )
    
    return {"user": current_user, "usage": usage}

@router.get("/history")
async def get_user_history_route(current_user: User = Depends(get_current_user)):
    try:
        res = await get_user_history(user_email=current_user["email"])
        return res
    except Exception as e:
        print("Error occurred during getting history:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching history: {str(e)}"
        )



    
    

