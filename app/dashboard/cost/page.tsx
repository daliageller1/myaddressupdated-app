"use client";

import { useState, useEffect } from "react";

const STREET_WORDS = [
  "street", "st", "avenue", "ave", "road", "rd",
  "boulevard", "blvd", "lane", "ln", "drive", "dr", "court", "ct"
];

export default function CostPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [size, setSize] = useState("1br");

  const [packing, setPacking] = useState(false);
  const [storage, setStorage] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const [estimate, setEstimate] = useState<any>(null);

  const [floor, setFloor] = useState("1");
  const [elevator, setElevator] = useState(false);
  const [parking, setParking] = useState("close");

  useEffect(() => {
    async function loadMove() {
      try {
        const res = await fetch("/api/move");
        const data = await res.json();

        if (data.move) {
          setFrom(`${data.move.oldCity}, ${data.move.oldState}`);
          setTo(`${data.move.newCity}, ${data.move.newState}`);
        }
      } catch (err) {
        console.error("Failed to load move", err);
      }
    }

    loadMove();
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  };

  function getDistanceFactor(from: string, to: string) {
    if (!from || !to) return 1;

    if (from.toLowerCase() === to.toLowerCase()) return 0.8;
    return 1.8;
  }

  function getMoveType(distance: number) {
    if (distance < 1) return "Local move";
    if (distance < 1.5) return "Regional move";
    return "Long-distance move";
  }

  function calculate() {
    if (!from || !to) {
      alert("Enter both locations");
      return;
    }

    const baseCosts: any = {
      studio: 800,
      "1br": 1200,
      "2br": 2000,
      "3br": 3500,
    };

    const base = baseCosts[size] || 1200;
    const distance = getDistanceFactor(from, to);

    let total = base * distance;

    let adjustment = 1;

    if (floor === "2") adjustment += 0.1;
    if (floor === "3+") adjustment += 0.2;
    if (!elevator) adjustment += 0.15;
    if (parking === "far") adjustment += 0.15;

    total *= adjustment;

    if (packing) total += 400;
    if (storage) total += 300;
    if (insurance) total += 200;

    const low = Math.round(total * 0.9);
    const high = Math.round(total * 1.3);

    const hoursMap: any = {
      studio: 3,
      "1br": 4,
      "2br": 6,
      "3br": 8,
    };

    const hours = hoursMap[size] * distance;

    function getCrew(size: string) {
      if (size === "studio") return 2;
      if (size === "1br") return 2;
      if (size === "2br") return 3;
      return 4;
    }

    setEstimate({
      low,
      high,
      base,
      distance,
      hours,
      crew: getCrew(size),
      extras: {
        packing: packing ? 400 : 0,
        storage: storage ? 300 : 0,
        insurance: insurance ? 200 : 0,
      },
    });
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        background: "white",
      }}
    >

      <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>
        Moving Cost Estimator
      </h1>

      <div style={{ padding: "20px" }}>
        {/* FROM */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
            From
          </label>
          <input
            placeholder="e.g. Palo Alto, CA"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* TO */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
            To
          </label>
          <input
            placeholder="e.g. Atlanta, GA"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* SIZE */}
        <div style={{ marginBottom: "10px" }}>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="studio">Studio</option>
            <option value="1br">1 Bedroom</option>
            <option value="2br">2 Bedroom</option>
            <option value="3br">3 Bedroom</option>
          </select>
        </div>

        {/* EXTRAS */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={packing}
              onChange={() => setPacking(!packing)}
            />
            Packing (+$400)
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={storage}
              onChange={() => setStorage(!storage)}
            />
            Storage (+$300)
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={insurance}
              onChange={() => setInsurance(!insurance)}
            />
            Insurance (+$200)
          </label>
        </div>

        {/* FLOOR */}
        <div style={{ marginTop: "10px" }}>
          <label>Floor</label>
          <select value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="1">1st floor</option>
            <option value="2">2nd floor</option>
            <option value="3+">3rd+ floor</option>
          </select>
        </div>

        {/* ELEVATOR */}
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              checked={elevator}
              onChange={() => setElevator(!elevator)}
            />
            Elevator available
          </label>
        </div>

        {/* PARKING */}
        <div>
          <label>Parking</label>
          <select value={parking} onChange={(e) => setParking(e.target.value)}>
            <option value="close">Truck can park close</option>
            <option value="far">Long carry</option>
          </select>
        </div>

        <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

        <button
          disabled={!from || !to}
          style={{
            marginTop: "16px",
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onClick={calculate}
        >
          Estimate Cost
        </button>

        <h3 style={{ marginTop: "12px", marginBottom: "8px" }}>
          Estimated Cost
        </h3>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "10px" }}>
          Based on typical moving costs for your route and home size.
        </p>

        {/* RESULT */}
        {estimate && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >

            <p style={{ fontSize: "14px", color: "#2563eb", fontWeight: 600 }}>
              {getMoveType(estimate.distance)}
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
            </h2>

{/* 👇 ADD THIS RIGHT HERE */}
<p style={{ fontSize: "13px", color: "#555" }}>
  Estimated time: {Math.round(estimate.hours)}–{Math.round(estimate.hours + 2)} hours
</p>

<p style={{ fontSize: "13px", color: "#555" }}>
  Crew: {estimate.crew} movers + truck
</p>

            <hr style={{ margin: "12px 0" }} />

            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              <div>Base move (size): ${estimate.base}</div>
              <div>Distance adjustment: x{estimate.distance}</div>

              {estimate.extras.packing > 0 && <div>Packing: $400</div>}
              {estimate.extras.storage > 0 && <div>Storage: $300</div>}
              {estimate.extras.insurance > 0 && <div>Insurance: $200</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
