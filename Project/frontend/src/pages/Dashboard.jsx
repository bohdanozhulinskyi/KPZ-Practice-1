import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../api/api";
import { clearAccessToken, getAccessToken } from "../api/auth";
import StatsChart from "../components/StatsChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);
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
    </div>
  );
}

