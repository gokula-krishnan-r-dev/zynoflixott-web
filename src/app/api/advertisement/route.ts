import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import env from '@/config/env';

export async function POST(request: NextRequest) {
    try {
        // Check if advertisement feature is enabled
        if (!env.ENABLE_ADVERTISEMENT) {
            return NextResponse.json(
                { success: false, message: 'Advertisement submissions are currently disabled' },
                { status: 503 }
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const body = await request.json();

        // Extract form data
        const {
            name,
            location,
            date,
            promotionType,
            contact,
            email,
            description
        } = body;

        // Validate required fields
        if (!name || !location || !promotionType || !contact || !email || !description) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Create a new advertisement entry
        const newAdvertisement = new Advertisement({
            name,
            location,
            date: date || new Date(),
            promotionType,
            contact,
            email,
            description
        });

        // Save to database
        await newAdvertisement.save();
        console.log('New advertisement request saved:', newAdvertisement._id);

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: 'Advertisement request submitted successfully',
                data: {
                    id: newAdvertisement._id,
                    name,
                    email,
                    promotionType
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error submitting advertisement:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to submit advertisement request',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 