import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { moveId, category, label } = body;

  const item = await prisma.checklistItem.create({
    data: {
      moveId,
      category,
      label,
    },
  });

  return NextResponse.json(item);
}
