"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordInner() {
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
          if (!password || password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
          }

          const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
          });

          const data = await res.json();
          console.log("RESET RESPONSE:", data);

          if (res.ok) {
            alert("Password reset successful!");
            window.location.href = "/login";
          } else {
            alert(data.error || "Something went wrong");
          }
        }}
      >
        Reset Password
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
