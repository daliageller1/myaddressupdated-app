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
    from: "admin@myaddressupdated.com",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="background:#f4f6f8; padding:40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    
        <div style="max-width:480px; margin:0 auto; background:white; border-radius:12px; padding:32px; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
      
          <!-- App Name -->
          <div style="text-align:center; margin-bottom:24px;">
            <h2 style="margin:0; color:#111;">MyAddressUpdated</h2>
          </div>

          <!-- Title -->
          <h3 style="margin:0 0 12px 0; color:#111;">
            Reset your password
          </h3>

          <!-- Message -->
          <p style="color:#555; line-height:1.5; margin-bottom:24px;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>

          <!-- Button -->
          <div style="text-align:center; margin:30px 0;">
            <a href="${resetLink}"
               style="
                 background:#2563eb;
                 color:white;
                 padding:12px 20px;
                 border-radius:8px;
                 text-decoration:none;
                 font-weight:600;
                 display:inline-block;
               ">
              Reset Password
            </a>
          </div>

          <!-- Expiry -->
          <p style="color:#777; font-size:14px; margin-bottom:20px;">
            This link will expire in 30 minutes.
          </p>

          <!-- Fallback -->
          <p style="color:#999; font-size:12px; word-break:break-all;">
            If the button doesn’t work, copy and paste this link into your browser:<br/>
            ${resetLink}
          </p>

          <!-- Divider -->
          <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />

          <!-- Footer -->
          <p style="color:#aaa; font-size:12px; text-align:center;">
            If you didn’t request this, you can safely ignore this email.
          </p>

        </div>

      </div>
    `,
   });
  console.log("RESET LINK:", resetLink); // for now

  return NextResponse.json({ success: true });
}
