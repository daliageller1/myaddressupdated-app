"use client";

import Link from "next/link";
import { getReminder } from "@/lib/reminders";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);

  // Current address
  const [oldAddressLine1, setOldAddressLine1] = useState("");
  const [oldAddressLine2, setOldAddressLine2] = useState("");
  const [oldCity, setOldCity] = useState("");
  const [oldState, setOldState] = useState("");
  const [oldZip, setOldZip] = useState("");
  const [oldCountry, setOldCountry] = useState("US");

  // Destination
  const [newAddressLine1, setNewAddressLine1] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newZip, setNewZip] = useState("");
  const [newCountry, setNewCountry] = useState("US");

  const [move, setMove] = useState<any>(null);

  const [moveDate, setMoveDate] = useState("");
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [editingDate, setEditingDate] = useState(false);
  const [realtors, setRealtors] = useState([]);
  const router = useRouter();
  const [editingAddresses, setEditingAddresses] =
    useState(false);

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

  const actionButtonStyle = {
    height: "40px",
    minWidth: "120px",
    padding: "0 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
      body: JSON.stringify({
        oldAddressLine1,
        oldAddressLine2,
        oldCity,
        oldState,
        oldZip,
        oldCountry,

        newAddressLine1,
        newAddressLine2,
        newCity,
        newState,
        newZip,
        newCountry,

        moveDate,
      }),
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
  }, [move?.userId]);

  if (loading) return <p>Loading...</p>;

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  };

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
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              marginBottom: "10px",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            🚚 Create Your Move
          </h1>
          <p style={{ marginBottom: "25px", color: "#666" }}>
            Enter your moving details to generate your checklist.
          </p>

          <form onSubmit={createMove}>
            <h3 style={{ marginBottom: "12px" }}>
              Moving From
            </h3>

            <input
              placeholder="Street Address"
              value={oldAddressLine1}
              onChange={(e) =>
                setOldAddressLine1(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <input
              placeholder="Apartment / Unit (optional)"
              value={oldAddressLine2}
              onChange={(e) =>
                setOldAddressLine2(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              placeholder="City"
              value={oldCity}
              onChange={(e) =>
                setOldCity(e.target.value)
              }
              required
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <input
                placeholder="State"
                value={oldState}
                onChange={(e) =>
                  setOldState(e.target.value)
                }
                required
                style={{
                  ...inputStyle,
                  flex: 1,
                }}
              />

              <input
                placeholder="ZIP Code"
                value={oldZip}
                onChange={(e) =>
                  setOldZip(e.target.value)
                }
                style={{
                  ...inputStyle,
                  flex: 1,
                }}
              />
            </div>

            <h3
              style={{
                marginTop: "24px",
                marginBottom: "14px",
              }}>
              Moving To
            </h3>

            <input
              placeholder="Street Address"
              value={newAddressLine1}
              onChange={(e) =>
                setNewAddressLine1(
                  e.target.value
                )
              }
              required
              style={inputStyle}
            />

            <input
              placeholder="Apartment / Unit (optional)"
              value={newAddressLine2}
              onChange={(e) =>
                setNewAddressLine2(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <input
              placeholder="City"
              value={newCity}
              onChange={(e) =>
                setNewCity(e.target.value)
              }
              required
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <input
                placeholder="State"
                value={newState}
                onChange={(e) =>
                  setNewState(e.target.value)
                }
                required
                style={{
                  ...inputStyle,
                  flex: 1,
                }}
              />

              <input
                placeholder="ZIP Code"
                value={newZip}
                onChange={(e) =>
                  setNewZip(e.target.value)
                }
                style={{
                  ...inputStyle,
                  flex: 1,
                }}
              />
            </div>

            <div
              style={{
                marginTop: "24px",
                marginBottom: "14px",
              }}>
              Move Date
            </div>

            <input
              type="date"
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                height: "48px",
              }}
            />

            <button
              type="submit"
              style={{
                width: "320px",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                display: "block",
                margin: "32px auto 0",
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
        background: "white",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        margin: "0 auto 24px",
        width: "100%",
        maxWidth: "620px",
        border: "1px solid #f1f1f1",
      }}
    >

      <h1
        style={{
          marginBottom: "28px",
          fontSize: "30px",
          fontWeight: "700",
          letterSpacing: "-0.5px",
        }}
      >
        🚚 Your Move
      </h1>

      <div
        style={{
          color: "#666",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        Moving From
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "28px",
          lineHeight: "1.15",
        }}
      >
        {move.oldCity}, {move.oldState}
      </div>

      <div
        style={{
          color: "#666",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        Moving To
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "28px",
          lineHeight: "1.15",
        }}
      >
        {move.newCity}, {move.newState}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Move Date:</strong>{" "}
        {new Date(move.moveDate).toLocaleDateString()}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >

        <button
          onClick={() => router.push("/dashboard/edit-move")}
          style={actionButtonStyle}
        >
          Edit Move
        </button>

        <button
          onClick={() =>
            router.push(
              `/dashboard/rentals?city=${encodeURIComponent(
                `${move.newCity}, ${move.newState}`
              )}`
            )
          }
          style={actionButtonStyle}
        >
          Find Rentals
        </button>

        <button
          onClick={() => router.push("/dashboard/realtors")}
            style={actionButtonStyle}
        >
          Find Realtors
        </button>
      </div>

    <div
      style={{
        marginTop: "18px",
        marginBottom: "18px",
        color: "#777",
        fontSize: "13px",
      }}
    >
      {move.oldAddress}
      <br />
      {move.newAddress}
    </div>

    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
      <button onClick={logout} style={actionButtonStyle}>Logout</button>
      <button onClick={handleStartOver} style={{ ...actionButtonStyle, color: "#dc2626" }}>
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
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                    e.currentTarget.style.color = "#bbb";
                  }}
                  style={{
                    background: "transparent",
                    padding: "2px 4px",
                    marginLeft: "0px",
                    border: "none",
                    color: "#bbb",
                    cursor: "pointer",
                    fontSize: "13px",
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
    </div>
  );
}
