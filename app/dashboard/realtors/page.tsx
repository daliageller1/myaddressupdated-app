"use client";

import { useState } from "react";

export default function RealtorsPage() {
  const [search, setSearch] = useState("");

  const realtors = [
    {
      name: "Sarah Johnson",
      company: "Coldwell Banker",
      phone: "(555) 123-4567",
      rating: 4.8,
    },
    {
      name: "Michael Chen",
      company: "Compass",
      phone: "(555) 987-6543",
      rating: 4.9,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600 }}>
        🏡 Find a Realtor
      </h1>

      <p style={{ color: "#666", marginBottom: "16px" }}>
        Connect with trusted real estate professionals in your area.
      </p>

      {/* Search */}
      <input
        placeholder="Search by name or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      {/* Realtor List */}
      <div style={{ display: "grid", gap: "12px" }}>
        {realtors
          .filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((r, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid #eee",
                background: "white",
              }}
            >
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#666", fontSize: "14px" }}>
                {r.company}
              </div>

              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                ⭐ {r.rating} • {r.phone}
              </div>

              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Contact
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
