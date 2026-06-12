from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.routes import auth, stats, users


def create_app() -> FastAPI:
    app = FastAPI(title="Project API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # simplify local development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def _startup() -> None:
        init_db()

    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    # stats.router has route at "/" relative to the prefix.
    app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()

