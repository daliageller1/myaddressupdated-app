import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(email: string, reminder: any) {
  await resend.emails.send({
    from: "admin@myaddressupdated.com",
    to: email,
    subject: "Your moving reminder",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:500px; margin:0 auto; background:white; padding:20px; border-radius:10px;">
          
          <h2>${reminder.title}</h2>

          <ul>
            ${reminder.suggestions
              .map((s: string) => `<li>${s}</li>`)
              .join("")}
          </ul>

        </div>
      </div>
    `,
  });
}
