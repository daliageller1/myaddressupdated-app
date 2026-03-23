"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [move, setMove] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [newItems, setNewItems] = useState<Record<string, string>>({});

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
        setLoading(false);
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

  const grouped = move.checklist.reduce((acc: any, item: any) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

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

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px",
          fontSize: "15px",
        }}
      >
        Moving is stressful. Let’s make this part easy.
      </p>

      <button
        onClick={logout}
        style={{
          padding: "6px 14px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          background: "#fafafa",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>

      <p><strong>From:</strong> {move.oldAddress}</p>
      <p><strong>To:</strong> {move.newAddress}</p>

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

      {Object.entries(grouped).map(([category, items]: any) => (
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
              <li key={item.id} style={{ padding: "6px 0" }}>
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

                      setMove({
                        ...move,
                        checklist: move.checklist.map((i: any) =>
                          i.id === item.id
                            ? { ...i, completed: checked }
                            : i
                        ),
                      });
                    }}
                  />
                  {" "}
                  <span
                    style={{
                      textDecoration: item.completed ? "line-through" : "none",
                      color: item.completed ? "#16a34a" : "#111",
                    }}
                  >
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px" }}>
            <input
              placeholder="Add item (e.g. Chase Bank)"
              value={newItems[category] || ""}
              onChange={(e) =>
                setNewItems({
                  ...newItems,
                  [category]: e.target.value,
                })
              }
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                marginRight: "8px",
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
                console.log("NEW ITEM:", created);

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
        </div>
      ))}
    </div>
  </div>
  );
}
