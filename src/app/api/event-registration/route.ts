import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import EventRegistration from '@/models/EventRegistration';
export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Parse the request body
        const body = await request.json();

        // Extract form data
        const {
            name,
            email,
            phone,
            filmTitle,
            filmDuration,
            filmGenre,
            driverLink,
            agreeToTerms
        } = body;

        // Validate required fields
        if (!name || !email || !phone || !filmTitle || !filmDuration || !filmGenre || !agreeToTerms) {
            return NextResponse.json(
                { success: false, message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate film duration
        const duration = Number(filmDuration);
        if (isNaN(duration) || duration < 5 || duration > 30) {
            return NextResponse.json(
                { success: false, message: 'Film duration must be between 5 and 30 minutes' },
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

        // Check if email already registered
        const existingRegistration = await EventRegistration.findOne({ email });
        if (existingRegistration) {
            return NextResponse.json(
                { success: false, message: 'This email is already registered for the event' },
                { status: 400 }
            );
        }

        // Create new registration
        const newRegistration = new EventRegistration({
            name,
            email,
            phone,
            filmTitle,
            filmDuration: duration,
            filmGenre,
            driverLink: driverLink || undefined,
            agreeToTerms
        });

        // Save to database
        await newRegistration.save();
        console.log('New event registration:', newRegistration._id);

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: 'Registration submitted successfully!',
                data: {
                    id: newRegistration._id,
                    name,
                    email,
                    filmTitle
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error submitting event registration:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to submit registration',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 