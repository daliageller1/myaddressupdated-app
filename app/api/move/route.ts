import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function formatAddress({
  line1,
  line2,
  city,
  state,
  zip,
  country,
}: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}) {
  const street = [
    line1,
    line2,
  ]
    .filter(Boolean)
    .join(" ");

  const cityState = [
    city,
    state,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    street,
    cityState,
    zip,
    country !== "US"
      ? country
      : null,
  ]
    .filter(Boolean)
    .join(" ");
}

export async function POST(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const {
      moveDate,

      oldAddressLine1,
      oldAddressLine2,
      oldCity,
      oldState,
      oldZip,
      oldCountry,

      newAddressLine1,
      newAddressLine2,
      newCity,
      newState,
      newZip,
      newCountry,
    } = await req.json();

    const oldAddress =
      formatAddress({
        line1:
          oldAddressLine1,
        line2:
          oldAddressLine2,
        city: oldCity,
        state: oldState,
        zip: oldZip,
        country: oldCountry,
      });

    const newAddress =
      formatAddress({
        line1:
          newAddressLine1,
        line2:
          newAddressLine2,
        city: newCity,
        state: newState,
        zip: newZip,
        country: newCountry,
      });

    // Check if user already has a move
    const existingMove = await prisma.move.findFirst({
      where: { userId: decoded.userId },
    });

    if (existingMove) {
      return NextResponse.json(
        { error: "Move already exists" },
        { status: 400 }
      );
    }

    const move = await prisma.move.create({
      data: {
        userId: decoded.userId,

        oldAddress,
        newAddress,

        oldAddressLine1,
        oldAddressLine2,
        oldCity,
        oldState,
        oldZip,
        oldCountry,

        newAddressLine1,
        newAddressLine2,
        newCity,
        newState,
        newZip,
        newCountry,

        moveDate:
          new Date(
            moveDate +
              "T12:00:00"
          ),
      },
    });

    // Generate default checklist
    const checklistItems = [
      { category: "Government", label: "Submit USPS change of address" },
      { category: "Financial", label: "Update banks and credit cards" },
      { category: "Utilities", label: "Update electricity and gas" },
      { category: "Insurance", label: "Notify auto insurance" },
      { category: "Subscriptions", label: "Update subscriptions" },
      { category: "Miscellaneous", label: "Add any other updates" },
    ];

    await prisma.checklistItem.createMany({
      data: checklistItems.map((item) => ({
        moveId: move.id,
        category: item.category,
        label: item.label,
      })),
    });

    return NextResponse.json({
      message: "Move created",
      moveId: move.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const {
      moveDate,

      oldAddressLine1,
      oldAddressLine2,
      oldCity,
      oldState,
      oldZip,
      oldCountry,

      newAddressLine1,
      newAddressLine2,
      newCity,
      newState,
      newZip,
      newCountry,
    } = await req.json();

    const move = await prisma.move.findFirst({
      where: { userId: decoded.userId },
    });

    if (!move) {
      return NextResponse.json({ error: "Move not found" }, { status: 404 });
    }

    const data: any = {};

    if (moveDate) {
      data.moveDate = new Date(moveDate + "T12:00:00");
      data.lastReminderSent = null;
    }

    data.oldAddressLine1 =
      oldAddressLine1;
    data.oldAddressLine2 =
      oldAddressLine2;
    data.oldCity = oldCity;
    data.oldState = oldState;
    data.oldZip = oldZip;
    data.oldCountry =
      oldCountry ?? "US";

    data.newAddressLine1 =
      newAddressLine1;
    data.newAddressLine2 =
      newAddressLine2;
    data.newCity = newCity;
    data.newState = newState;
    data.newZip = newZip;
    data.newCountry =
      newCountry ?? "US";

    data.oldAddress =
      formatAddress({
        line1:
          oldAddressLine1,
        line2:
          oldAddressLine2,
        city: oldCity,
        state: oldState,
        zip: oldZip,
        country:
          oldCountry,
      });

    data.newAddress =
      formatAddress({
        line1:
          newAddressLine1,
        line2:
          newAddressLine2,
        city: newCity,
        state: newState,
        zip: newZip,
        country:
          newCountry,
      });

    await prisma.move.update({
      where: { id: move.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const move = await prisma.move.findFirst({
      where: { userId: decoded.userId },
    });

    return NextResponse.json({ move });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
