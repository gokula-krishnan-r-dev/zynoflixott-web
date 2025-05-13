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

        // Create basic email with minimal properties to avoid spam filters
        const message = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL as string,
                name: 'ZynoflixOTT'
            },
            subject: 'Your Verification Code',
            text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="color: #666; font-size: 16px;">Hello ${fullName || 'there'},</p>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
            &copy; ${new Date().getFullYear()} ZynoflixOTT
          </p>
        </div>
      `
        };

        // Send email with OTP
        await sgMail.send(message);

        // Return the OTP in response
        return NextResponse.json(
            { success: true, otp, message: 'OTP sent successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        // Return more detailed error message for debugging
        return NextResponse.json(
            {
                error: 'Failed to send verification code',
                details: error.message || 'Unknown error',
                response: error.response?.body || {}
            },
            { status: 500 }
        );
    }
} 