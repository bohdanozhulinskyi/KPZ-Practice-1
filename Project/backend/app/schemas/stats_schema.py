from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class EventCountByType(BaseModel):
    event_type: str
    count: int


class StatsResponse(BaseModel):
    user_id: int
    total_events: int
    events_by_type: List[EventCountByType] = []
    last_event_at: Optional[datetime] = None

