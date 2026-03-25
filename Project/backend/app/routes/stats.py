from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.stats_schema import StatsResponse
from app.services.stats_service import get_stats_for_user
from app.utils.security import decode_access_token
from app.services.user_service import get_user_by_id


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


def _get_current_user_id_from_token(token: str = Depends(oauth2_scheme)) -> int:
    return _get_current_user_id(token)


@router.get("", response_model=StatsResponse)
def stats(current_user_id: int = Depends(_get_current_user_id_from_token), db: Session = Depends(get_db)):
    # Validate user existence (helps with stale tokens).
    if not get_user_by_id(db, current_user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return get_stats_for_user(db, current_user_id)

