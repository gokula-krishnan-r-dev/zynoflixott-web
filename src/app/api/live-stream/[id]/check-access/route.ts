import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import LiveStream from '@/models/LiveStream';
import UserStreamActivity from '@/models/UserStreamActivity';
import User from '@/models/User';
import mongoose from 'mongoose';

// Import session tracking functions from session route
// In a production environment, this would be a shared module or service
// For simplicity in this implementation, we'll replicate the key functions needed

// Function to get current viewers for an event
function getCurrentViewers(eventId: string): number {
    try {
        // Try to get from the module that manages sessions
        // This is a simplified implementation
        // In production, this would likely use Redis or another caching system

        // Count active sessions in the database as a fallback
        // This is an approximate count for demonstration
        const cacheKey = `event_viewers_${eventId}`;
        const cachedCount = global.sessionCache?.[cacheKey];

        if (cachedCount !== undefined) {
            return cachedCount;
        }

        // Return a default value if we can't get actual count
        return 0;
    } catch (error) {
        console.error('Error getting current viewers:', error);
        return 0;
    }
}

// Function to get current playback position for an event
function getPlaybackPosition(eventId: string): number {
    try {
        // Try to get from the module that manages sessions
        const cacheKey = `event_playback_${eventId}`;
        const cachedPosition = global.sessionCache?.[cacheKey];

        if (cachedPosition !== undefined) {
            return cachedPosition;
        }

        // Return 0 if we can't get actual position
        return 0;
    } catch (error) {
        console.error('Error getting playback position:', error);
        return 0;
    }
}

// Initialize global cache if not exists
if (!global.sessionCache) {
    global.sessionCache = {};
}

// Declare global namespace for TypeScript
declare global {
    var sessionCache: {
        [key: string]: any;
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const eventId = params.id;
        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        // Check for invitation token
        const url = new URL(request.url);
        const invitationToken = url.searchParams.get('invitation');

        // Connect to database
        await connectToDatabase();

        // Get current viewer count
        const currentViewers = getCurrentViewers(eventId);

        // Get current playback position
        const playbackPosition = getPlaybackPosition(eventId);

        // Check if the user has premium status
        const user = await User.findById(userId);
        const isPremium = user?.subscription?.status === 'active' || user?.isPremium || false;

        // Check if the live stream exists
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Get active viewers for this event (across all sessions)
        let activeViewers: string[] = [];

        // Check if user has active sharing sessions
        if (isPremium) {
            try {
                // This is a simplified way to get active viewers
                // In a production environment, this would likely come from Redis or another in-memory store
                // That stores the active sessions
                const sessionKey = `${userId}_${eventId}`;

                // Query active sessions with this user as inviter
                const viewerSessions = await mongoose.connection.collection('streamingInvitations').find({
                    inviterId: new mongoose.Types.ObjectId(userId),
                    eventId: new mongoose.Types.ObjectId(eventId),
                    status: 'accepted'
                }).toArray();

                // Extract viewer emails
                if (viewerSessions && viewerSessions.length > 0) {
                    activeViewers = viewerSessions.map(session => session.inviteeEmail);
                }
            } catch (error) {
                console.error('Error fetching active viewers:', error);
            }
        }

        // Check if the user is the creator (creators always have access)
        const isCreator = liveStream.userId === userId || liveStream.createdBy === userId;

        // Check if the user has an invitation
        let hasInvitation = false;
        let inviterId: string | undefined;

        if (invitationToken) {
            const invitation = await mongoose.connection.collection('streamingInvitations').findOne({
                token: invitationToken,
                inviteeId: new mongoose.Types.ObjectId(userId),
                eventId: new mongoose.Types.ObjectId(eventId),
                status: { $in: ['pending', 'accepted'] },
                expiresAt: { $gt: new Date() }
            });

            if (invitation) {
                hasInvitation = true;
                inviterId = invitation.inviterId.toString();
            }
        }

        if (isCreator) {
            return NextResponse.json({
                hasAccess: true,
                isCreator: true,
                isPremium,
                activeViewers,
                currentViewers,
                playbackPosition,
                event: {
                    _id: liveStream._id,
                    movieTitle: liveStream.movieTitle,
                    streamingDate: liveStream.streamingDate,
                    streamingTime: liveStream.streamingTime,
                    status: liveStream.status,
                    movieCategory: liveStream.movieCategory,
                    movieLanguage: liveStream.movieLanguage,
                    movieCertificate: liveStream.movieCertificate,
                    movieLength: liveStream.movieLength,
                    movieSubtitles: liveStream.movieSubtitles,
                    movieVideo: liveStream.movieVideo,
                    movieDescription: liveStream.movieDescription,
                    ticketCost: liveStream.ticketCost,
                    producerName: liveStream.movieProducer,
                    directorName: liveStream.movieDirector,
                    heroName: liveStream.movieHero,
                    heroinName: liveStream.movieHeroine,
                    allowedViewers: liveStream.allowedViewers || (isPremium ? 3 : 1)
                }
            });
        }

        // Check if the user has an active ticket for this event
        const tickets = await Ticket.find({
            userId,
            eventId,
            status: 'active'
        });

        const hasValidTicket = tickets.length > 0;
        const totalTickets = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 1), 0);

        // Record this access check in UserStreamActivity
        await UserStreamActivity.create({
            userId,
            eventId: new mongoose.Types.ObjectId(eventId),
            activityType: 'view',
            timestamp: new Date(),
            interactionData: {
                hasAccess: hasValidTicket || isCreator || hasInvitation,
                movieTitle: liveStream.movieTitle,
                deviceInfo: request.headers.get('user-agent') || 'unknown',
                hasInvitation,
                inviterId
            }
        });

        // Return access denied if user has no ticket and no invitation
        if (!hasValidTicket && !hasInvitation) {
            return NextResponse.json({
                hasAccess: false,
                message: 'No valid ticket found for this event',
                isPremium,
                currentViewers,
                event: {
                    _id: liveStream._id,
                    movieTitle: liveStream.movieTitle,
                    streamingDate: liveStream.streamingDate,
                    streamingTime: liveStream.streamingTime,
                    status: liveStream.status,
                    ticketCost: liveStream.ticketCost,
                    movieCategory: liveStream.movieCategory,
                    movieLanguage: liveStream.movieLanguage,
                    movieCertificate: liveStream.movieCertificate,
                    movieLength: liveStream.movieLength,
                    movieSubtitles: liveStream.movieSubtitles,
                    movieDescription: liveStream.movieDescription,
                    producerName: liveStream.movieProducer,
                    directorName: liveStream.movieDirector,
                    heroName: liveStream.movieHero,
                    heroinName: liveStream.movieHeroine,
                    allowedViewers: liveStream.allowedViewers || (isPremium ? 3 : 1)
                }
            });
        }

        return NextResponse.json({
            hasAccess: true,
            isCreator: false,
            isPremium,
            totalTickets,
            hasInvitation,
            inviterId,
            activeViewers,
            currentViewers,
            playbackPosition,
            tickets: tickets.map(ticket => ({
                ticketId: ticket._id,
                orderId: ticket.orderId,
                purchaseDate: ticket.purchaseDate,
                quantity: ticket.quantity || 1,
                status: ticket.status
            })),
            event: {
                _id: liveStream._id,
                movieTitle: liveStream.movieTitle,
                streamingDate: liveStream.streamingDate,
                streamingTime: liveStream.streamingTime,
                status: liveStream.status,
                ticketCost: liveStream.ticketCost,
                movieCategory: liveStream.movieCategory,
                movieLanguage: liveStream.movieLanguage,
                movieCertificate: liveStream.movieCertificate,
                movieLength: liveStream.movieLength,
                movieSubtitles: liveStream.movieSubtitles,
                movieVideo: liveStream.movieVideo,
                movieDescription: liveStream.movieDescription,
                producerName: liveStream.movieProducer,
                directorName: liveStream.movieDirector,
                heroName: liveStream.movieHero,
                heroinName: liveStream.movieHeroine,
                allowedViewers: liveStream.allowedViewers || (isPremium ? 3 : 1)
            }
        });
    } catch (error) {
        console.error('Error checking access:', error);
        return NextResponse.json({
            error: 'Failed to check access',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 