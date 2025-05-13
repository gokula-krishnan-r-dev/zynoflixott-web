import { NextResponse } from 'next/server';

export async function GET() {
    // Check if SendGrid API key is set
    const hasApiKey = !!process.env.SENDGRID_API_KEY;

    // Check if sender email is set
    const hasSenderEmail = !!process.env.SENDGRID_FROM_EMAIL;

    // Get masked versions of the values for security
    const maskedApiKey = process.env.SENDGRID_API_KEY
        ? `${process.env.SENDGRID_API_KEY.substring(0, 4)}...${process.env.SENDGRID_API_KEY.substring(process.env.SENDGRID_API_KEY.length - 4)}`
        : 'not set';

    const maskedEmail = process.env.SENDGRID_FROM_EMAIL
        ? process.env.SENDGRID_FROM_EMAIL
        : 'not set';

    return NextResponse.json({
        environment: process.env.NODE_ENV,
        sendgrid: {
            hasApiKey,
            hasSenderEmail,
            maskedApiKey,
            maskedEmail
        }
    });
} 