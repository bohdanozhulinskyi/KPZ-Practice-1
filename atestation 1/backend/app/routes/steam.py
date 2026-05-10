from fastapi import APIRouter, HTTPException, status

from app.services.steam_service import SteamServiceError, get_steam_stats

router = APIRouter()


@router.get("/{steam_id}")
def steam_stats(steam_id: str):
    if not steam_id.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Steam ID must contain digits only",
        )

    try:
        return get_steam_stats(steam_id)
    except SteamServiceError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
