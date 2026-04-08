import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const userId = decoded.userId;

    const move = await prisma.move.findFirst({
      where: { userId },
      include: { checklist: true },
    });

    return NextResponse.json({ move });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
