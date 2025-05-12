import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp, expectedOtp } = body;

        if (!email || !otp || !expectedOtp) {
            return NextResponse.json(
                { error: 'Email, OTP, and expected OTP are required' },
                { status: 400 }
            );
        }

        // Verify OTP
        // In a real application, you would fetch the expected OTP from a database
        // Here we're using the expectedOtp that was passed in the request
        if (otp === expectedOtp) {
            return NextResponse.json(
                { success: true, message: 'OTP verified successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, error: 'Invalid OTP' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
} 