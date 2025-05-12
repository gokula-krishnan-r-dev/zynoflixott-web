import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, fullName } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Set SendGrid API key from environment variable
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in database or temporary storage (here we use a simple in-memory map)
        // In production, use a proper database or Redis to store OTPs
        const message = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL as string,
            subject: 'Your ZynoflixOTT Verification Code',
            text: `Your verification code is: ${otp}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <img src="https://zynoflixott.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75" alt="ZynoflixOTT Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="color: #666; font-size: 16px;">Hello ${fullName || 'there'},</p>
          <p style="color: #666; font-size: 16px;">Thank you for signing up with ZynoflixOTT. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; border: 1px dashed #ccc;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            &copy; ${new Date().getFullYear()} ZynoflixOTT. All rights reserved.
          </p>
        </div>
      `,
        };

        // Send email with OTP
        await sgMail.send(message);

        // Return the OTP in response (in production, don't send back the actual OTP but a session token)
        return NextResponse.json(
            { success: true, otp, message: 'OTP sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code' },
            { status: 500 }
        );
    }
} 