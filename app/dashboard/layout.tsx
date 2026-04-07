export default function DashboardLayout({ children }: any) {
  return (
    <div style={{ minHeight: "100vh" }}>

      {/* Top Nav */}
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #eee",
          background: "white",
        }}
      >
        <div style={{ fontWeight: "600" }}>Move App</div>

        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/realtors">Realtors</a>
        </div>
      </div>

      {/* Page Content */}
      <div
        style={{
          padding: "0px 24px",
          width: "95%",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
