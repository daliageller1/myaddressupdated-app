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

    const email =
      body?.data?.email;

    const from =
      email?.from ??
      "unknown";

    const to =
      email?.to ??
      "hello@myaddressupdated.com";

    const subject =
      email?.subject ??
      "(No Subject)";

    const text =
      email?.text ??
      "No content";

    await resend.emails.send({
      from:
        "hello@myaddressupdated.com",

      to:
        process.env
          .SUPPORT_EMAIL!,

      subject:
        `[Support] ${subject}`,

      text: `
Forwarded message

From: ${from}
To: ${to}

${text}
      `,
    });

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
          "Failed to process email.",
      },
      { status: 500 }
    );
  }
}
