import { env } from "@/config/env";

export const verifyEmailTemplate = async (name: string, link: string) => {
  const template: string = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${env.APP_NAME} – Email Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Just in case some clients support it – main layout is still table-based */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .content {
        padding: 20px !important;
      }
      .btn {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f5f5f5; padding:24px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#ff7b39,#ffb347); padding:20px 24px;">
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">
                ${env.APP_NAME}
              </h1>
              <p style="margin:8px 0 0; font-size:14px; color:#ffe9d2;">
                Tasty food, verified securely.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:24px 28px 28px;">
              <p style="margin:0 0 12px; font-size:16px; color:#222222;">
                Hi ${name},
              </p>

              <p style="margin:0 0 16px; font-size:14px; color:#444444; line-height:1.6;">
                Thanks for signing up for <strong>${env.APP_NAME}</strong>! Before you start ordering your favourite dishes,
                please confirm that this email address belongs to you.
              </p>

              <!-- Verification Button -->
              <p style="margin:0 0 20px; text-align:center;">
                <a href="${link}"
                   class="btn"
                   style="background-color:#ff7b39; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:999px; font-size:15px; font-weight:600; display:inline-block;">
                  Verify Email
                </a>
              </p>

              <p style="margin:0 0 16px; font-size:12px; color:#888888; line-height:1.6;">
                This link and code will expire in <strong>${env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME}</strong>.  
                If you didn’t create an account on ${env.APP_NAME}, you can safely ignore this email.
              </p>

              <p style="margin:0; font-size:13px; color:#777777; line-height:1.6;">
                Bon appétit,<br />
                <strong>The ${env.APP_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:14px 24px 18px; background-color:#fafafa;">
              <p style="margin:0 0 4px; font-size:11px; color:#aaaaaa;">
                You’re receiving this email because you signed up for ${env.APP_NAME}.
              </p>
              <p style="margin:0; font-size:11px; color:#aaaaaa;">
                &copy; ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;

  return template;
}


export const forgotPasswordTemplate = async (name: string, link: string) => {
  const template: string = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${env.APP_NAME} – Reset Your Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 16px !important;
      }
      .content {
        padding: 20px !important;
      }
      .btn {
        width: 100% !important;
        display: block !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f5f5f5; padding:24px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#ff7b39,#ffb347); padding:20px 24px;">
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">
                ${env.APP_NAME}
              </h1>
              <p style="margin:8px 0 0; font-size:14px; color:#ffe9d2;">
                Secure password recovery
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:24px 28px 28px;">
              <p style="margin:0 0 12px; font-size:16px; color:#222222;">
                Hi ${name},
              </p>

              <p style="margin:0 0 16px; font-size:14px; color:#444444; line-height:1.6;">
                We received a request to reset your password for your <strong>${env.APP_NAME}</strong> account.
                Click the button below to choose a new password.
              </p>

              <!-- Reset Button -->
              <p style="margin:0 0 20px; text-align:center;">
                <a href="${link}"
                   class="btn"
                   style="background-color:#ff7b39; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:999px; font-size:15px; font-weight:600; display:inline-block;">
                  Reset Password
                </a>
              </p>

              <p style="margin:0 0 16px; font-size:12px; color:#888888; line-height:1.6;">
                This password reset link will expire in
                <strong>${env.FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME}</strong>.
                For security reasons, the link can be used only once.
              </p>

              <p style="margin:0 0 16px; font-size:12px; color:#888888; line-height:1.6;">
                If you didn’t request a password reset, please ignore this email.
                Your account will remain secure.
              </p>

              <p style="margin:0; font-size:13px; color:#777777; line-height:1.6;">
                Stay safe,<br />
                <strong>The ${env.APP_NAME} Security Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:14px 24px 18px; background-color:#fafafa;">
              <p style="margin:0 0 4px; font-size:11px; color:#aaaaaa;">
                This email was sent because a password reset was requested for your account.
              </p>
              <p style="margin:0; font-size:11px; color:#aaaaaa;">
                &copy; ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;

  return template;
};
