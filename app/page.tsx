export default function Home() {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      {/* HERO */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 20px 40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>
          Moving is stressful.{" "}
          <span style={{ color: "#2563eb" }}>This makes it simple.</span>
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          A smart checklist that tells you what to do and when — based on your move date.
        </p>

        <a href="/signup">
          <button
            style={{
              padding: "14px 28px",
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
      </div>

      {/* FEATURE SECTION */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
          }}
        >
          <Feature
            title="🧠 Smart reminders"
            text="Know exactly what to do at each stage of your move — no guesswork."
          />

          <Feature
            title="📋 Organized checklist"
            text="Track utilities, subscriptions, and everything you need to update."
          />

          <Feature
            title="🚚 Movers & supplies"
            text="Find movers and packing supplies at the right time."
          />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div
        style={{
          background: "white",
          padding: "50px 20px",
          marginTop: "40px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            How it works
          </h2>

          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            <Step
              number="1"
              text="Enter your move details"
            />
            <Step
              number="2"
              text="Get a personalized checklist"
            />
            <Step
              number="3"
              text="Follow reminders as your move approaches"
            />
          </div>
        </div>
      </div>

      {/* REALTOR SECTION */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        <div
          style={{
            background: "#eef2ff",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #c7d2fe",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>🏡 For realtors</h3>

          <p style={{ color: "#555" }}>
            Give this to your clients after closing to help them stay organized,
            reduce stress, and feel supported throughout the move.
          </p>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px 80px",
        }}
      >
        <a href="/signup">
          <button
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              borderRadius: "10px",
              background: "#111",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Get started →
          </button>
        </a>
      </div>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 style={{ marginBottom: "6px" }}>{title}</h3>
      <p style={{ color: "#555" }}>{text}</p>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
        }}
      >
        {number}
      </div>
      <div>{text}</div>
    </div>
  );
}
