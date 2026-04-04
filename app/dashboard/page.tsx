import { prisma } from "@/lib/prisma";
import { getReminder } from "@/lib/reminders";
import { sendReminderEmail } from "@/lib/sendReminderEmail";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {

  const move = await prisma.move.findFirst({
    include: {
      user: true,
    },
  });

  const reminder = move?.moveDate
    ? getReminder(move.moveDate)
    : null;

  const today = new Date().toDateString();

console.log("MOVE:", move);
console.log("REMINDER:", reminder);
console.log("EMAIL:", move?.user?.email);
console.log("LAST SENT:", move?.lastReminderSent);

  if (
    reminder &&
    move?.user?.email &&
    move.lastReminderSent?.toDateString() !== today
  ) {
    await sendReminderEmail(move.user.email, reminder);

    await prisma.move.update({
      where: { id: move.id },
      data: { lastReminderSent: new Date() },
    });
  }

  return <DashboardClient />;
}
