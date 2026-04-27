"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  const handleSignup = async () => {
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

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 👇 immediately log them in
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          router.push("/dashboard");
          return;
        } else {
          setError("Account created, but login failed");
          return;
        }
      }

      if (data.error === "User already exists") {
        router.push("/login?email=" + encodeURIComponent(email));
        return;
      }

      setError(data.error || "Something went wrong");
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px" }}>Start Your Move</h1>

        <p style={{ marginBottom: "20px", color: "#666" }}>
          Create your account to start and track your move.
        </p>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Creating..." : "Start My Move"}
        </button>

        <p style={{ marginTop: "10px", textAlign: "center", color: "#666" }}>
          Takes less than 2 minutes
        </p>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2563eb" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

/* styles */

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9fafb",
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "14px",
  boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
};
