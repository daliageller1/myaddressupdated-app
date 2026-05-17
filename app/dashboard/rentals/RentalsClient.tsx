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

  const [city, state] = input.split(",");

  const normalizedCity = city
    ?.trim()
    .toLowerCase()
    .split(" ")
    .map(
      (w) =>
        w.charAt(0).toUpperCase() +
        w.slice(1)
    )
    .join(" ");

  const normalizedState =
    state?.trim().toUpperCase();

  return normalizedState
    ? `${normalizedCity}, ${normalizedState}`
    : normalizedCity;
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
  const data = cityData[normalizedCity] || null;

function openRentalSearch(site: string) {
  if (!city.trim()) return;

  let query = "";

  switch (site) {
    case "zillow":
      query =
        `apartments for rent in ${normalizedCity} site:zillow.com`;
      break;

    case "apartments":
      query =
        `apartments for rent in ${normalizedCity} site:apartments.com`;
      break;

    case "redfin":
      query =
        `apartments for rent in ${normalizedCity} site:redfin.com`;
      break;

    default:
      query =
        `apartments for rent in ${normalizedCity}`;
  }

  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    "_blank"
  );
}

function searchRentals() {
  if (!city.trim()) return;

  const query = encodeURIComponent(
    `apartments for rent in ${normalizedCity}`
  );

  window.open(
    `https://www.google.com/search?q=${query}`,
    "_blank"
  );
}

  const btn = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <h1
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "28px",
        }}
      >
        Explore rentals near your destination
      </h1>

      <div
        style={{
          marginBottom: "10px",
          fontWeight: "500",
          color: "#555",
        }}
      >
        Destination
      </div>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="e.g. Atlanta, GA"
        style={{
          padding: "14px 16px",
          height: "48px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          width: "360px",
          fontSize: "16px",
          marginBottom: "28px",
        }}
      />

      {city && (
        <>
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
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
            }}
          >
            <button
    style={btn}
    onClick={() =>
      openRentalSearch("zillow")
    }
  >
    Zillow
  </button>

  <button
    style={btn}
    onClick={() =>
      openRentalSearch("apartments")
    }
  >
    Apartments
  </button>

  <button
    style={btn}
    onClick={() =>
      openRentalSearch("redfin")
    }
  >
    Redfin
  </button>
          </div>

          <button
            onClick={searchRentals}
            style={{
              marginTop: "10px",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Search Rentals
          </button>
        </>
      )}
    </div>
  );
}
