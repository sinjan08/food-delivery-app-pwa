
import logger from '@/config/logger';
import transporter from './../config/mail';

export const sendMail = async (to: string, subject: string, body: string) => {
  try {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);


    return info;
  } catch (error: any) {
    logger.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};