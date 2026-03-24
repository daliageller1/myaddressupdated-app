import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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

    const move = await prisma.move.create({
      data: {
        userId: decoded.userId,
        oldAddress,
        newAddress,
        moveDate: new Date(moveDate),
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

    const { moveDate } = await req.json();

    const move = await prisma.move.findFirst({
      where: { userId: decoded.userId },
    });

    if (!move) {
      return NextResponse.json({ error: "Move not found" }, { status: 404 });
    }

    await prisma.move.update({
      where: { id: move.id },
      data: { moveDate: new Date(moveDate) },
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
