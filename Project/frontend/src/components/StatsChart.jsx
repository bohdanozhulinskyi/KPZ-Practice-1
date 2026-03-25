import React from "react";

export default function StatsChart({ stats }) {
  if (!stats) return <div>Loading stats...</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <h3>Stats</h3>
      <div>Total events: {stats.total_events}</div>
      {stats.last_event_at ? <div>Last event: {new Date(stats.last_event_at).toLocaleString()}</div> : null}

      <h4 style={{ marginTop: 16 }}>Events by type</h4>
      {stats.events_by_type?.length ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>Type</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Count</th>
            </tr>
          </thead>
          <tbody>
            {stats.events_by_type.map((row) => (
              <tr key={row.event_type}>
                <td style={{ padding: "6px 0" }}>{row.event_type}</td>
                <td style={{ padding: "6px 0", textAlign: "right" }}>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No events yet.</div>
      )}
    </div>
  );
}

