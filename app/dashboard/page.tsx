"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [move, setMove] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");

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
      <div style={{ padding: "40px" }}>
        <h1>Create Your Move</h1>

        <form onSubmit={createMove}>
          <input
            placeholder="Old Address"
            value={oldAddress}
            onChange={(e) => setOldAddress(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="New Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <br /><br />

          <input
            type="date"
            value={moveDate}
            onChange={(e) => setMoveDate(e.target.value)}
          />
          <br /><br />

          <button type="submit">Create Move</button>
        </form>
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
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >

      <h1 style={{ marginBottom: "10px" }}>Your Move Checklist</h1>

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
              backgroundColor: "#2563eb",
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
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
            background: "#fafafa",
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
                      color: item.completed ? "#888" : "#000",
                    }}
                  >
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
