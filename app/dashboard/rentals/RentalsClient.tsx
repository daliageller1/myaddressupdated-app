"use client";

import { useState } from "react";

const btn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  background: "#f9fafb",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s",
};

function normalizeCity(input: string) {
  if (!input) return "";

  return input
    .trim()
    .toLowerCase()
    .split(" ")
    .map(
      (w) => w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
}

function cityToSlug(city: string) {
  return city
    .toLowerCase()
    .replace(",", "")
    .replace(/\s+/g, "-");
}

const cityData: any = {
  Atlanta: {
    avgRent: "$1,600",
    vibe: "Fast-growing, warm, lots of jobs",
    neighborhoods: [
      { name: "Midtown", note: "Walkable, nightlife" },
      { name: "Buckhead", note: "Upscale, safe" },
      { name: "Old Fourth Ward", note: "Trendy" },
    ],
    tips: ["Traffic is heavy", "Live close to work"],
  },
  Pittsburgh: {
    avgRent: "$1,200",
    vibe: "Affordable, slower pace",
    neighborhoods: [
      { name: "Shadyside", note: "Popular" },
      { name: "Squirrel Hill", note: "Quiet" },
      { name: "Lawrenceville", note: "Trendy" },
    ],
    tips: ["Cold winters", "Lawrenceville is growing"],
  },
};

export default function RentalsClient({
  initialCity,
}: {
  initialCity: string;
}) {
  const [city, setCity] = useState(normalizeCity(initialCity));

  const normalizedCity = normalizeCity(city);
  const apartmentsSlug = cityToSlug(normalizedCity);
  const data = cityData[normalizedCity] || null;

  const btn = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Explore rentals near your destination</h1>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="e.g. Atlanta, GA"
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          marginBottom: "16px",
        }}
      />

      {city && (
        <>
          <h2>{normalizedCity || city}</h2>

          {data ? (
            <>
              <p><strong>💰 Avg Rent:</strong> {data.avgRent}</p>
              <p><strong>🌆 Vibe:</strong> {data.vibe}</p>

              <div>
                <strong>📍 Best Areas:</strong>
                <ul>
                  {data.neighborhoods.map((n: any) => (
                    <li key={n.name}>
                      <strong>{n.name}</strong> — {n.note}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>💡 Tips:</strong>
                <ul>
                  {data.tips.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* 🔥 FALLBACK (THIS IS THE MAGIC) */}
              <p style={{ color: "#6b7280" }}>
                No detailed data yet for {city}, but you can explore listings below.
              </p>

              <p style={{ marginTop: "8px" }}>
                💡 Tip: Search neighborhoods like “downtown {city}” or “best areas in {city}”
              </p>
            </>
          )}

          {/* ALWAYS SHOW LINKS */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <a
              href={`https://www.zillow.com/homes/for_rent/${encodeURIComponent(normalizedCity)}`}
              target="_blank"
            >
              <button
                style={btn}
                onMouseOver={(e) => (e.currentTarget.style.background = "#eee")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f9fafb")}
              >
                Zillow
              </button>
            </a>

            <a
              href={`https://www.apartments.com/${apartmentsSlug}`}
              target="_blank"
            >
              <button
                style={btn}
                onMouseOver={(e) => (e.currentTarget.style.background = "#eee")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f9fafb")}
              >
                Apartments
              </button>
            </a>

            <a
              href={`https://www.redfin.com`}
              target="_blank"
            >
              <button
                style={btn}
                onMouseOver={(e) => (e.currentTarget.style.background = "#eee")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f9fafb")}
              >
                Redfin
              </button>
            </a>
          </div>
          <button
            onClick={async () => {
              const res = await fetch("/api/move", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  oldAddress: "Unknown",
                  newAddress: normalizedCity,
                  moveDate: new Date().toISOString().split("T")[0],
                }),
              });
              const data = await res.json();
              console.log("API RESPONSE:", data);

              if (res.ok) {
                window.location.href = "/dashboard";
              } else {
                alert("Could not create move: " + JSON.stringify(data));
              }
            }}
            style={{
              marginTop: "16px",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start Move to {normalizedCity}
          </button>
        </>
      )}
    </div>
  );
}
