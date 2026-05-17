"use client";

import { useState } from "react";

export default function RealtorsClient({
  defaultCity,
}: {
  defaultCity: string;
}) {
  const [city, setCity] =
    useState(defaultCity);

  function handleSearch() {
    if (!city.trim()) return;

    const query = encodeURIComponent(
      `best real estate agents in ${city}`
    );

    window.open(
      `https://www.google.com/search?q=${query}`,
      "_blank"
    );
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        🏡 Find a Realtor
        {city ? ` in ${city}` : ""}
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "28px",
          fontSize: "16px",
        }}
      >
        Top-rated real estate professionals
        serving {city}.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <input
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          placeholder="Enter city"
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "14px 28px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}
