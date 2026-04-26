"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
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
        <h1 style={{ marginBottom: "10px" }}>Start Your Move</h1>

        <p style={{ marginBottom: "20px", color: "#666" }}>
          Create an account to save and track your move.
        </p>

        {message && (
          <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={async () => {
            setError("");
            setMessage("");

            if (!email || !password) {
              setError("Email and password are required");
              return;
            }

            if (password.length < 6) {
              setError("Password must be at least 6 characters");
              return;
            }

            setLoading(true);

            const res = await fetch("/api/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            setLoading(false);

            if (res.ok) {
              setMessage("Account created! Redirecting...");
              setTimeout(() => {
                window.location.href = "/login";
              }, 1500);
            } else {
              setError(data.error || "Something went wrong");
            }
          }}
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
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#1d4ed8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#2563eb")
          }
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2563eb", fontWeight: "500" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
