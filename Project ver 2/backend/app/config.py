import os


# Basic configuration loaded from environment variables.
# Keep defaults for local development.
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# SQLAlchemy database URL (SQLite default).
# Example for Postgres: postgresql+psycopg2://user:pass@host:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# CORS
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

