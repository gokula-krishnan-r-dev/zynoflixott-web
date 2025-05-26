import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';
import UserStreamActivity from '@/models/UserStreamActivity';
import User from '@/models/User';
import mongoose from 'mongoose';

// Define session actions
type SessionAction = 'start' | 'heartbeat' | 'end';

// In-memory session tracker (ideally this would be in Redis in production)
interface ActiveSession {
    userId: string;
    eventId: string;
    deviceId: string;
    lastActive: number;
    startTime: number;
    viewDuration: number; // Track how much time this session has viewed
    isSharedViewer?: boolean; // Whether this session is via a shared invitation
    inviterId?: string; // The user who invited this viewer (if applicable)
    currentTime?: number; // Current playback position
}

// Store active sessions with deviceId_userId_eventId as key
const activeSessions = new Map<string, ActiveSession>();

// Store user viewing time limits with userId_eventId as key
interface UserViewTimeLimit {
    totalViewTime: number;     // Total seconds viewed across all devices
    lastUpdated: number;       // Timestamp of last update
    deviceCount: number;       // Number of active devices
    maxTimePerUser: number;    // Maximum allowed viewing time in seconds
    isPremium: boolean;        // Whether user has premium status (unlimited time)
    maxDevices: number;        // Maximum allowed devices
    activeViewers: string[];   // List of active viewer emails (for shared viewing)
}

// Track viewing time per user across all devices
const userViewLimits = new Map<string, UserViewTimeLimit>();

// Store per-event data like current viewers and playback position
interface EventData {
    currentViewers: number;
    playbackPosition: number;
    lastUpdated: number;
}

// Track event-specific data with eventId as key
const eventData = new Map<string, EventData>();

// Configuration from environment variables or defaults
const HEARTBEAT_INTERVAL = parseInt(process.env.HEARTBEAT_INTERVAL || '30000'); // 30 seconds
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '60000'); // 60 seconds
const DEFAULT_MAX_VIEW_TIME = parseInt(process.env.DEFAULT_VIDEO_TIME_LIMIT || '900'); // 15 minutes
const VIEW_TIME_WINDOW = parseInt(process.env.VIDEO_TIME_LIMIT_WINDOW || '86400000'); // 24 hours in ms
const DEFAULT_MAX_DEVICES = parseInt(process.env.DEFAULT_MAX_DEVICES || '1'); // Default 1 device
const PREMIUM_MAX_DEVICES = parseInt(process.env.PREMIUM_MAX_DEVICES || '3'); // Premium users get 3 devices

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

/**
 * Periodic cleanup of stale sessions
 */
setInterval(() => {
    const now = Date.now();

    // Clean up stale sessions
    Array.from(activeSessions.entries()).forEach(([key, session]) => {
        if (now - session.lastActive > SESSION_TIMEOUT) {
            // Get user key
            const userKey = `${session.userId}_${session.eventId}`;

            // Update user view time before removing session
            const userLimit = userViewLimits.get(userKey);
            if (userLimit) {
                // Calculate view duration for this session
                const viewDuration = Math.floor((now - session.startTime) / 1000);
                userLimit.totalViewTime += viewDuration;
                userLimit.deviceCount = Math.max(0, userLimit.deviceCount - 1);
                userLimit.lastUpdated = now;
                userViewLimits.set(userKey, userLimit);
            }

            // Remove stale session
            activeSessions.delete(key);
        }
    });

    // Clean up stale user view limits
    Array.from(userViewLimits.entries()).forEach(([key, limit]) => {
        if (now - limit.lastUpdated > VIEW_TIME_WINDOW) {
            userViewLimits.delete(key);
        }
    });
}, HEARTBEAT_INTERVAL);

/**
 * Check if user has premium status
 */
async function checkPremiumStatus(userId: string): Promise<boolean> {
    try {
        const user = await User.findById(userId);
        return user?.subscription?.status === 'active' || user?.isPremium || false;
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
}

/**
 * Check event details to determine allowed viewers
 */
async function getEventAllowedViewers(eventId: string): Promise<number> {
    try {
        const event = await LiveStream.findById(eventId);
        return event?.allowedViewers || DEFAULT_MAX_DEVICES;
    } catch (error) {
        console.error('Error checking event allowed viewers:', error);
        return DEFAULT_MAX_DEVICES;
    }
}

/**
 * Get active viewers for a user's event
 */
function getActiveViewers(userId: string, eventId: string): string[] {
    const userKey = `${userId}_${eventId}`;
    const userLimit = userViewLimits.get(userKey);
    return userLimit?.activeViewers || [];
}

/**
 * Check if a user has a valid invitation to view this stream
 */
async function checkInvitation(invitationToken: string, userId: string, eventId: string): Promise<{ valid: boolean, inviterId?: string }> {
    try {
        const invitation = await mongoose.connection.collection('streamingInvitations').findOne({
            token: invitationToken,
            eventId: new mongoose.Types.ObjectId(eventId),
            status: 'pending',
            expiresAt: { $gt: new Date() }
        });

        if (!invitation) {
            return { valid: false };
        }

        // Check if the invitee matches
        const user = await User.findById(userId);
        if (!user || user.email !== invitation.inviteeEmail) {
            return { valid: false };
        }

        // Mark invitation as accepted
        await mongoose.connection.collection('streamingInvitations').updateOne(
            { token: invitationToken },
            { $set: { status: 'accepted', acceptedAt: new Date() } }
        );

        return { valid: true, inviterId: invitation.inviterId.toString() };
    } catch (error) {
        console.error('Error checking invitation:', error);
        return { valid: false };
    }
}

/**
 * Get current viewer count for an event
 */
function getCurrentViewerCount(eventId: string): number {
    // Count unique users (not devices) watching this event
    const uniqueUserIds = new Set<string>();

    Array.from(activeSessions.entries()).forEach(([key, session]) => {
        if (session.eventId === eventId) {
            uniqueUserIds.add(session.userId);
        }
    });

    return uniqueUserIds.size;
}

/**
 * Update current playback position for an event
 */
function updatePlaybackPosition(eventId: string, currentTime: number): void {
    const data = eventData.get(eventId) || {
        currentViewers: 0,
        playbackPosition: 0,
        lastUpdated: Date.now()
    };

    // Only update if the new time is greater than stored time
    // This prevents seeking backwards from affecting global playback
    if (currentTime > data.playbackPosition) {
        data.playbackPosition = currentTime;
    }

    data.lastUpdated = Date.now();
    eventData.set(eventId, data);

    // Update global cache for access from other routes
    global.sessionCache[`event_playback_${eventId}`] = data.playbackPosition;

    // Note: Real-time updates now handled through WebSockets
    // The WebSocket server checks this value
}

/**
 * Get current playback position for an event
 */
function getPlaybackPosition(eventId: string): number {
    const data = eventData.get(eventId);
    return data?.playbackPosition || 0;
}

/**
 * Update event data when sessions change
 */
function updateEventData(eventId: string): void {
    const viewerCount = getCurrentViewerCount(eventId);

    const data = eventData.get(eventId) || {
        currentViewers: 0,
        playbackPosition: 0,
        lastUpdated: Date.now()
    };

    data.currentViewers = viewerCount;
    data.lastUpdated = Date.now();

    eventData.set(eventId, data);

    // Update global cache for access from other routes
    global.sessionCache[`event_viewers_${eventId}`] = viewerCount;
}

export async function POST(request: NextRequest) {
    try {
        // Verify user authentication
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { eventId, action, deviceId, duration = 0, invitationToken, currentTime } = body;

        if (!eventId) {
            return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
        }

        if (!action || !['start', 'heartbeat', 'end'].includes(action)) {
            return NextResponse.json({ error: 'Valid action is required' }, { status: 400 });
        }

        if (!deviceId) {
            return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
        }

        // Connect to database
        await connectToDatabase();

        // Check if the live stream exists
        const liveStream = await LiveStream.findById(eventId);
        if (!liveStream) {
            return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
        }

        // Generate unique keys
        const sessionKey = `${deviceId}_${userId}_${eventId}`;
        const userKey = `${userId}_${eventId}`;
        const now = Date.now();

        // Check if this is a shared session with an invitation
        let isSharedViewer = false;
        let inviterId: string | undefined;

        if (invitationToken) {
            const invitationCheck = await checkInvitation(invitationToken, userId, eventId);
            isSharedViewer = invitationCheck.valid;
            inviterId = invitationCheck.inviterId;

            // If this is a valid invitation, use the inviter's user key instead
            if (isSharedViewer && inviterId) {
                // The sessions will be tracked under the inviter's allowance
                // But we'll still create a separate session for this viewer
            }
        }

        // If current time was provided, update playback position
        if (currentTime !== undefined && currentTime > 0) {
            updatePlaybackPosition(eventId, currentTime);
        }

        // Handle different session actions
        switch (action as SessionAction) {
            case 'start':
                // If this is a shared viewer, use the inviter's key for limits
                const effectiveUserKey = isSharedViewer && inviterId ? `${inviterId}_${eventId}` : userKey;

                // Get or initialize user view time limit
                let userLimit = userViewLimits.get(effectiveUserKey);
                if (!userLimit) {
                    // Check if user has premium status
                    const isPremium = await checkPremiumStatus(isSharedViewer && inviterId ? inviterId : userId);

                    // Get event-specific allowed viewers (or use default)
                    const eventAllowedViewers = await getEventAllowedViewers(eventId);
                    const maxDevices = isPremium ? Math.max(eventAllowedViewers, PREMIUM_MAX_DEVICES) : DEFAULT_MAX_DEVICES;

                    // Create new user limit
                    userLimit = {
                        totalViewTime: 0,
                        lastUpdated: now,
                        deviceCount: 0,
                        maxTimePerUser: DEFAULT_MAX_VIEW_TIME,
                        isPremium,
                        maxDevices,
                        activeViewers: []
                    };
                    userViewLimits.set(effectiveUserKey, userLimit);
                }

                // Skip time limit check for premium users
                if (!userLimit.isPremium) {
                    // Check if the user has reached the time limit
                    if (userLimit.totalViewTime >= userLimit.maxTimePerUser) {
                        return NextResponse.json({
                            error: 'View time limit reached',
                            message: 'You have reached your maximum viewing time for this content.',
                            totalViewTime: userLimit.totalViewTime,
                            maxTime: userLimit.maxTimePerUser,
                            timeRemaining: 0,
                            isPremium: false
                        }, { status: 403 });
                    }
                }

                // Check device count limit (except for shared viewers)
                if (!isSharedViewer && userLimit.deviceCount >= userLimit.maxDevices) {
                    return NextResponse.json({
                        error: 'Maximum devices reached',
                        message: `You can only watch on ${userLimit.maxDevices} device${userLimit.maxDevices > 1 ? 's' : ''} at a time.`,
                        deviceCount: userLimit.deviceCount,
                        maxDevices: userLimit.maxDevices
                    }, { status: 429 });
                }

                // Calculate time remaining (premium users get unlimited time)
                const timeRemaining = userLimit.isPremium
                    ? DEFAULT_MAX_VIEW_TIME // Just send a placeholder value
                    : Math.max(0, userLimit.maxTimePerUser - userLimit.totalViewTime);

                // Check if this device already has an active session
                const existingSession = activeSessions.get(sessionKey);
                if (existingSession) {
                    // If the same device is reconnecting, just update last active time
                    existingSession.lastActive = now;

                    return NextResponse.json({
                        success: true,
                        message: 'Session resumed',
                        sessionTimeout: SESSION_TIMEOUT,
                        heartbeatInterval: HEARTBEAT_INTERVAL,
                        timeRemaining: timeRemaining,
                        totalViewTime: userLimit.totalViewTime,
                        deviceCount: userLimit.deviceCount,
                        maxDevices: userLimit.maxDevices,
                        isPremium: userLimit.isPremium,
                        activeViewers: userLimit.activeViewers
                    });
                }

                // If this is a shared viewer with a valid invitation, add them to the active viewers list
                if (isSharedViewer && inviterId) {
                    // Get user email to add to active viewers
                    const viewerUser = await User.findById(userId);
                    if (viewerUser && viewerUser.email && !userLimit.activeViewers.includes(viewerUser.email)) {
                        userLimit.activeViewers.push(viewerUser.email);
                    }
                }

                // Create a new session
                activeSessions.set(sessionKey, {
                    userId,
                    eventId,
                    deviceId,
                    lastActive: now,
                    startTime: now,
                    viewDuration: 0,
                    isSharedViewer,
                    inviterId,
                    currentTime: currentTime || 0
                });

                // Increment device count for this user
                userLimit.deviceCount += 1;
                userLimit.lastUpdated = now;
                userViewLimits.set(effectiveUserKey, userLimit);

                // Update event data (current viewers count)
                updateEventData(eventId);

                // Get current playback position
                const playbackPosition = getPlaybackPosition(eventId);

                // Record session start in database
                await UserStreamActivity.create({
                    userId,
                    eventId: new mongoose.Types.ObjectId(eventId),
                    activityType: 'view',
                    timestamp: new Date(),
                    interactionData: {
                        action: 'start',
                        deviceId,
                        deviceInfo: request.headers.get('user-agent') || 'unknown',
                        timeRemaining,
                        isPremium: userLimit.isPremium,
                        isSharedViewer,
                        inviterId
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: 'Session started',
                    sessionTimeout: SESSION_TIMEOUT,
                    heartbeatInterval: HEARTBEAT_INTERVAL,
                    timeRemaining: timeRemaining,
                    totalViewTime: userLimit.totalViewTime,
                    deviceCount: userLimit.deviceCount,
                    maxDevices: userLimit.maxDevices,
                    maxTime: userLimit.maxTimePerUser,
                    isPremium: userLimit.isPremium,
                    activeViewers: userLimit.activeViewers,
                    currentViewers: getCurrentViewerCount(eventId),
                    playbackPosition
                });

            case 'heartbeat':
                // Check if session exists
                const session = activeSessions.get(sessionKey);
                if (!session) {
                    return NextResponse.json({
                        error: 'No active session found',
                        code: 'SESSION_EXPIRED'
                    }, { status: 400 });
                }

                // If this is a shared viewer, use the inviter's key for limits
                const heartbeatUserKey = session.isSharedViewer && session.inviterId
                    ? `${session.inviterId}_${eventId}`
                    : userKey;

                // Get user view limit
                const userViewLimit = userViewLimits.get(heartbeatUserKey);
                if (!userViewLimit) {
                    // Create new user limit if it doesn't exist
                    const isPremium = await checkPremiumStatus(session.isSharedViewer && session.inviterId ? session.inviterId : userId);
                    const eventAllowedViewers = await getEventAllowedViewers(eventId);
                    const maxDevices = isPremium ? Math.max(eventAllowedViewers, PREMIUM_MAX_DEVICES) : DEFAULT_MAX_DEVICES;

                    userViewLimits.set(heartbeatUserKey, {
                        totalViewTime: 0,
                        lastUpdated: now,
                        deviceCount: 1,
                        maxTimePerUser: DEFAULT_MAX_VIEW_TIME,
                        isPremium,
                        maxDevices,
                        activeViewers: []
                    });
                }

                // Calculate time viewed since last heartbeat
                const timeSinceLastActive = Math.floor((now - session.lastActive) / 1000);

                // Update session and user limit
                if (userViewLimit) {
                    // Skip time limit for premium users
                    if (!userViewLimit.isPremium) {
                        // Add viewing time
                        userViewLimit.totalViewTime += timeSinceLastActive;
                        userViewLimit.lastUpdated = now;

                        // Check if user has reached time limit
                        if (userViewLimit.totalViewTime >= userViewLimit.maxTimePerUser) {
                            // End the session
                            activeSessions.delete(sessionKey);
                            userViewLimit.deviceCount = Math.max(0, userViewLimit.deviceCount - 1);

                            return NextResponse.json({
                                success: false,
                                message: 'Time limit reached',
                                timeRemaining: 0,
                                sessionActive: false,
                                totalViewTime: userViewLimit.totalViewTime,
                                maxTime: userViewLimit.maxTimePerUser,
                                isPremium: false
                            });
                        }
                    }

                    // Calculate time remaining (premium users always have "unlimited" time)
                    const remainingTime = userViewLimit.isPremium
                        ? DEFAULT_MAX_VIEW_TIME  // Just send a placeholder value
                        : Math.max(0, userViewLimit.maxTimePerUser - userViewLimit.totalViewTime);

                    // Update last active time for session
                    session.lastActive = now;
                    session.viewDuration += timeSinceLastActive;

                    // Update current playback position if provided
                    if (currentTime !== undefined && currentTime > 0) {
                        session.currentTime = currentTime;
                    }

                    activeSessions.set(sessionKey, session);

                    // Get current playback position
                    const currentPlaybackPosition = getPlaybackPosition(eventId);

                    return NextResponse.json({
                        success: true,
                        message: 'Heartbeat received',
                        sessionActive: true,
                        timeRemaining: remainingTime,
                        totalViewTime: userViewLimit.totalViewTime,
                        deviceCount: userViewLimit.deviceCount,
                        maxDevices: userViewLimit.maxDevices,
                        isPremium: userViewLimit.isPremium,
                        activeViewers: userViewLimit.activeViewers,
                        currentViewers: getCurrentViewerCount(eventId),
                        playbackPosition: currentPlaybackPosition
                    });
                }

                // Update last active time
                session.lastActive = now;
                activeSessions.set(sessionKey, session);

                return NextResponse.json({
                    success: true,
                    message: 'Heartbeat received',
                    sessionActive: true
                });

            case 'end':
                // Get session if it exists
                const endingSession = activeSessions.get(sessionKey);
                if (!endingSession) {
                    return NextResponse.json({
                        success: true,
                        message: 'No active session found',
                        viewDuration: 0
                    });
                }

                // If this is a shared viewer, use the inviter's key for limits
                const endingUserKey = endingSession.isSharedViewer && endingSession.inviterId
                    ? `${endingSession.inviterId}_${eventId}`
                    : userKey;

                // Get user view limit
                const endingUserLimit = userViewLimits.get(endingUserKey);

                // Calculate view duration
                let viewDuration = duration;
                if (endingSession) {
                    // Calculate actual view duration based on session time
                    viewDuration = Math.floor((now - endingSession.startTime) / 1000);

                    // Update user view time if limit exists and not premium
                    if (endingUserLimit && !endingUserLimit.isPremium) {
                        endingUserLimit.totalViewTime += viewDuration;
                        endingUserLimit.deviceCount = Math.max(0, endingUserLimit.deviceCount - 1);
                        endingUserLimit.lastUpdated = now;

                        // If this is a shared viewer, remove from active viewers list
                        if (endingSession.isSharedViewer && endingUserLimit.activeViewers.length > 0) {
                            const viewerUser = await User.findById(userId);
                            if (viewerUser && viewerUser.email) {
                                endingUserLimit.activeViewers = endingUserLimit.activeViewers.filter(
                                    email => email !== viewerUser.email
                                );
                            }
                        }

                        userViewLimits.set(endingUserKey, endingUserLimit);
                    }
                }

                // Remove from active sessions
                activeSessions.delete(sessionKey);

                // Update event data after removing session
                updateEventData(eventId);

                // Record session end in database
                await UserStreamActivity.create({
                    userId,
                    eventId: new mongoose.Types.ObjectId(eventId),
                    activityType: 'view',
                    viewDuration,
                    timestamp: new Date(),
                    interactionData: {
                        action: 'end',
                        deviceId,
                        deviceInfo: request.headers.get('user-agent') || 'unknown',
                        totalViewTime: endingUserLimit?.totalViewTime || 0,
                        isPremium: endingUserLimit?.isPremium || false,
                        isSharedViewer: endingSession.isSharedViewer,
                        inviterId: endingSession.inviterId
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: 'Session ended',
                    viewDuration,
                    totalViewTime: endingUserLimit?.totalViewTime || 0,
                    timeRemaining: endingUserLimit && !endingUserLimit.isPremium
                        ? Math.max(0, endingUserLimit.maxTimePerUser - endingUserLimit.totalViewTime)
                        : DEFAULT_MAX_VIEW_TIME,
                    isPremium: endingUserLimit?.isPremium || false,
                    activeViewers: endingUserLimit?.activeViewers || [],
                    currentViewers: getCurrentViewerCount(eventId)
                });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error managing session:', error);
        return NextResponse.json({
            error: 'Failed to manage session',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 