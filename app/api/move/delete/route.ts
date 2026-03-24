import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
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

    if (!move) {
      return NextResponse.json({ error: "No move found" }, { status: 404 });
    }

    // delete checklist items
    await prisma.checklistItem.deleteMany({
      where: { moveId: move.id },
    });

    // delete move
    await prisma.move.delete({
      where: { id: move.id },
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
