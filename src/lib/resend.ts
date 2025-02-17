import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
  try {
    await resend.emails.send({
      from: 'FUNERAL <drops@funeral.com>',
      to: email,
      subject: 'FUNERAL',
      html: `
        <div style="background-color: black; min-height: 100vh; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: white; font-size: 48px; font-weight: 500; letter-spacing: -0.05em; margin: 60px 0;">
              FUNERAL
            </h1>
            <div style="height: 1px; background-color: #333; margin: 40px 0;"></div>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 40px; font-weight: 400;">
              Thank you for joining us.
            </p>
            <div style="height: 1px; background-color: #333; margin: 40px 0;"></div>
            <p style="color: #666; font-size: 12px; margin: 60px 0 0; font-weight: 400;">
              FUNERAL PACKAGING COMPANY © 2025
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export async function sendDropEmail(email: string, dropDetails: {
  name: string;
  description: string;
  imageUrl: string;
  date: string;
}) {
  try {
    await resend.emails.send({
      from: 'FUNERAL <drops@funeral.com>',
      to: email,
      subject: `FUNERAL - ${dropDetails.name}`,
      html: `
        <div style="background-color: black; min-height: 100vh; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: white; font-size: 48px; font-weight: 500; letter-spacing: -0.05em; margin: 60px 0;">
              FUNERAL
            </h1>
            <div style="height: 1px; background-color: #333; margin: 40px 0;"></div>
            <h2 style="color: white; font-size: 24px; font-weight: 400; margin: 0 0 40px;">
              ${dropDetails.name}
            </h2>
            <img src="${dropDetails.imageUrl}" alt="${dropDetails.name}" style="width: 100%; margin: 0 0 40px;" />
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 20px; font-weight: 400;">
              ${dropDetails.description}
            </p>
            <p style="color: white; font-size: 14px; margin: 0 0 40px; font-weight: 500; letter-spacing: 0.05em;">
              DROPPING ${dropDetails.date}
            </p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="display: inline-block; background-color: white; color: black; padding: 16px 32px; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; font-weight: 500;">
              VIEW DROP
            </a>
            <div style="height: 1px; background-color: #333; margin: 40px 0;"></div>
            <p style="color: #666; font-size: 12px; margin: 60px 0 0; font-weight: 400;">
              FUNERAL PACKAGING COMPANY © 2025
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending drop email:', error);
    throw error;
  }
} 