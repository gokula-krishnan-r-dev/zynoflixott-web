import connectToDatabase from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id;

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // In a real application, fetch event from database
        // For demo purposes, we'll return mock data
        const event = await fetchEventById(eventId);

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
        return NextResponse.json({
            error: 'Failed to fetch event details',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Mock function to fetch event by ID (in production, this would query a database)
async function fetchEventById(eventId: string) {
    await connectToDatabase();

    const livestream = await LiveStream.findById(eventId);

    return livestream;
} 