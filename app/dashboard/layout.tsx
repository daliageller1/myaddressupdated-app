export default function DashboardLayout({ children }: any) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          padding: "20px",
          borderRight: "1px solid #eee",
        }}
      >
        <h2>Move App</h2>

        <div style={{ marginTop: "20px" }}>
          <a href="/dashboard">🏠 Dashboard</a>
        </div>

        <div style={{ marginTop: "10px" }}>
          <a href="/dashboard/realtors">🏡 Realtors</a>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
