import type { APIRoute } from "astro";
import { createTransport } from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ success: false, error: "All fields required" }), {
        status: 400,
      });
    }

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "insifi@aubergine.co",
      subject: "New Insifi Contact Form Submission",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <style>
              li {
                font-size: 14px;
              }
              p{
                font-size:16px;
              }
            </style>
          </head>
          <body>
          <p>We have received a new inquiry from Contact Form. Here is the detail summary:
          </p
            <ul>
              <li>
                <b>Name:</b>
                ${name}
              </li>
              <li>
                <b>Email:</b>
                ${email}
              </li>
              <li>
                <b>Message:</b>
                ${message || "N/A"}
              </li>
            </ul>
          </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
    });
  }
};
