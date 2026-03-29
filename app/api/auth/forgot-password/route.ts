import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExp: new Date(Date.now() + 1000 * 60 * 30),
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://app.myaddressupdated.com";

  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
   });
  console.log("RESET LINK:", resetLink); // for now

  return NextResponse.json({ success: true });
}
