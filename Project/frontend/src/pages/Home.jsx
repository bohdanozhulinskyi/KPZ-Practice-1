import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Project</h1>
      <p>
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

