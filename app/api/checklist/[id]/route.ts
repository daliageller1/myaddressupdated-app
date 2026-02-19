import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await request.json();
  const { completed } = body;

  const updatedItem = await prisma.checklistItem.update({
    where: { id },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json(updatedItem);
}
