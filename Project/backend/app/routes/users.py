from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user_schema import UserPublic
from app.services.user_service import get_user_by_id
from app.utils.security import decode_access_token


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _get_current_user_id(token: str) -> int:
    try:
        payload = decode_access_token(token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return int(sub)


def _get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> "object":
    user_id = _get_current_user_id(token)
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.get("/me", response_model=UserPublic)
def get_me(current_user: "object" = Depends(_get_current_user)):
    return current_user

