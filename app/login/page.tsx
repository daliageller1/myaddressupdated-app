"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      setError(data.error || "Invalid credentials");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>Welcome back</h1>
        <p style={{ marginBottom: "24px", color: "#666" }}>
          Log in to continue managing your move.
        </p>

        <form onSubmit={handleLogin}>
          {error && (
            <p style={{ color: "red", marginBottom: "12px" }}>
              {error}
            </p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <a
              href="/forgot-password"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#eef2ff",
                color: "#2563eb",
                fontWeight: "500",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e0e7ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#eef2ff")
              }
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Don’t have an account?{" "}
          <a href="/signup" style={{ color: "#2563eb" }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
