export const verifyEmailTemplate = (name, verificationLink) => {

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
  </head>

  <body style="font-family: Arial; background:#f4f4f4; padding:20px">

    <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px">

      <h2>Hello ${name},</h2>

      <p>Thank you for signing up for our Todo App.</p>

      <p>Please verify your email by clicking the button below:</p>

      <a href="${verificationLink}"
         style="display:inline-block;
         padding:12px 20px;
         background:#4CAF50;
         color:white;
         text-decoration:none;
         border-radius:6px">
         Verify Email
      </a>

      <p style="margin-top:20px">
        If you did not create this account, please ignore this email.
      </p>

      <hr/>

      <p style="font-size:12px;color:gray">
        Todo App Team
      </p>

    </div>

  </body>
  </html>
  `;
};