from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.event import Event
from app.schemas.user_schema import TokenResponse, UserCreateRequest, UserLoginRequest
from app.services.auth_service import authenticate_and_create_token, register
from app.services.user_service import get_user_by_email
from app.utils.security import decode_access_token


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _get_user_id_from_token(token: str) -> int:
    try:
        payload = decode_access_token(token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return int(sub)


@router.post("/register", response_model=dict)
def register_user(req: UserCreateRequest, db: Session = Depends(get_db)):
    try:
        user = register(db, req)
        # Optional: create an initial event for stats.
        db.add(Event(user_id=user.id, event_type="registered", payload={"email": user.email}))
        db.commit()
        return {"status": "ok", "user_id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    try:
        token = authenticate_and_create_token(db, req.email, req.password)
        return TokenResponse(access_token=token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

