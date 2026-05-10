from app.db.database import Base, engine

# Ensure models are imported so SQLAlchemy registers table metadata.
from app.models import event, user  # noqa: F401


def init_db() -> None:
    # Create tables on startup for a lightweight setup.
    Base.metadata.create_all(bind=engine)

