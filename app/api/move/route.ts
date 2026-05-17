import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const STREET_WORDS = [
  "street",
  "st",
  "avenue",
  "ave",
  "road",
  "rd",
  "drive",
  "dr",
  "lane",
  "ln",
  "court",
  "ct",
  "boulevard",
  "blvd",
  "way",
  "place",
  "pl",
];

function parseAddress(address: string) {
  if (!address) {
    return { city: "", state: "" };
  }

  // Remove commas + normalize whitespace
  const clean = address
    .replace(/,/g, "")
    .trim();

  const parts = clean.split(/\s+/);

  if (parts.length < 3) {
    return { city: "", state: "" };
  }

  // State is before ZIP
  const state = parts[parts.length - 2] ?? "";

  const beforeState = parts.slice(0, -2);

  const last = beforeState[beforeState.length - 1] ?? "";
  const secondLast =
    beforeState[beforeState.length - 2] ?? "";

  // Pittsburgh PA
  if (
    STREET_WORDS.includes(
      secondLast.toLowerCase()
    )
  ) {
    return {
      city: last,
      state,
    };
  }

  // San Francisco CA
  return {
    city: `${secondLast} ${last}`.trim(),
    state,
  };
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

    const { oldAddress, newAddress, moveDate } = await req.json();

    if (!oldAddress || !newAddress || !moveDate) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

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

    const oldParsed = parseAddress(oldAddress);
    const newParsed = parseAddress(newAddress);

    const move = await prisma.move.create({
      data: {
        userId: decoded.userId,
        oldAddress,
        newAddress,

        // ✅ NEW structured fields
        oldCity: oldParsed.city?.replace(",", "").trim() ?? "",
        oldState: oldParsed.state?.replace(",", "").trim() ?? "",
        newCity: newParsed.city?.replace(",", "").trim() ?? "",
        newState: newParsed.state?.replace(",", "").trim() ?? "",
        moveDate: new Date(moveDate + "T12:00:00"),
        lastReminderSent: null,
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

    const { moveDate, oldAddress, newAddress } = await req.json();

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

    if (oldAddress) {
      data.oldAddress = oldAddress;

      const parsed = parseAddress(oldAddress);
      data.oldCity = parsed.city;
      data.oldState = parsed.state;
    }

    if (newAddress) {
      data.newAddress = newAddress;

      const parsed = parseAddress(newAddress);
      data.newCity = parsed.city;
      data.newState = parsed.state;
    }

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
