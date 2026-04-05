"use client";

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

    fetch("/api/send-reminder", {
      method: "POST",
    });

  }, []);

  if (loading) return <p>Loading...</p>;

  // 🚨 No move yet → show form
  if (!move) {
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
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          }}
        >
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

  const reminderCategoryMap: Record<string, string[]> = {
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
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
     }}
  >
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "14px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
      }}
    >

      <h1 style={{ marginBottom: "8px" }}>Your Move Checklist</h1>

      {reminder && (
        <div
          style={{
            background:
              reminder.daysLeft <= 3
                ? "#fee2e2"   // red
                : reminder.daysLeft <= 7
                ? "#fef3c7"   // yellow
                : "#eef2ff",  // blue
            border: "1px solid #c7d2fe",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "6px" }}>
            🔔 {reminder.title}
          </div>

          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {reminder.suggestions.map((s: string, i: number) => (
              <li key={i} style={{ marginBottom: "4px" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px",
          fontSize: "15px",
        }}
      >
        Moving is stressful. Let’s make this part easy.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={logout}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            background: "#fafafa",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        <button
          type="button"
          title="Start over (this will delete your move and cannot be undone)"
          onClick={() => handleStartOver()}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
            style={{
              background: "#fee2e2",
              border: "1px solid #dc2626",
              color: "#dc2626",
              cursor: "pointer",
              padding: "6px 14px",
              borderRadius: "999px",
              fontWeight: "600",
            }}
          >
            Start Over
          </button>

      </div>

      <p><strong>From:</strong> {move.oldAddress}</p>
      <p><strong>To:</strong> {move.newAddress}</p>

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

                await fetch("/api/send-reminder", {
                  method: "POST",
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

      <h2 style={{ marginTop: "30px", marginBottom: "10px" }}>
        Checklist
      </h2>
      <div style={{ marginBottom: "20px" }}>
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
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #f3f4f6",
            borderRadius: "8px",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              marginTop: "20px",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#555",
            }}
          >
            {category}
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((item: any) => (
              <li
                key={item.id}
                style={{
                  padding: "6px 0",
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
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    color: "#dc2626",
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
                setNewItems({
                  ...newItems,
                  [category]: e.target.value,
                })
              }
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                flex: "0 0 280px",
              }}
            />

            <button
              onClick={async () => {
                const value = newItems[category];
                if (!value?.trim()) return;

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

                const created = await res.json();
                setMove((prev: any) => ({
                  ...prev,
                  checklist: [...prev.checklist, created],
                }));

                setNewItems({
                  ...newItems,
                  [category]: "",
                });
              }}
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
                .map((suggestion) => (
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
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "1px solid #ddd",
                      background: "#f9fafb",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
          </div>
        </div>
      );
      })}
    </div>
  </div>
  );
}
