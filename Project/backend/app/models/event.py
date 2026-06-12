from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, func

from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    # e.g. "registered", "status_update", "login" etc.
    event_type = Column(String(50), index=True, nullable=False)

    # Flexible payload for stats/events.
    payload = Column(JSON, nullable=False, default=dict)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

