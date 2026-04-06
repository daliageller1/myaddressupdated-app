export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Hero */}
        <h1 style={{ fontSize: "34px", marginBottom: "16px" }}>
          Moving is stressful. This makes it simple.
        </h1>

        <p style={{ fontSize: "18px", color: "#555", marginBottom: "24px" }}>
          A smart checklist that tells you what to do and when — based on your move date.
        </p>

        <a href="/login">
          <button
            style={{
              padding: "14px 24px",
              fontSize: "16px",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Start your move →
          </button>
        </a>

        {/* Spacer */}
        <div style={{ height: "50px" }} />

        {/* Features */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            textAlign: "left",
          }}
        >
          <div>
            <h3>🧠 Smart reminders</h3>
            <p style={{ color: "#555" }}>
              Know exactly what to do at each stage of your move.
            </p>
          </div>

          <div>
            <h3>📋 Organized checklist</h3>
            <p style={{ color: "#555" }}>
              Keep track of utilities, subscriptions, and everything else.
            </p>
          </div>

          <div>
            <h3>🚚 Movers & supplies</h3>
            <p style={{ color: "#555" }}>
              Find movers and packing supplies when you need them.
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: "50px" }} />

        {/* Realtor angle (VERY important) */}
        <div
          style={{
            padding: "20px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            background: "white",
          }}
        >
          <h3>🏡 For realtors</h3>
          <p style={{ color: "#555" }}>
            Give this to your clients after closing to help them stay organized and reduce stress.
          </p>
        </div>
      </div>
    </div>
  );
}
