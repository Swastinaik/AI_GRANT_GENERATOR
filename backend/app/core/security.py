from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Any
from jose import jwt
import uuid
import hashlib

from app.core.config import settings

pwd_ctx = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def _now() -> datetime:
    return datetime.utcnow()

def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    now = _now()
    exp = now + timedelta(minutes=(expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(subject), "exp": exp.timestamp(), "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def validate_token_expiry(exp):
    current_timestamp = datetime.utcnow().timestamp()
    if current_timestamp > exp:
        return False # Yes, it is expired
    else:
        return True

def create_refresh_token(subject: str, expires_days: int | None = None) -> tuple[str, str]:
    now = _now()
    exp = now + timedelta(days=(expires_days or settings.REFRESH_TOKEN_EXPIRE_DAYS))
    payload = {"sub": str(subject), "exp": exp.timestamp(), "type": "refresh"}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token

def hash_token_identifier(jti: str) -> str:
    """Hash the refresh token identifier before storing it (so DB doesn't hold raw jti)."""
    return hashlib.sha256(jti.encode()).hexdigest()

def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
