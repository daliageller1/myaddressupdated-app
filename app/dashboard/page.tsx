export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { getReminder } from "@/lib/reminders";
import { sendReminderEmail } from "@/lib/sendReminderEmail";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  console.log("🔥 DASHBOARD SERVER RUNNING");

  const move = await prisma.move.findFirst({
    include: {
      user: true,
    },
  });

  const reminder = move?.moveDate
    ? getReminder(move.moveDate)
    : null;

  const today = new Date().toDateString();

// console.error("page REMINDER:", reminder);
// console.error("page EMAIL:", move?.user?.email);
// console.error("page LAST SENT:", move?.lastReminderSent);
// console.log("dashboard server MOVE:", move);

  if (
    reminder &&
    move?.user?.email &&
    move.lastReminderSent?.toDateString() !== today
  ) {
    console.error("dashboard server yes calling sendReminderEmail");
    const result = await sendReminderEmail(move.user.email, reminder);
    console.log("📬 EMAIL RESULT:", result);

    await prisma.move.update({
      where: { id: move.id },
      data: { lastReminderSent: new Date() },
    });
  }
  console.error("dashboard server not calling sendReminderEmail");

  return <DashboardClient />;
}
