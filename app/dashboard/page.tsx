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

  // 🚀 Move exists → show checklist
  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Move Checklist</h1>

      <button onClick={logout}>Logout</button>

      <p><strong>From:</strong> {move.oldAddress}</p>
      <p><strong>To:</strong> {move.newAddress}</p>

      <h2>Checklist</h2>
      <ul>
        {move.checklist.map((item: any) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await fetch(`/api/checklist/${item.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: checked }),
                  });

                  item.completed = checked;
                  setMove({ ...move });
                }}
              />
              {" "}
              [{item.category}] {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
