"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
        <h1 style={{ marginBottom: "10px" }}>Forgot Password</h1>

        <p style={{ marginBottom: "20px", color: "#666" }}>
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={async () => {
            if (!email) {
              alert("Please enter your email");
              return;
            }

            await fetch("/api/auth/forgot-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });

            alert("If your email exists, a reset link was sent.");
          }}
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
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          Send Reset Link
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Remember your password?{" "}
          <a href="/login" style={{ color: "#2563eb" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
