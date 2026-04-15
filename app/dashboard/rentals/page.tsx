"use client";

import { useState } from "react";

const cityData: any = {
  Atlanta: {
    avgRent: "$1,600",
    neighborhoods: [
      { name: "Midtown", note: "Walkable, central, higher cost" },
      { name: "Buckhead", note: "Safe, upscale" },
      { name: "Old Fourth Ward", note: "Trendy" },
    ],
  },
  Pittsburgh: {
    avgRent: "$1,200",
    neighborhoods: [
      { name: "Shadyside", note: "Popular, walkable" },
      { name: "Squirrel Hill", note: "Quiet, residential" },
      { name: "Lawrenceville", note: "Trendy" },
    ],
  },
};

export default function RentalsPage() {
  const [city, setCity] = useState("");

  const data = cityData[city];

  const btn = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Find Rentals</h1>

      <input
        placeholder="Enter city (e.g. Atlanta)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      />

      {data && (
        <>
          <h2>{city}</h2>

          <p><strong>💰 Avg Rent:</strong> {data.avgRent}</p>

          <ul>
            {data.neighborhoods.map((n: any) => (
              <li key={n.name}>
                <strong>{n.name}</strong> — {n.note}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <a href={`https://www.zillow.com/homes/for_rent/${city}`} target="_blank">
              <button style={btn}>Zillow</button>
            </a>
            <a href={`https://www.apartments.com/${city}`} target="_blank">
              <button style={btn}>Apartments</button>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
