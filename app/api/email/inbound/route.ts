import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    console.log(
      "Webhook payload:",
      JSON.stringify(body, null, 2)
    );

    const email = body?.data;
console.log(
  "EMAIL OBJECT:",
  JSON.stringify(email, null, 2)
);

    const from =
      email?.from ??
      "unknown";

    const to = Array.isArray(email?.to)
      ? email.to.join(", ")
      : email?.to ??
        "hello@myaddressupdated.com";

    const subject =
      email?.subject ??
      "(No Subject)";

const result =
  await resend.emails.send({
    from:
      "My Address Updated <hello@myaddressupdated.com>",

    to:
      process.env
        .SUPPORT_EMAIL!,

    replyTo: from,

    subject:
      `[Forwarded] ${subject}`,

    text: `
Forwarded message

From: ${from}
To: ${to}

Subject: ${subject}
      `,
  });

console.log(
  "SUPPORT_EMAIL:",
  process.env.SUPPORT_EMAIL
);

console.log(
  "Resend result:",
  JSON.stringify(result, null, 2)
);

console.log(
  "Forwarded email successfully"
);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Inbound email error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process email",
      },
      { status: 500 }
    );
  }
}
