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

  const daysLeft = move.moveDate
    ? Math.ceil(
      (new Date(move.moveDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
      )
    : null;

  const milestones = [30, 14, 7, 3, 1, 0];

  console.log("reminder:", reminder);
  console.log("move.user.email:", move.user?.email);
  console.log("daysLeft:", daysLeft);
  console.log("move.lastReminderSent.toDateString:", move.lastReminderSent?.toDateString());

  if (
    reminder &&
    move.user?.email &&
    daysLeft !== null &&
    milestones.includes(daysLeft) &&
    (move.lastReminderSent?.toDateString() === today || move.lastReminderSent?.toDateString === undefined)
  ) {
    console.log("📧 Sending milestone email:", daysLeft);

    await sendReminderEmail(move.user.email, reminder);

    await prisma.move.update({
      where: { id: move.id },
      data: { lastReminderSent: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
