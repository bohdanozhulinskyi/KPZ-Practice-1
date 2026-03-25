import React, { useState } from "react";

export default function UserForm({ onSubmit, submitLabel = "Submit" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err?.message || "Request failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <div style={{ marginBottom: 12 }}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ width: "100%" }}
        />
      </div>
      <button type="submit">{submitLabel}</button>
      {error ? <div style={{ color: "crimson", marginTop: 10 }}>{error}</div> : null}
    </form>
  );
}

