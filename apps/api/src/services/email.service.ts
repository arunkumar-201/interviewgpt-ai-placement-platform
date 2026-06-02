import { env } from '../config/env.js';

export class EmailService {
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    if (env.NODE_ENV === 'development') {
      console.log('\n─── Password Reset Email (dev) ───');
      console.log(`To: ${email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('──────────────────────────────────\n');
      return;
    }

    // Production: integrate SMTP (nodemailer) when SMTP_* env vars are set
    console.log(`[Email] Password reset requested for ${email}`);
  }
}

export const emailService = new EmailService();
