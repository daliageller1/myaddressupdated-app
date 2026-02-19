import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { completed } = await req.json();

  const item = await prisma.checklistItem.update({
    where: { id: params.id },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json(item);
}
