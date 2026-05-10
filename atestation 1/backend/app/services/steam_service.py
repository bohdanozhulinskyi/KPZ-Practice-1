import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from app.config import STEAM_API_KEY


class SteamServiceError(Exception):
    pass


def _steam_get_json(endpoint: str, params: dict) -> dict:
    query = urlencode(params)
    url = f"https://api.steampowered.com/{endpoint}?{query}"
    try:
        with urlopen(url, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        raise SteamServiceError(f"Steam API HTTP error: {exc.code}") from exc
    except URLError as exc:
        raise SteamServiceError("Steam API network error") from exc
    except json.JSONDecodeError as exc:
        raise SteamServiceError("Steam API returned invalid JSON") from exc


def get_steam_stats(steam_id: str) -> dict:
    if not STEAM_API_KEY:
        raise SteamServiceError("STEAM_API_KEY is not configured on the backend")

    profile_data = _steam_get_json(
        "ISteamUser/GetPlayerSummaries/v0002/",
        {"key": STEAM_API_KEY, "steamids": steam_id},
    )
    players = profile_data.get("response", {}).get("players", [])
    if not players:
        raise SteamServiceError("Steam user not found or profile is private")
    player = players[0]

    recent_games_data = _steam_get_json(
        "IPlayerService/GetRecentlyPlayedGames/v0001/",
        {"key": STEAM_API_KEY, "steamid": steam_id, "format": "json"},
    )
    recent_games = recent_games_data.get("response", {}).get("games", [])

    return {
        "steam_id": steam_id,
        "persona_name": player.get("personaname"),
        "profile_url": player.get("profileurl"),
        "avatar": player.get("avatarfull") or player.get("avatarmedium") or player.get("avatar"),
        "persona_state": player.get("personastate"),
        "recent_games_count": len(recent_games),
        "recent_games": [
            {
                "name": game.get("name"),
                "playtime_2weeks_min": game.get("playtime_2weeks", 0),
                "playtime_forever_min": game.get("playtime_forever", 0),
            }
            for game in recent_games
        ],
    }
