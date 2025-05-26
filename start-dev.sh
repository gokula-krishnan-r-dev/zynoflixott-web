#!/bin/bash

# Start WebSocket server in background
echo "Starting WebSocket server..."
node -e "
const { WebSocketServer } = require('ws');
const { createServer } = require('http');

const wss = new WebSocketServer({ port: 3001 });

console.log('WebSocket server running on port 3001');

// Map to store connected clients by event ID
const connectedClients = new Map();
// Map to store current playback positions by event ID
const eventPlaybackPositions = new Map();

wss.on('connection', (ws, req) => {
  // Parse URL to get eventId
  const url = new URL(req.url, 'http://localhost');
  const eventId = url.pathname.split('/').pop();
  
  if (!eventId) {
    ws.close();
    return;
  }
  
  let deviceId = null;
  let userId = null;

  // Initialize event client map if doesn't exist
  if (!connectedClients.has(eventId)) {
    connectedClients.set(eventId, new Map());
  }

  const eventClients = connectedClients.get(eventId);

  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'join':
          // Register this client
          deviceId = data.deviceId;
          userId = data.userId;
          
          if (deviceId && userId) {
            const clientKey = \`\${userId}_\${deviceId}\`;
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

            console.log(\`Client \${deviceId} joined stream \${eventId}\`);
          }
          break;
          
        case 'leave':
          if (deviceId && userId) {
            const clientKey = \`\${userId}_\${deviceId}\`;
            eventClients.delete(clientKey);
            broadcastViewerCount(eventId);
            console.log(\`Client \${deviceId} left stream \${eventId}\`);
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
      const clientKey = \`\${userId}_\${deviceId}\`;
      eventClients.delete(clientKey);
      broadcastViewerCount(eventId);
      console.log(\`Client \${deviceId} disconnected from stream \${eventId}\`);
    }
    
    // If no clients left for this event, clean up
    if (eventClients.size === 0) {
      connectedClients.delete(eventId);
      eventPlaybackPositions.delete(eventId);
      console.log(\`No clients left for stream \${eventId}, cleaning up\`);
    }
  });
});

// Function to broadcast viewer count
function broadcastViewerCount(eventId) {
  const eventClients = connectedClients.get(eventId);
  if (!eventClients) return;
  
  // Count unique users (not devices)
  const uniqueUsers = new Set();
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

  console.log(\`Broadcasting viewer count \${count} for stream \${eventId}\`);
}

// Function to broadcast playback position
function broadcastPlaybackPosition(eventId, position, senderDeviceId) {
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
" &

# Wait a moment for WebSocket server to start
sleep 2

# Start Next.js dev server
echo "Starting Next.js dev server..."
echo "NEXT_PUBLIC_WS_URL=ws://localhost:3001" > .env.local
npm run dev 