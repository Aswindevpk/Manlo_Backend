import { Resend } from 'resend';
import { env } from '../../config/env.js';

const resend = new Resend(env.resendApiKey);

export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Manlo <onboarding@updates.aswindev.in>', // Update this with your verified domain
      to: [to],
      subject: 'Welcome to Manlo!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p style="font-size: 16px; color: #555;">
            Welcome to <strong>Manlo</strong>! We're excited to have you on board.
          </p>
          <p style="font-size: 16px; color: #555;">
            It works! Your registration was successful.
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 14px; color: #777; margin: 0;">
              If you have any questions, feel free to reply to this email.
            </p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Best regards,<br/>
            The Manlo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending welcome email:', error);
    return { success: false, error };
  }
};

export const sendVerificationEmail = async (to: string, token: string) => {
  try {
    const verificationUrl = `https://manlo.dev/verify-email?token=${token}`; // Update with base frontend URL
    const { data, error } = await resend.emails.send({
      from: 'Manlo <onboarding@updates.aswindev.in>',
      to: [to],
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Verify your email</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up with <strong>Manlo</strong>. Please click the button below to verify your email address and complete your registration.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #777;">
            If the button above doesn't work, copy and paste this link into your browser:
          </p>
          <p style="font-size: 14px; color: #007bff; word-break: break-all;">
            ${verificationUrl}
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 14px; color: #777; margin: 0;">
              This link will expire in 24 hours. If you did not create an account, please ignore this email.
            </p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Best regards,<br/>
            The Manlo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    console.log('Verification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  try {
    const resetUrl = `https://manlo.dev/reset-password?token=${token}`; // Update with base frontend URL
    const { data, error } = await resend.emails.send({
      from: 'Manlo <onboarding@updates.aswindev.in>',
      to: [to],
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Reset your password</h2>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset your password for your <strong>Manlo</strong> account. Please click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #777;">
            If the button above doesn't work, copy and paste this link into your browser:
          </p>
          <p style="font-size: 14px; color: #007bff; word-break: break-all;">
            ${resetUrl}
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 14px; color: #777; margin: 0;">
              This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
            </p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #999;">
            Best regards,<br/>
            The Manlo Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending password reset email:', error);
    return { success: false, error };
  }
};


