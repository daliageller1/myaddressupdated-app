import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function RealtorsPage() {
  const token =
    (await cookies()).get("token")?.value;

  let city = "";

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { userId: number };

      const move = await prisma.move.findFirst({
        where: {
          userId: String(decoded.userId),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (move?.newCity && move?.newState) {
        city = `${move.newCity}, ${move.newState}`;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>

      <h1
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "8px",
          lineHeight: "1.2",
        }}
      >
        🏡 Find a Realtor
        {city && (
          <span style={{ fontWeight: "600" }}>
            {" "}in {city}
          </span>
        )}
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "24px",
        }}
      >
        {city
          ? `Top-rated real estate professionals serving ${city}.`
          : "Connect with trusted real estate professionals in your area."}
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <input
          defaultValue={city}
          placeholder="Search by city..."
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 22px",
            height: "42px",
            cursor: "pointer",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          Search
        </button>
      </div>

{/* temporary fake data */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "18px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px 0",
          }}
        >
          Sarah Johnson
        </h3>

        <p
          style={{
            color: "#666",
            lineHeight: "1.5",
            margin: "0 0 4px 0",
          }}
        >
          Coldwell Banker
        </p>

        <p
          style={{
            margin: "0",
          }}
        >
          ⭐ 4.8 • (555) 123-4567
        </p>

        <button
          style={{
            marginTop: "8px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 22px",
            height: "42px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Contact
        </button>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "18px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px 0",
          }}
        >
          Michael Chen
        </h3>

        <p
          style={{
            color: "#666",
            lineHeight: "1.5",
            margin: "0 0 4px 0",
          }}
        >
          Compass
        </p>

        <p
          style={{
            margin: "0",
          }}
        >
          ⭐ 4.8 • (555) 987-6543
        </p>

        <button
          style={{
            marginTop: "8px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 22px",
            height: "42px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Contact
        </button>
      </div>
    </div>
  );
}
