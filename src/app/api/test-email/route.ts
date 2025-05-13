import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET(request: NextRequest) {
    // Get email from URL parameter
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json(
            { error: 'Email parameter is required' },
            { status: 400 }
        );
    }

    try {
        // Set SendGrid API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        // Create a very simple test email
        const msg = {
            to: email,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL as string,
                name: 'ZynoflixOTT Test'
            },
            subject: 'SendGrid Test Email',
            text: 'This is a test email to verify SendGrid is working properly.',
            html: '<div style="font-family: Arial; padding: 20px; text-align: center;"><h2>Test Email</h2><p>This is a test email to verify that SendGrid is working properly.</p></div>',
        };

        // Send the test email
        const result = await sgMail.send(msg);

        // Return success response with full SendGrid response for debugging
        return NextResponse.json({
            success: true,
            message: 'Test email sent successfully',
            statusCode: result[0].statusCode,
            headers: result[0].headers,
        });
    } catch (error: any) {
        console.error('Error sending test email:', error);

        // Return detailed error for debugging
        return NextResponse.json({
            error: 'Failed to send test email',
            message: error.message,
            code: error.code,
            response: error.response?.body || {},
        }, { status: 500 });
    }
} 