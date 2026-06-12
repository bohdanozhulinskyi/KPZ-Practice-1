import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, register } from "../api/auth";
import UserForm from "../components/UserForm";
import { setAccessToken, clearAccessToken } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const submitLabel = mode === "login" ? "Login" : "Register";

  async function handleSubmit({ email, password }) {
    clearAccessToken();
    if (mode === "login") {
      const data = await login({ email, password });
      if (!data?.access_token) throw new Error("No token returned");
      setAccessToken(data.access_token);
      navigate("/");
      return;
    }

    await register({ email, password });
    // After registration switch to login.
    setMode("login");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <div style={{ marginBottom: 14 }}>
        <button type="button" onClick={() => setMode("login")} disabled={mode === "login"}>
          Login
        </button>{" "}
        <button type="button" onClick={() => setMode("register")} disabled={mode === "register"}>
          Register
        </button>
      </div>

      <UserForm onSubmit={handleSubmit} submitLabel={submitLabel} />
    </div>
  );
}

