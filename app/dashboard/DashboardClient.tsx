"use client";

import Link from "next/link";
import { getReminder } from "@/lib/reminders";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);

  const [move, setMove] = useState<any>(null);

  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [editingDate, setEditingDate] = useState(false);
  const [realtors, setRealtors] = useState([]);

  const categoryConfig: Record<string, { label: string; example: string }> = {
    Financial: { label: "bank or account", example: "Chase" },
    Utilities: { label: "utility", example: "PG&E" },
    Insurance: { label: "insurance", example: "State Farm" },
    Subscriptions: { label: "subscription", example: "Netflix" },
    Government: { label: "agency", example: "DMV" },
    Miscellaneous: { label: "item", example: "Gym membership" },
  };

  const suggestionConfig: Record<string, string[]> = {
    Financial: ["Bank", "Credit Cards", "PayPal"],
    Utilities: ["Electricity", "Internet", "Water", "Gas"],
    Insurance: ["Health Insurance", "Car Insurance", "Home Insurance"],
    Subscriptions: ["Netflix", "Amazon", "Spotify"],
    Government: ["USPS", "DMV", "IRS"],
    Miscellaneous: ["Gym", "Doctor", "School"],
  };

  const orderedCategories = [
    "Financial",
    "Utilities",
    "Insurance",
    "Subscriptions",
    "Government",
    "Miscellaneous",
  ];

  const linkButton = {
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    padding: "6px 10px",
    fontSize: "13px",
    background: "#fff",
  };

  const btn = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
  };

  function logout() {
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  async function createMove(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldAddress, newAddress, moveDate }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Could not create move");
    }
  }

  useEffect(() => {
    fetch("/api/checklist")
      .then((res) => res.json())
      .then((data) => {
        setMove(data.move);
        if (data.move) {
          setMoveDate(data.move.moveDate || "");
        } else {
          setMoveDate("");
        }
        setLoading(false);
      });

  }, []);

  useEffect(() => {
    fetch("/api/realtors")
      .then((res) => res.json())
      .then(setRealtors);
  }, []);

  useEffect(() => {
    if (!move?.userId) return;

    fetch("/api/send-reminder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: move.userId,
      }),
    });

  }, []);

  if (loading) return <p>Loading...</p>;

  // 🚨 No move yet → show form
  if (!move) {
    <div style={{ marginTop: "20px" }}>
      <Link href="/dashboard/rentals">
        <button style={{ padding: "10px 14px" }}>
          🏢 Explore Rentals
        </button>
      </Link>

      <Link href="/dashboard/realtors" style={{ marginLeft: "10px" }}>
        <button style={{ padding: "10px 14px" }}>
          🏡 Explore Realtors
        </button>
      </Link>
    </div>
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
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "10px" }}>Create Your Move</h1>
          <p style={{ marginBottom: "25px", color: "#666" }}>
            Enter your moving details to generate your checklist.
          </p>

          <form onSubmit={createMove}>
            <input
              placeholder="Old Address"
              value={oldAddress}
              onChange={(e) => setOldAddress(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />

            <input
              placeholder="New Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />

            <input
              type="date"
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
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
            >
              Generate Checklist
            </button>
          </form>
        </div>
      </div>
    );
  }

  const total = move.checklist.length;
  const completed = move.checklist.filter((i: any) => i.completed).length;
  const percent = Math.round((completed / total) * 100);
  const reminder = move?.moveDate
    ? getReminder(new Date(move.moveDate))
    : null;

  const daysLeft = reminder?.daysLeft ?? 999;

  const phase =
    daysLeft > 60
      ? "planning"
      : daysLeft > 14
      ? "preparation"
      : daysLeft > 2
      ? "packing"
      : "final";

  const isPlanningPhase = phase === "planning";
  const isPackingPhase = phase === "packing";
  const isFinalPhase = phase === "final";

  const reminderCategoryMap: Record<string, string[]> = {
    "Your move is in": ["Miscellaneous"],
    "Notify utilities": ["Utilities"],
    "Start packing": ["Miscellaneous"],
    "Confirm movers": ["Miscellaneous"],
    "Final prep": ["Financial", "Utilities"],
  };

  const activeCategories = reminder
    ? Object.entries(reminderCategoryMap)
      .find(([key]) => reminder.title.includes(key))?.[1] || []
    : [];

  const grouped = move.checklist.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  Object.keys(categoryConfig).forEach((category) => {
    if (!grouped[category]) {
      grouped[category] = [];
    }
  });

function handleStartOver() {
  const confirmed = confirm(
    "Start over? This will delete your move and checklist."
  );
  if (!confirmed) return;

  fetch("/api/move/delete", {
    method: "DELETE",
    credentials: "include",
  })
    .then(async (res) => {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) {
          window.location.reload();
        } else {
          alert("Delete failed");
        }
      } catch {
        console.error("Not JSON response");
      }
    })
    .catch((err) => {
      console.error("DELETE ERROR:", err);
    });
}

  // 🚀 Move exists → show checklist

  const handleAdd = async (category: string) => {
    const value = newItems[category];
    if (!value?.trim()) {
      alert("Enter something first");
      return;
    }

    const res = await fetch("/api/checklist/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moveId: move.id,
        category,
        label: value,
      }),
    });

    if (!res.ok) {
      alert("Failed to add item");
      return;
    }

    const created = await res.json();

    setMove((prev: any) => ({
      ...prev,
      checklist: [...prev.checklist, created],
    }));

    setNewItems((prev) => ({
      ...prev,
      [category]: "",
    }));
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        padding: "8px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
     }}
    >
      <div style={{ marginBottom: "10px" }}>

      <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 600 }}>
        Your Move
      </h1>
      <p style={{ color: "#6b7280", margin: "2px 0 8px" }}>
        {move?.oldAddress} → {move?.newAddress}
      </p>

    {/* PRIMARY ACTIONS (MOST IMPORTANT) */}
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      <Link href="/dashboard/realtors">
        <button style={btn}>🏡 Find Realtors</button>
      </Link>
      <Link href="/dashboard/rentals">
        <button style={btn}>🏢 Find Rentals</button>
      </Link>
    </div>

    {/* SECONDARY ACTIONS */}
    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
      <button onClick={logout} style={btn}>Logout</button>
      <button onClick={handleStartOver} style={{ ...btn, color: "#dc2626" }}>
        Start Over
      </button>
    </div>

      {reminder && (
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontWeight: 600 }}>
            ⚠️  {reminder?.title}
          </div>
          <div style={{ color: "#6b7280", marginTop: "4px" }}>
            <ul style={{ margin: 0, paddingLeft: "18px" }}> 
              {reminder?.suggestions?.map((s: string, i: number) => (
                <li key={i} style={{ marginBottom: "4px" }}> 
                  {s} 
                </li>
               ))} 
            </ul>
          </div>
        </div>
      )}

      {!isFinalPhase && (
        <div style={{ marginBottom: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600 }}>
            Movers & Supplies
          </h2>
          {isPackingPhase ? (
            <>
              {/* Supplies FIRST */}
              <div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
                  Packing Supplies
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a href="https://www.amazon.com/s?k=moving+boxes" target="_blank">
                    <button style={linkButton}>Boxes</button>
                  </a>
                  <a href="https://www.homedepot.com/b/Storage-Organization-Moving-Supplies/N-5yc1vZchnc" target="_blank">
                    <button style={linkButton}>Home Depot Kits</button>
                  </a>
                  <a href="https://www.uhaul.com/MovingSupplies/" target="_blank">
                    <button style={linkButton}>U-Haul Supplies</button>
                  </a>
                </div>
              </div>

              {/* Movers SECOND */}
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                  Movers
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a href="https://www.uhaul.com" target="_blank">
                    <button style={linkButton}>U-Haul</button>
                  </a>
                  <a href="https://www.pods.com" target="_blank">
                    <button style={linkButton}>PODS</button>
                  </a>
                  <a href="https://twomenandatruck.com" target="_blank">
                    <button style={linkButton}>Two Men and a Truck</button>
                  </a>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  → Compare options
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Movers FIRST */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                  Movers
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a href="https://www.uhaul.com" target="_blank">
                    <button style={linkButton}>U-Haul</button>
                  </a>
                  <a href="https://www.pods.com" target="_blank">
                    <button style={linkButton}>PODS</button>
                  </a>
                  <a href="https://twomenandatruck.com" target="_blank">
                    <button style={linkButton}>Two Men and a Truck</button>
                  </a>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  → Compare options
                </div>
              </div>

              {/* Supplies SECOND */}
              <div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                  Packing Supplies
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a href="https://www.amazon.com/s?k=moving+boxes" target="_blank">
                    <button style={linkButton}>Boxes</button>
                  </a>
                  <a href="https://www.homedepot.com/b/Storage-Organization-Moving-Supplies/N-5yc1vZchnc" target="_blank">
                    <button style={linkButton}>Home Depot Kits</button>
                  </a>
                  <a href="https://www.uhaul.com/MovingSupplies/" target="_blank">
                    <button style={linkButton}>U-Haul Supplies</button>
                  </a>
                </div>
              </div>
            </>
          )}

        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        {editingDate ? (
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
    
            <input
              type="date"
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={async () => {
                const res = await fetch("/api/move", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ moveDate }),
                });

                if (res.ok) {
                  setMove((prev: any) => ({
                    ...prev,
                    moveDate,
                  }));
                  setEditingDate(false);
                } else {
                  alert("Failed to update move date");
                }

                fetch("/api/send-reminder", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: move.userId,
                  }),
                });
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={() => {
                setMoveDate(move.moveDate || "");
                setEditingDate(false);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "#ddd",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

          </div>
        ) : (
          <p>
            <strong>Move Date:</strong>{" "}
            {move.moveDate
              ? new Date(move.moveDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })
              : "Not set"}

            <button
              onClick={() => setEditingDate(true)}
              style={{
                marginLeft: "10px",
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          </p>
        )}
      </div>

      <h2 style={{ marginTop: "20px", marginBottom: "6px" }}>
        Checklist
      </h2>

      <div style={{ marginBottom: "12px" }}>
        <strong>Progress: {completed} of {total} completed ({percent}%)</strong>

        <div
          style={{
            height: "10px",
            backgroundColor: "#e5e5e5",
            borderRadius: "6px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              backgroundColor: "#3b82f6",
              borderRadius: "6px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {orderedCategories.map((category) => {
        const items = grouped[category] || [];

        return (
          <div
          key={category}
          style={{
            marginBottom: "12px",
          }}
        >
          <h3
            style={{
              marginBottom: "8px",
              marginTop: "0px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#6b7280",
            }}
          >
            {category}
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item: any) => (
              <li
                key={item.id}
                style={{
                  padding: "4px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <label>
                    <input
                      style={{ marginRight: "8px" }}
                      type="checkbox"
                      checked={item.completed}
                      onChange={async (e) => {
                        const checked = e.target.checked;

                        await fetch(`/api/checklist/${item.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ completed: checked }),
                        });

                        setMove((prev: any) => ({
                          ...prev,
                          checklist: prev.checklist.map((i: any) =>
                            i.id === item.id ? { ...i, completed: checked } : i
                          ),
                        }));
                      }}
                    />
                    <span
                      style={{
                        textDecoration: item.completed ? "line-through" : "none",
                        color: item.completed ? "#16a34a" : "#111",
                      }}
                    >
                      {item.label}
                    </span>
                  </label>
                </div>
                <button
                  title="Delete this item (cannot be undone)"
                  onClick={async () => {
                    await fetch("/api/checklist/delete", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: item.id }),
                    });

                    setMove((prev: any) => ({
                      ...prev,
                      checklist: prev.checklist.filter((i: any) => i.id !== item.id),
                    }));
                  }}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "#fee2e2";
  e.currentTarget.style.color = "#dc2626";
}}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "11px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              placeholder={`Add ${categoryConfig[category]?.label || "item"} (e.g. ${categoryConfig[category]?.example || "something"})`}
              value={newItems[category] || ""}
              onChange={(e) =>
                setNewItems((prev) => ({
                  ...prev,
                  [category]: e.target.value,
                }))
              }
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                flex: "1",
                maxWidth: "300px",
              }}
            />
            <button
              type="button"
              onClick={() => handleAdd(category)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#2563eb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
              💡 Suggestions:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(suggestionConfig[category] || [])
                .filter(
                  (s) =>
                    !move.checklist.some(
                      (item: any) =>
                        item.category === category && item.label === s
                    )
                )
                .map((suggestion) => {
                  const isHighlighted = activeCategories.includes(category);

                  return (
                    <button
                      key={suggestion}
                      onClick={async () => {
                        const res = await fetch("/api/checklist/create", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            moveId: move.id,
                            category,
                            label: suggestion,
                          }),
                        });

                        const created = await res.json();

                        setMove((prev: any) => ({
                          ...prev,
                          checklist: [...prev.checklist, created],
                        }));
                      }}
                      style={{
                        borderRadius: "6px",
                        border: isHighlighted ? "1px solid #2563eb" : "1px solid #ddd",
                        color: isHighlighted ? "#1d4ed8" : "#111",
                        fontWeight: isHighlighted ? "600" : "400",
                        padding: "6px 10px",
                        fontSize: "13px",
                        background: "#fff",
                      }}
                    >
                      {isHighlighted ? "🔥 " : "+ "}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
      );
      })}
    </div>
  </div>
  );
}
