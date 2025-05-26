# Live Streaming with Real-Time Synchronization

This document explains the implementation of real-time synchronized video playback and viewer tracking for the Zynoflix OTT platform.

## Architecture Overview

The synchronized streaming feature uses a hybrid approach:
1. REST API endpoints for session management and authentication
2. WebSocket connections for real-time playback position synchronization and viewer counts

### Key Components

1. **Watch Page** (`src/app/watch/[id]/page.tsx`)
   - Video player with synchronized playback
   - Real-time viewer counter with WebSocket updates
   - Invitation system for multi-user viewing

2. **WebSocket Hook** (`src/hooks/useWebSocket.ts`)
   - Manages WebSocket connections with automatic reconnection
   - Handles message sending/receiving

3. **WebSocket Server** (`src/app/api/websocket/route.ts`)
   - Manages connected clients by event ID
   - Broadcasts playback positions and viewer counts
   - Synchronizes new viewers to current playback position

4. **Session API** (`src/app/api/live-stream/session/route.ts`)
   - Tracks viewing sessions and limits
   - Maintains playback positions as fallback
   - Handles authentication and authorization

## Implementation Details

### Client-Side Synchronization

When a user joins a stream:
1. The client calls the Session API to start a session and get the current playback position
2. The client connects to the WebSocket server and joins the event room
3. The WebSocket server sends the current viewer count and playback position
4. The video player seeks to the current position and starts playing

During playback:
1. The client regularly sends its current playback position via WebSocket
2. When a user seeks to a new position, it's immediately broadcasted to all viewers
3. Other viewers receive the update and seek to match if the difference is significant (>3 seconds)
4. Viewer counts are updated in real-time as users join/leave

### Multi-User Viewing

Premium users can invite others to watch together:
1. The host sends an invitation via the invitation API
2. When the invitee joins, they are synchronized to the host's playback position
3. All synchronized viewers see real-time viewer count updates
4. The system tracks which devices are watching under which user account

### Server-Side Management

The server maintains:
1. A map of connected clients by event ID
2. Current playback positions for each event
3. Active viewer information for each stream
4. Session timeouts and reconnection logic

## Configuration

To enable WebSocket functionality, set these environment variables:

```
NEXT_PUBLIC_WS_URL=ws://localhost:3001  # For development
NEXT_PUBLIC_WS_URL=wss://your-domain.com/api/websocket  # For production
```

## Usage Example

```typescript
// In a React component
const { socketMessage, sendSocketMessage, connectionStatus } = useWebSocket(
  `${process.env.NEXT_PUBLIC_WS_URL}/api/live-stream/${eventId}`
);

// Send a playback update
sendSocketMessage(JSON.stringify({
  type: 'playbackSync',
  position: videoElement.currentTime,
  eventId: eventId,
  deviceId: myDeviceId
}));

// Listen for updates
useEffect(() => {
  if (socketMessage) {
    const data = JSON.parse(socketMessage);
    if (data.type === 'playbackSync' && !isSeeking) {
      videoElement.currentTime = data.position;
    }
  }
}, [socketMessage]);
```

## Production Considerations

For production deployment:
1. Use a dedicated WebSocket server or service (AWS WebSocket API, Socket.io, etc.)
2. Implement proper authentication for WebSocket connections
3. Consider Redis for state management across multiple server instances
4. Add rate limiting to prevent abuse
5. Implement monitoring and logging for connection issues

## Limitations and Future Improvements

1. The current implementation relies on client honesty for playback positions
2. No buffering detection to handle slower connections
3. Could add chat functionality using the same WebSocket infrastructure
4. Consider implementing server-side control for critical playback events 