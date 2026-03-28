export default function Home() {
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
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Your Move Checklist
        </h1>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Stay organized during your move.
        </p>

        <a href="/login">
          <button
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </a>
      </div>
    </div>
  );
}
