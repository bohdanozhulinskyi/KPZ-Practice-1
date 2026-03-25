from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import UserCreateRequest
from app.services.user_service import create_user, get_user_by_email
from app.utils.security import create_access_token, hash_password, verify_password


def register(db: Session, req: UserCreateRequest) -> User:
    existing = get_user_by_email(db, req.email)
    if existing:
        # Raise a ValueError that routes can convert to HTTP errors.
        raise ValueError("User already exists")

    password_hash = hash_password(req.password)
    return create_user(db, req.email, password_hash)


def authenticate_and_create_token(db: Session, email: str, password: str) -> str:
    user = get_user_by_email(db, email)
    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")

    return create_access_token(subject=str(user.id))

