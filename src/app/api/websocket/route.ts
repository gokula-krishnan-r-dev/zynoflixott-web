import { NextRequest } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

// Map to store connected clients by event ID
const connectedClients: Map<string, Map<string, WebSocket>> = new Map();
// Map to store current playback positions by event ID
const eventPlaybackPositions: Map<string, number> = new Map();

// Create HTTP server
const server = createServer();
const wss = new WebSocketServer({ noServer: true });

// Handle upgrade requests
server.on('upgrade', (request, socket, head) => {
    // Parse URL to get eventId
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const eventId = url.pathname.split('/').pop();

    if (!eventId) {
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, eventId);
    });
});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket, request: any, eventId: string) => {
    let deviceId: string | null = null;
    let userId: string | null = null;

    // Initialize event client map if doesn't exist
    if (!connectedClients.has(eventId)) {
        connectedClients.set(eventId, new Map());
    }

    const eventClients = connectedClients.get(eventId)!;

    // Handle messages from clients
    ws.on('message', (message: Buffer | string) => {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case 'join':
                    // Register this client
                    deviceId = data.deviceId;
                    userId = data.userId;

                    if (deviceId && userId) {
                        const clientKey = `${userId}_${deviceId}`;
                        eventClients.set(clientKey, ws);

                        // Send current viewer count to all clients
                        broadcastViewerCount(eventId);

                        // Send current playback position to the new client
                        const currentPosition = eventPlaybackPositions.get(eventId) || 0;
                        ws.send(JSON.stringify({
                            type: 'playbackSync',
                            position: currentPosition,
                            deviceId: 'server'
                        }));
                    }
                    break;

                case 'leave':
                    if (deviceId && userId) {
                        const clientKey = `${userId}_${deviceId}`;
                        eventClients.delete(clientKey);
                        broadcastViewerCount(eventId);
                    }
                    break;

                case 'playbackSync':
                    // Update playback position
                    if (data.position !== undefined) {
                        eventPlaybackPositions.set(eventId, data.position);

                        // Broadcast to all clients except sender
                        broadcastPlaybackPosition(eventId, data.position, data.deviceId);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        if (deviceId && userId) {
            const clientKey = `${userId}_${deviceId}`;
            eventClients.delete(clientKey);
            broadcastViewerCount(eventId);
        }

        // If no clients left for this event, clean up
        if (eventClients.size === 0) {
            connectedClients.delete(eventId);
            eventPlaybackPositions.delete(eventId);
        }
    });
});

// Function to broadcast viewer count
function broadcastViewerCount(eventId: string) {
    const eventClients = connectedClients.get(eventId);
    if (!eventClients) return;

    // Count unique users (not devices)
    const uniqueUsers = new Set<string>();
    Array.from(eventClients.keys()).forEach(clientKey => {
        const userId = clientKey.split('_')[0];
        uniqueUsers.add(userId);
    });

    const count = uniqueUsers.size;

    // Broadcast to all clients
    const message = JSON.stringify({
        type: 'viewerCount',
        count
    });

    Array.from(eventClients.values()).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Function to broadcast playback position
function broadcastPlaybackPosition(eventId: string, position: number, senderDeviceId: string) {
    const eventClients = connectedClients.get(eventId);
    if (!eventClients) return;

    const message = JSON.stringify({
        type: 'playbackSync',
        position,
        deviceId: senderDeviceId
    });

    Array.from(eventClients.values()).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start server if not in production (in production this would be a separate service)
if (process.env.NODE_ENV !== 'production') {
    server.listen(3001, () => {
        console.log('WebSocket server running on port 3001');
    });
}

export async function GET(request: NextRequest) {
    // This endpoint doesn't respond to HTTP requests
    return new Response('WebSocket server is running', { status: 200 });
} 