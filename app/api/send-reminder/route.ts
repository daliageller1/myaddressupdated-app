import { prisma } from "@/lib/prisma";
import { getReminder } from "@/lib/reminders";
import { sendReminderEmail } from "@/lib/sendReminderEmail";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("🔥 API ROUTE HIT");

  const move = await prisma.move.findFirst({
    include: { user: true },
  });

  if (!move || !move.user?.email) {
    return NextResponse.json({ success: false });
  }

  const reminder = move.moveDate
    ? getReminder(move.moveDate)
    : null;

  const today = new Date().toDateString();

  if (
    reminder &&
    move.lastReminderSent?.toDateString() !== today
  ) {
    console.log("📧 Sending email to:", move.user.email);

    await sendReminderEmail(move.user.email, reminder);

    await prisma.move.update({
      where: { id: move.id },
      data: { lastReminderSent: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
