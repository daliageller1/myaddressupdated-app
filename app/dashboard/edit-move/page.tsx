"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditMovePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [oldAddress, setOldAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");

  useEffect(() => {
    async function loadMove() {
      try {
        const res = await fetch("/api/checklist");
        const data = await res.json();

        if (data.move) {
          setOldAddress(data.move.oldAddress || "");
          setNewAddress(data.move.newAddress || "");

          if (data.move.moveDate) {
            setMoveDate(
              new Date(data.move.moveDate)
                .toISOString()
                .split("T")[0]
            );
          }
        }
      } catch (err) {
        console.error("Failed loading move", err);
      } finally {
        setLoading(false);
      }
    }

    loadMove();
  }, []);

  async function handleSave() {
    setSaving(true);

    try {
      const res = await fetch("/api/move", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldAddress,
          newAddress,
          moveDate,
        }),
      });

      if (!res.ok) {
        alert("Failed to update move");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
        fontFamily:
          "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "white",
          padding: "32px",
          borderRadius: "14px",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
          }}
        >
          Edit Move
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "24px",
          }}
        >
          Update your move details.
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Moving From
          </label>

          <input
            value={oldAddress}
            onChange={(e) =>
              setOldAddress(e.target.value)
            }
            placeholder="Old address"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Moving To
          </label>

          <input
            value={newAddress}
            onChange={(e) =>
              setNewAddress(e.target.value)
            }
            placeholder="New address"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Move Date
          </label>

          <input
            type="date"
            value={moveDate}
            onChange={(e) =>
              setMoveDate(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
