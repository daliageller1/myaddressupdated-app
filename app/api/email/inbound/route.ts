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

    const emailId =
      email?.email_id;

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

    let messageBody =
      "(No message body)";

    // Fetch full email body
    if (emailId) {
      try {
        const response =
          await fetch(
            `https://api.resend.com/emails/${emailId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${process.env.RESEND_API_KEY}`,
              },
            }
          );

        const emailData =
          await response.json();

console.log(`emailData: ${emailData}`);
console.log(`emailData: ${JSON.stringify(emailData)}`);
console.log(
  "FULL EMAIL RESPONSE:",
  JSON.stringify(
    emailData,
    null,
    2
  )
);

        console.log(
          "Full email:",
          JSON.stringify(
            emailData,
            null,
            2
          )
        );

        messageBody =
          emailData?.text ??
          emailData?.html ??
          "(No message body)";
      } catch (err) {
        console.error(
          "Failed to fetch full email:",
          err
        );
      }
    }

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

Message:
${messageBody}
        `,
      });

    console.log(
      "Resend result:",
      JSON.stringify(
        result,
        null,
        2
      )
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
