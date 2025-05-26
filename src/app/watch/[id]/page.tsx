"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    ArrowLeft, Calendar, Clock, Film, Share2,
    Users, Volume2, VolumeX,
    Maximize, UserPlus, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/useWebSocket";

type EventDetails = {
    _id: string;
    movieTitle: string;
    movieSubtitles?: string;
    movieDescription?: string;
    movieCategory: string;
    movieLanguage: string;
    streamingDate: string;
    streamingTime: string;
    status: string;
    movieVideo?: string;
    ticketCost: number;
    producerName?: string;
    directorName?: string;
    heroName?: string;
    heroinName?: string;
    movieCertificate?: string;
    movieLength?: number;
    allowedViewers?: number;
};

type TicketDetails = {
    ticketId: string;
    orderId: string;
    purchaseDate: string;
    quantity: number;
    status: string;
};

export default function WatchPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticketId = searchParams.get("ticket");
    const videoRef = useRef<HTMLVideoElement>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [tickets, setTickets] = useState<TicketDetails[]>([]);
    const [isLive, setIsLive] = useState(false);
    const [isUpcoming, setIsUpcoming] = useState(false);
    const [streamStartCountdown, setStreamStartCountdown] = useState<string | null>(null);
    const [muted, setMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);
    const [maxViewersReached, setMaxViewersReached] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [totalViewTime, setTotalViewTime] = useState(0);
    const [deviceCount, setDeviceCount] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [showTimeLimit, setShowTimeLimit] = useState(false);
    const [timeLimitReached, setTimeLimitReached] = useState(false);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const deviceIdRef = useRef<string>('');
    const timeRemainingRef = useRef<HTMLDivElement>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [maxDevices, setMaxDevices] = useState(1);
    const [activeViewers, setActiveViewers] = useState<string[]>([]);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const [currentViewers, setCurrentViewers] = useState(0);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const lastSyncTimeRef = useRef<number>(0);
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // WebSocket connection
    const { socketMessage, sendSocketMessage, connectionStatus } = useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/api/live-stream/${params.id}`
    );

    // Listen for socket messages
    useEffect(() => {
        if (socketMessage) {
            try {
                const data = JSON.parse(socketMessage);

                // Handle different message types
                switch (data.type) {
                    case 'viewerCount':
                        setCurrentViewers(data.count);
                        break;
                    case 'playbackSync':
                        // Only sync if we're not the one who sent this update
                        if (data.deviceId !== deviceIdRef.current && !isSeeking && videoRef.current) {
                            const currentTime = videoRef.current.currentTime;
                            const serverTime = data.position;

                            // Only sync if difference is significant (> 3 seconds)
                            if (Math.abs(currentTime - serverTime) > 3) {
                                videoRef.current.currentTime = serverTime;
                            }
                        }
                        break;
                    case 'activeViewers':
                        setActiveViewers(data.viewers);
                        break;
                }
            } catch (error) {
                console.error('Error parsing socket message:', error);
            }
        }
    }, [socketMessage]);

    // Update socket connection status
    useEffect(() => {
        setSocketConnected(connectionStatus === 'connected');
    }, [connectionStatus]);

    // Generate or retrieve device ID
    useEffect(() => {
        // Try to get existing device ID from localStorage
        let deviceId = localStorage.getItem('deviceId');

        // If not found, generate a new one
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }

        deviceIdRef.current = deviceId;
    }, []);

    useEffect(() => {
        // Get user ID from localStorage or cookies
        const userId = localStorage.getItem('userId') || '';
        if (!userId || !params.id) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

        // Check if user has access to this stream
        axios.get(`/api/live-stream/${params.id}/check-access`, {
            headers: {
                userId: userId
            }
        })
            .then(response => {
                setHasAccess(response.data.hasAccess);
                setIsCreator(response.data.isCreator || false);
                setEvent(response.data.event);
                if (response.data.tickets) {
                    setTickets(response.data.tickets);
                }

                // Set maximum allowed devices
                if (response.data.event?.allowedViewers) {
                    setMaxDevices(response.data.event.allowedViewers);
                } else if (response.data.isPremium) {
                    setMaxDevices(3); // Premium users get 3 devices by default
                } else {
                    setMaxDevices(1); // Regular users get 1 device
                }

                // Set active viewers if available
                if (response.data.activeViewers) {
                    setActiveViewers(response.data.activeViewers);
                }

                // Check if we have current viewers count
                if (response.data.currentViewers !== undefined) {
                    setCurrentViewers(response.data.currentViewers);
                }

                // Get current playback position if available
                if (response.data.playbackPosition !== undefined) {
                    setPlaybackPosition(response.data.playbackPosition);
                }

                setLoading(false);

                // If user has access, check if the event is live or upcoming
                if (response.data.hasAccess && response.data.event) {
                    const eventDate = new Date(
                        `${response.data.event.streamingDate}T${response.data.event.streamingTime}`
                    );
                    const now = new Date();

                    setIsLive(response.data.event.status === 'live');
                    setIsUpcoming(eventDate > now);

                    // Set up countdown if event is upcoming
                    if (eventDate > now) {
                        const intervalId = setInterval(() => {
                            const now = new Date();
                            const diff = eventDate.getTime() - now.getTime();

                            if (diff <= 0) {
                                clearInterval(intervalId);
                                setIsUpcoming(false);
                                setIsLive(true);
                                return;
                            }

                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                            setStreamStartCountdown(
                                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                            );
                        }, 1000);

                        return () => clearInterval(intervalId);
                    }
                }
            })
            .catch(err => {
                console.error("Error checking access:", err);
                setError(err.response?.data?.error || "Failed to verify access");
                setLoading(false);
            });
    }, [params.id]);

    // Regularly sync playback position over WebSocket
    useEffect(() => {
        if (isLive && videoRef.current && socketConnected && sessionActive) {
            const sendPlaybackPosition = () => {
                if (!videoRef.current || isSeeking) return;

                const currentTime = videoRef.current.currentTime;
                // Avoid too frequent updates - only send if position changed significantly
                if (Math.abs(currentTime - lastSyncTimeRef.current) > 1) {
                    sendSocketMessage(JSON.stringify({
                        type: 'playbackSync',
                        position: currentTime,
                        eventId: params.id,
                        deviceId: deviceIdRef.current,
                        userId: localStorage.getItem('userId') || ''
                    }));
                    lastSyncTimeRef.current = currentTime;
                }
            };

            // Send initial position
            sendPlaybackPosition();

            // Setup interval to regularly send position
            syncIntervalRef.current = setInterval(sendPlaybackPosition, 5000);

            return () => {
                if (syncIntervalRef.current) {
                    clearInterval(syncIntervalRef.current);
                }
            };
        }
    }, [isLive, socketConnected, sessionActive, isSeeking, params.id, sendSocketMessage]);

    // Start session management with WebSocket support
    const startSession = useCallback(async () => {
        if (!event || !isLive || !deviceIdRef.current) return;

        try {
            const userId = localStorage.getItem('userId') || '';
            if (!userId) return;

            const response = await axios.post('/api/live-stream/session', {
                eventId: event._id,
                action: 'start',
                deviceId: deviceIdRef.current
            }, {
                headers: { userId }
            });

            if (response.data.success) {
                setSessionActive(true);

                // Set time limit information
                if (response.data.timeRemaining !== undefined) {
                    setTimeRemaining(response.data.timeRemaining);
                    setTotalViewTime(response.data.totalViewTime || 0);
                    setDeviceCount(response.data.deviceCount || 1);
                    setMaxTime(response.data.maxTime || 0);
                    setShowTimeLimit(!response.data.isPremium);
                    setIsPremium(response.data.isPremium || false);
                }

                // Update current viewers count
                if (response.data.currentViewers !== undefined) {
                    setCurrentViewers(response.data.currentViewers);
                }

                // Join WebSocket room
                if (socketConnected) {
                    sendSocketMessage(JSON.stringify({
                        type: 'join',
                        eventId: event._id,
                        deviceId: deviceIdRef.current,
                        userId
                    }));
                }

                // Get synchronized playback position
                if (response.data.playbackPosition !== undefined) {
                    setPlaybackPosition(response.data.playbackPosition);
                    lastSyncTimeRef.current = response.data.playbackPosition;

                    // If we have a video element, sync playback position
                    if (videoRef.current && !isInitialSyncDone) {
                        videoRef.current.currentTime = response.data.playbackPosition;
                        setIsInitialSyncDone(true);
                    }
                }

                // Set up heartbeat interval
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                }

                const interval = response.data.heartbeatInterval || 30000;
                heartbeatIntervalRef.current = setInterval(async () => {
                    try {
                        await sendHeartbeatRef.current?.();
                    } catch (error) {
                        console.error('Heartbeat error:', error);
                    }
                }, interval);

                // If we have a video element, start playing
                if (videoRef.current) {
                    videoRef.current.play().catch(error => {
                        console.error('Error playing video:', error);
                    });
                }
            }
        } catch (error: any) {
            console.error('Session start error:', error);

            // Handle time limit reached error
            if (error.response?.status === 403) {
                setTimeLimitReached(true);
                setError(error.response.data.message || "View time limit reached");

                // Set time limit info from error response
                if (error.response.data.totalViewTime) {
                    setTotalViewTime(error.response.data.totalViewTime);
                }
                if (error.response.data.maxTime) {
                    setMaxTime(error.response.data.maxTime);
                }
            } else if (error.response?.status === 429) {
                setMaxViewersReached(true);
                setError(error.response.data.message || "Maximum viewers reached");
            }
        }
    }, [event, isLive, isInitialSyncDone, socketConnected, sendSocketMessage]);

    // Send heartbeat with WebSocket support
    const sendHeartbeatRef = useRef<() => Promise<void>>();

    const sendHeartbeat = async () => {
        if (!event || !isLive || !deviceIdRef.current) return;

        try {
            const userId = localStorage.getItem('userId') || '';
            if (!userId) return;

            // Get current playback position
            let currentTime = 0;
            if (videoRef.current && !isSeeking) {
                currentTime = videoRef.current.currentTime;

                // Also send position via WebSocket if it changed significantly
                if (socketConnected && Math.abs(currentTime - lastSyncTimeRef.current) > 2) {
                    sendSocketMessage(JSON.stringify({
                        type: 'playbackSync',
                        position: currentTime,
                        eventId: event._id,
                        deviceId: deviceIdRef.current,
                        userId
                    }));
                    lastSyncTimeRef.current = currentTime;
                }
            }

            const response = await axios.post('/api/live-stream/session', {
                eventId: event._id,
                action: 'heartbeat',
                deviceId: deviceIdRef.current,
                currentTime
            }, {
                headers: { userId }
            });

            // Update time limit information if available
            if (response.data.timeRemaining !== undefined) {
                setTimeRemaining(response.data.timeRemaining);
                setTotalViewTime(response.data.totalViewTime || 0);
                setDeviceCount(response.data.deviceCount || 1);
                setIsPremium(response.data.isPremium || false);
            }

            // Update active viewers if available
            if (response.data.activeViewers) {
                setActiveViewers(response.data.activeViewers);
            }

            // Update current viewers count
            if (response.data.currentViewers !== undefined) {
                setCurrentViewers(response.data.currentViewers);
            }

            // Check if we need to sync playback position
            if (response.data.playbackPosition !== undefined) {
                const serverPosition = response.data.playbackPosition;

                // Only sync if the difference is significant (more than 5 seconds)
                // And if we're not currently seeking in the video
                if (videoRef.current && !isSeeking && Math.abs(videoRef.current.currentTime - serverPosition) > 5) {
                    // Set video time to match server
                    videoRef.current.currentTime = serverPosition;
                }
            }

            // Handle session expiry or time limit reached
            if (!response.data.success || !response.data.sessionActive) {
                clearInterval(heartbeatIntervalRef.current!);
                heartbeatIntervalRef.current = null;
                setSessionActive(false);

                // Check if time limit was reached
                if (response.data.message === 'Time limit reached') {
                    setTimeLimitReached(true);
                    setError("You have reached your viewing time limit for this content.");
                    return;
                }

                // Try to restart session if not time limit related
                startSession();
            }
        } catch (error: any) {
            console.error('Heartbeat error:', error);

            // If session expired or not found
            if (error.response?.data?.code === 'SESSION_EXPIRED') {
                clearInterval(heartbeatIntervalRef.current!);
                heartbeatIntervalRef.current = null;
                setSessionActive(false);

                // Try to restart session
                startSession();
            }
        }
    };

    // Update sendHeartbeatRef when the function changes
    useEffect(() => {
        sendHeartbeatRef.current = sendHeartbeat;
    }, [sendHeartbeat, event, isLive, startSession]);

    // End session with WebSocket cleanup
    const endSession = async () => {
        if (!event || !deviceIdRef.current) return;

        try {
            const userId = localStorage.getItem('userId') || '';
            if (!userId) return;

            // Calculate approximate view duration
            let duration = 0;
            if (videoRef.current) {
                duration = Math.floor(videoRef.current.currentTime);
            }

            await axios.post('/api/live-stream/session', {
                eventId: event._id,
                action: 'end',
                deviceId: deviceIdRef.current,
                duration
            }, {
                headers: { userId }
            });

            // Clear heartbeat interval
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }

            setSessionActive(false);

            // Leave WebSocket room
            if (socketConnected) {
                sendSocketMessage(JSON.stringify({
                    type: 'leave',
                    eventId: event._id,
                    deviceId: deviceIdRef.current,
                    userId
                }));
            }
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    // Store endSession in ref to avoid dependency issues with useEffect cleanup
    const endSessionRef = useRef<() => Promise<void>>();

    // Update the ref when endSession changes
    useEffect(() => {
        endSessionRef.current = endSession;
    }, [endSession]);

    // Clean up session on unmount
    useEffect(() => {
        return () => {
            // End session when component unmounts
            endSessionRef.current?.();

            // Clear any intervals
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
        };
    }, []);

    // Start session when video plays
    useEffect(() => {
        if (videoRef.current && event && isLive) {
            const videoElement = videoRef.current;

            const handlePlay = () => {
                if (!sessionActive) {
                    startSession();
                }
            };

            videoElement.addEventListener('play', handlePlay);

            return () => {
                videoElement.removeEventListener('play', handlePlay);
            };
        }
    }, [event, isLive, sessionActive, startSession]);

    // Check if stream is live periodically when in upcoming state
    useEffect(() => {
        if (isUpcoming && event && !isLive) {
            const checkLiveStatus = () => {
                const userId = localStorage.getItem('userId') || '';
                if (!userId) return;

                axios.get(`/api/live-stream/${params.id}/check-access`, {
                    headers: { userId }
                })
                    .then(response => {
                        if (response.data.event?.status === 'live') {
                            setIsLive(true);
                            setIsUpcoming(false);
                            toast.success(`"${event.movieTitle}" is now live!`);
                        }
                    })
                    .catch(err => console.error("Error checking live status:", err));
            };

            // Check every 30 seconds
            const intervalId = setInterval(checkLiveStatus, 30000);
            return () => clearInterval(intervalId);
        }
    }, [isUpcoming, isLive, event, params.id]);

    // Add a countdown effect for the time remaining
    useEffect(() => {
        if (timeRemaining === null || !isLive || !sessionActive) return;

        // Don't start countdown if time is already up
        if (timeRemaining <= 0) {
            setTimeLimitReached(true);
            setError("You have reached your viewing time limit for this content.");
            return;
        }

        // Update every second
        const countdownInterval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 0) {
                    clearInterval(countdownInterval);
                    setTimeLimitReached(true);
                    setError("You have reached your viewing time limit for this content.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [timeRemaining, isLive, sessionActive]);

    // Format time function for displaying the countdown
    const formatTimeDisplay = (seconds: number) => {
        if (seconds <= 0) return "00:00:00";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "EEEE, MMMM d, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
        }
    };

    const toggleFullscreen = () => {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) return;

        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const goBack = () => {
        // End session before navigating away
        endSessionRef.current?.();
        router.back();
    };

    // Handle inviting another user to watch
    const inviteUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inviteEmail || !event) return;

        setInviteLoading(true);

        try {
            const userId = localStorage.getItem('userId') || '';

            const response = await axios.post('/api/live-stream/invite', {
                eventId: event._id,
                email: inviteEmail,
            }, {
                headers: { userId }
            });

            if (response.data.success) {
                toast.success(`Invitation sent to ${inviteEmail}`);
                setInviteEmail('');
                setShowInviteDialog(false);
            }
        } catch (error: any) {
            console.error('Error inviting user:', error);
            toast.error(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setInviteLoading(false);
        }
    };

    const shareEvent = () => {
        if (!event) return;

        if (navigator.share) {
            navigator.share({
                title: event.movieTitle,
                text: `Check out this amazing event: ${event.movieTitle}`,
                url: `${window.location.origin}/live-stream/${event._id}${ticketId ? `?ticket=${ticketId}` : ''}`
            })
                .then(() => toast.success("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/live-stream/${event._id}${ticketId ? `?ticket=${ticketId}` : ''}`);
            toast.success("Link copied to clipboard");
        }
    };

    // Enhanced video seeking handlers
    const handleSeeking = () => {
        setIsSeeking(true);
    };

    const handleSeeked = () => {
        setIsSeeking(false);
        // When user finishes seeking, update everyone via websocket
        if (videoRef.current && socketConnected) {
            const newPosition = videoRef.current.currentTime;
            sendSocketMessage(JSON.stringify({
                type: 'playbackSync',
                position: newPosition,
                eventId: params.id,
                deviceId: deviceIdRef.current,
                userId: localStorage.getItem('userId') || ''
            }));
            lastSyncTimeRef.current = newPosition;
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <div className="w-full h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Skeleton className="h-[60vh] w-full max-w-4xl mx-auto bg-gray-800" />
                        <div className="max-w-4xl mx-auto p-4">
                            <Skeleton className="h-8 w-3/4 my-2 bg-gray-800" />
                            <Skeleton className="h-4 w-1/2 mb-4 bg-gray-800" />
                            <div className="flex space-x-2 my-4">
                                <Skeleton className="h-8 w-20 rounded-full bg-gray-800" />
                                <Skeleton className="h-8 w-20 rounded-full bg-gray-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render error or access denied
    if (error || !hasAccess || maxViewersReached || timeLimitReached) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-lg mx-auto text-center bg-gray-800/50 rounded-xl p-8 backdrop-blur-md border border-gray-700">
                    <div className="text-5xl mb-6">
                        {maxViewersReached ? '👥' : timeLimitReached ? '⏱️' : '🎫'}
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        {maxViewersReached
                            ? 'Concurrent Limit Reached'
                            : timeLimitReached
                                ? 'Viewing Time Limit Reached'
                                : 'Access Denied'}
                    </h1>
                    <p className="text-gray-300 mb-6">
                        {error || (maxViewersReached
                            ? "This content can only be viewed on one device at a time."
                            : timeLimitReached
                                ? `You've watched this content for ${formatTimeDisplay(totalViewTime)} out of the allowed ${formatTimeDisplay(maxTime)}.`
                                : "You don't have a valid ticket for this event.")}
                    </p>

                    {timeLimitReached && (
                        <>
                            <div className="mb-6 text-center">
                                <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-700"
                                        style={{ width: `${Math.min(100, (totalViewTime / maxTime) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {Math.floor((totalViewTime / maxTime) * 100)}% of allowed time used
                                </p>
                            </div>

                            {!isPremium && (
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
                                    <p className="text-gray-300 mb-4">
                                        Get unlimited viewing time and more benefits with a premium subscription.
                                    </p>
                                    <Button
                                        onClick={() => router.push('/subscription')}
                                        className="bg-gradient-to-r from-amber-500 to-amber-700 text-white"
                                    >
                                        Upgrade Now
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex flex-col gap-3">
                        {!maxViewersReached && !timeLimitReached && (
                            <Button
                                onClick={() => router.push(`/live-streams/${params.id}`)}
                                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                            >
                                Get Tickets
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-700 text-white"
                            onClick={goBack}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Render event not found
    if (!event) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
                    <Button onClick={goBack}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={goBack} className="text-white">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-lg font-semibold truncate">{event.movieTitle}</h1>
                    <div className="flex items-center gap-2">
                        {currentViewers > 0 && (
                            <Badge variant="outline" className="bg-gray-800/70 border-gray-600 flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {currentViewers} {socketConnected && <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1"></span>}
                            </Badge>
                        )}
                        {isPremium && deviceCount < maxDevices && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white"
                                            onClick={() => setShowInviteDialog(true)}
                                        >
                                            <UserPlus className="w-5 h-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Invite someone to watch</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <Button variant="ghost" onClick={shareEvent} className="text-white">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Invite Dialog */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent className="bg-gray-900 text-white border-gray-800">
                    <DialogHeader>
                        <DialogTitle>Invite Someone to Watch</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={inviteUser} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-sm text-gray-400">Email Address</label>
                            <Input
                                id="email"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="friend@example.com"
                                className="bg-gray-800 border-gray-700 text-white"
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-400">
                                {deviceCount} of {maxDevices} devices in use
                            </p>
                            <Button
                                type="submit"
                                disabled={inviteLoading || deviceCount >= maxDevices}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {inviteLoading ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Main Content */}
            <div className="flex-grow">
                {/* Video Container */}
                <div id="video-container" className="relative w-full bg-black">
                    {isLive ? (
                        <div className="relative w-full h-[calc(100vh-12rem)]">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain bg-black"
                                autoPlay
                                muted={muted}
                                controls={false}
                                playsInline
                                src={event.movieVideo}
                                onPlay={() => {
                                    if (!sessionActive) startSession();
                                }}
                                onPause={() => {
                                    // No need to end session on pause
                                }}
                                onSeeking={handleSeeking}
                                onSeeked={handleSeeked}
                                onTimeUpdate={() => {
                                    // Optionally handle time updates
                                }}
                            ></video>

                            {/* Video Controls Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                                        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>

                                    <Badge variant="secondary" className="bg-red-600 animate-pulse">
                                        LIVE
                                    </Badge>

                                    {deviceCount > 1 && (
                                        <Badge variant="outline" className="bg-indigo-900/60 border-indigo-500 text-xs">
                                            <Users className="h-3 w-3 mr-1" /> {deviceCount} devices
                                        </Badge>
                                    )}

                                    {currentViewers > 0 && (
                                        <Badge variant="outline" className="bg-gray-800/70 border-gray-600 text-xs">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {currentViewers} watching
                                            {socketConnected && <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1"></span>}
                                        </Badge>
                                    )}
                                </div>

                                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                                    <Maximize className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Add time limit display to the video controls overlay */}
                            {showTimeLimit && !isPremium && (
                                <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black to-transparent flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            ref={timeRemainingRef}
                                            className={`font-mono text-sm px-2 py-1 rounded ${timeRemaining !== null && timeRemaining < 300 ? 'bg-red-700/80 animate-pulse' : 'bg-gray-800/80'
                                                }`}
                                        >
                                            {timeRemaining !== null ? formatTimeDisplay(timeRemaining) : "--:--:--"}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isPremium && (
                                <div className="absolute top-0 right-0 p-2">
                                    <Badge variant="outline" className="bg-gradient-to-r from-amber-500 to-amber-700 border-amber-400 text-xs">
                                        PREMIUM
                                    </Badge>
                                </div>
                            )}
                        </div>
                    ) : isUpcoming ? (
                        <div className="w-full h-[calc(100vh-12rem)] flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/20 to-black text-center p-4">
                            <Film className="h-16 w-16 text-purple-400 mb-6" />
                            <h2 className="text-3xl font-bold mb-2">{event.movieTitle}</h2>
                            {event.movieSubtitles && (
                                <p className="text-gray-400 mb-6 italic">{event.movieSubtitles}</p>
                            )}

                            <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md">
                                <h3 className="text-xl font-semibold mb-4">Event Starts In</h3>
                                {streamStartCountdown && (
                                    <div className="text-4xl font-bold text-purple-400 font-mono">
                                        {streamStartCountdown}
                                    </div>
                                )}
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="text-purple-400 h-5 w-5" />
                                        <span>{formatDate(event.streamingDate)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="text-purple-400 h-5 w-5" />
                                        <span>{event.streamingTime}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-300">
                                The stream will start automatically when the event goes live. You can keep this page open.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-[calc(100vh-12rem)] flex items-center justify-center bg-gray-900 text-center">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Event has ended</h2>
                                <p className="text-gray-300 mb-6">This live stream is no longer available.</p>
                                <Button onClick={() => router.push('/live-streams')} className="bg-purple-600 hover:bg-purple-700">
                                    Explore Other Events
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="p-4 bg-gray-900">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-purple-900/70">{event.movieCategory}</Badge>
                            <Badge className="bg-blue-900/70">{event.movieLanguage}</Badge>
                            {event.movieCertificate && (
                                <Badge className="bg-gray-700">{event.movieCertificate}</Badge>
                            )}
                            {event.movieLength && (
                                <Badge className="bg-gray-700">{event.movieLength} min</Badge>
                            )}
                            {currentViewers > 0 && (
                                <Badge className="bg-gray-800">
                                    <Eye className="h-3 w-3 mr-1" /> {currentViewers} watching
                                </Badge>
                            )}
                            {isPremium && activeViewers.length > 0 && (
                                <Badge className="bg-indigo-900/70">
                                    <Users className="h-3 w-3 mr-1" /> Shared with {activeViewers.length} viewer{activeViewers.length > 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-1">{event.movieTitle}</h2>
                        {event.movieSubtitles && (
                            <p className="text-gray-400 mb-4 italic">{event.movieSubtitles}</p>
                        )}

                        {event.movieDescription && (
                            <p className="text-gray-300 my-4">{event.movieDescription}</p>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            {event.producerName && (
                                <div>
                                    <p className="text-gray-400 text-sm">Producer</p>
                                    <p className="font-medium">{event.producerName}</p>
                                </div>
                            )}

                            {event.directorName && (
                                <div>
                                    <p className="text-gray-400 text-sm">Director</p>
                                    <p className="font-medium">{event.directorName}</p>
                                </div>
                            )}

                            {event.heroName && (
                                <div>
                                    <p className="text-gray-400 text-sm">Hero</p>
                                    <p className="font-medium">{event.heroName}</p>
                                </div>
                            )}

                            {event.heroinName && (
                                <div>
                                    <p className="text-gray-400 text-sm">Heroine</p>
                                    <p className="font-medium">{event.heroinName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}