import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../api/api";
import { clearAccessToken, getAccessToken } from "../api/auth";
import StatsChart from "../components/StatsChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);
  const [steamId, setSteamId] = useState("");
  const [steamStats, setSteamStats] = useState(null);
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamError, setSteamError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    async function load() {
      setError("");
      try {
        const meData = await apiFetch("/api/users/me", { token });
        setMe(meData);
        const statsData = await apiFetch("/api/stats", { token });
        setStats(statsData);
      } catch (err) {
        setError(err?.message || "Failed to load");
      }
    }

    load();
  }, [navigate]);

  function handleLogout() {
    clearAccessToken();
    navigate("/login");
  }

  function formatPlaytime(minutes) {
    const safeMinutes = Number.isFinite(minutes) ? Math.max(0, minutes) : 0;
    const hours = Math.floor(safeMinutes / 60);
    const restMinutes = safeMinutes % 60;
    if (hours === 0) return `${restMinutes} хв`;
    if (restMinutes === 0) return `${hours} год`;
    return `${hours} год ${restMinutes} хв`;
  }

  async function handleSteamLookup(e) {
    e.preventDefault();
    const cleanedSteamId = steamId.trim();
    if (!cleanedSteamId) {
      setSteamError("Введи Steam ID");
      setSteamStats(null);
      return;
    }

    setSteamLoading(true);
    setSteamError("");
    setSteamStats(null);
    try {
      const data = await apiFetch(`/api/steam/${cleanedSteamId}`);
      setSteamStats(data);
    } catch (err) {
      setSteamError(err?.message || "Не вдалося отримати дані Steam");
    } finally {
      setSteamLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error ? <div style={{ color: "crimson", marginBottom: 14 }}>{error}</div> : null}

      {me ? (
        <div style={{ marginBottom: 18 }}>
          <div>
            <b>User</b>: {me.email}
          </div>
        </div>
      ) : (
        <div>Loading user...</div>
      )}

      <StatsChart stats={stats} />

      <div style={{ marginTop: 24, maxWidth: 700 }}>
        <h3>Steam статистика</h3>
        <form onSubmit={handleSteamLookup} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Введи Steam64 ID"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button type="submit" disabled={steamLoading}>
            {steamLoading ? "Завантаження..." : "Показати"}
          </button>
        </form>

        {steamError ? <div style={{ color: "crimson", marginBottom: 10 }}>{steamError}</div> : null}

        {steamStats ? (
          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            {steamStats.avatar ? (
              <div style={{ marginBottom: 10 }}>
                <img
                  src={steamStats.avatar}
                  alt={`Avatar of ${steamStats.persona_name || "Steam user"}`}
                  width={80}
                  height={80}
                  style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
                />
              </div>
            ) : null}
            <div>
              <b>Нік:</b> {steamStats.persona_name || "-"}
            </div>
            <div>
              <b>Steam ID:</b> {steamStats.steam_id}
            </div>
            <div>
              <b>Ігор за 2 тижні:</b> {steamStats.recent_games_count}
            </div>
            {steamStats.profile_url ? (
              <div style={{ marginTop: 6 }}>
                <a href={steamStats.profile_url} target="_blank" rel="noreferrer">
                  Відкрити профіль Steam
                </a>
              </div>
            ) : null}

            <h4 style={{ marginTop: 14 }}>Останні ігри</h4>
            {steamStats.recent_games?.length ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {steamStats.recent_games.map((game) => (
                  <li key={game.name}>
                    {game.name} - {formatPlaytime(game.playtime_2weeks_min)} / 2 тижні,{" "}
                    {formatPlaytime(game.playtime_forever_min)} всього
                  </li>
                ))}
              </ul>
            ) : (
              <div>Немає даних про останні ігри.</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

