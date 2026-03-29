import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!password || password.trim().length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token?.trim(),
      resetTokenExp: {
        not: null,
        gte: now,
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashed, // 👈 IMPORTANT for your schema
      resetToken: null,
      resetTokenExp: null,
    },
  });

  return NextResponse.json({ success: true });
}
