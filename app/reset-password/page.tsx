"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  if (!token) {
    return <p>Invalid reset link</p>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          padding: "10px",
          width: "300px",
        }}
      />

      <button
        onClick={async () => {
          const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
          });

          if (res.ok) {
            alert("Password reset successful!");
            window.location.href = "/login";
          } else {
            alert("Invalid or expired link");
          }
        }}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>
    </div>
  );
}
