"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditMovePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [oldAddressLine1, setOldAddressLine1] = useState("");
  const [oldAddressLine2, setOldAddressLine2] = useState("");
  const [oldCity, setOldCity] = useState("");
  const [oldState, setOldState] = useState("");
  const [oldZip, setOldZip] = useState("");

  const [newAddressLine1, setNewAddressLine1] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newZip, setNewZip] = useState("");

  const [moveDate, setMoveDate] = useState("");

  useEffect(() => {
    async function loadMove() {
      try {
        const res = await fetch("/api/checklist");
        const data = await res.json();

        if (data.move) {
          setOldAddressLine1(data.move.oldAddressLine1 || "");
          setOldAddressLine2(data.move.oldAddressLine2 || "");
          setOldCity(data.move.oldCity || "");
          setOldState(data.move.oldState || "");
          setOldZip(data.move.oldZip || "");

          setNewAddressLine1(data.move.newAddressLine1 || "");
          setNewAddressLine2(data.move.newAddressLine2 || "");
          setNewCity(data.move.newCity || "");
          setNewState(data.move.newState || "");
          setNewZip(data.move.newZip || "");

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
          oldAddressLine1,
          oldAddressLine2,
          oldCity,
          oldState,
          oldZip,

          newAddressLine1,
          newAddressLine2,
          newCity,
          newState,
          newZip,

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
            fontSize: "32px",
            fontWeight: 700,
          }}  
        >   
          🚚 Edit Move
        </h1>
        <p style={{ marginBottom: "25px", color: "#666" }}> 
          Update your move details.
        </p>
        <h3
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
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
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        />

        <input
          placeholder="Apartment / Unit (optional)"
          value={oldAddressLine2}
          onChange={(e) =>
            setOldAddressLine2(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        />

        <input
          placeholder="City"
          value={oldCity}
          onChange={(e) =>
            setOldCity(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
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
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />

          <input
            placeholder="ZIP Code"
            value={oldZip}
            onChange={(e) =>
              setOldZip(e.target.value)
            }
            style={{
              width: "160px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <h3
          style={{
            marginTop: "24px",
            display: "block",
            marginBottom: "8px",
            fontWeight: 500,
          }}
        >
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
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        />

        <input
          placeholder="Apartment / Unit (optional)"
          value={newAddressLine2}
          onChange={(e) =>
            setNewAddressLine2(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        />

        <input
          placeholder="City"
          value={newCity}
          onChange={(e) =>
            setNewCity(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
            marginBottom: "12px",
          }}
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
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />

          <input
            placeholder="ZIP Code"
            value={newZip}
            onChange={(e) =>
              setNewZip(e.target.value)
            }
            style={{
              width: "160px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "24px",
            marginBottom: "12px",
          }}
        >
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
