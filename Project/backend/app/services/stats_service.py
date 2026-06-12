from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.event import Event
from app.schemas.stats_schema import EventCountByType, StatsResponse


def get_stats_for_user(db: Session, user_id: int) -> StatsResponse:
    total_events = db.query(func.count(Event.id)).filter(Event.user_id == user_id).scalar() or 0

    by_type_rows = (
        db.query(Event.event_type, func.count(Event.id))
        .filter(Event.user_id == user_id)
        .group_by(Event.event_type)
        .all()
    )
    events_by_type: List[EventCountByType] = [
        EventCountByType(event_type=event_type, count=count) for event_type, count in by_type_rows
    ]

    last_event_at: Optional[object] = (
        db.query(Event.created_at)
        .filter(Event.user_id == user_id)
        .order_by(Event.created_at.desc())
        .limit(1)
        .scalar()
    )

    return StatsResponse(
        user_id=user_id,
        total_events=int(total_events),
        events_by_type=events_by_type,
        last_event_at=last_event_at,
    )

