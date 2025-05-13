import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

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

        // Get the domain part of the email for personalization
        const domain = email.substring(email.lastIndexOf("@") + 1);

        // Store OTP in database or temporary storage (here we use a simple in-memory map)
        // In production, use a proper database or Redis to store OTPs
        const message: MailDataRequired = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL as string,
            subject: '[ZynoflixOTT] Your Verification Code',
            text: `Your ZynoflixOTT verification code is: ${otp}. This code will expire in 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <img src="https://zynoflixott.com/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75" alt="ZynoflixOTT Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
          <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
          <p style="color: #666; font-size: 16px;">Hello ${fullName || 'there'},</p>
          <p style="color: #666; font-size: 16px;">Please use the following verification code to complete your registration on ZynoflixOTT:</p>
          <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; border: 1px dashed #ccc;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 16px;">This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated message from ZynoflixOTT. Please do not reply to this email.
          </p>
          <p style="color: #999; font-size: 12px;">
            &copy; ${new Date().getFullYear()} ZynoflixOTT. All rights reserved.<br>
            Our address: 123 Streaming Ave, Digital City, 98765
          </p>
          <p style="color: #999; font-size: 12px;">
            <a href="https://zynoflixott.com/privacy-policy" style="color: #666;">Privacy Policy</a> | 
            <a href="https://zynoflixott.com/terms" style="color: #666;">Terms of Service</a>
          </p>
        </div>
      `,
            trackingSettings: {
                clickTracking: {
                    enable: true
                },
                openTracking: {
                    enable: true
                }
            },
            categories: ['verification', 'otp'],
            customArgs: {
                user_email: email,
                app: 'zynoflixott'
            },
            headers: {
                'X-Entity-Ref-ID': `otp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
            },
            asm: {
                groupId: 10, // Replace with your unsubscribe group ID in SendGrid
                groupsToDisplay: [10]
            }
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