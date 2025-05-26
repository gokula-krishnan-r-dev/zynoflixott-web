import { useState, useEffect, useRef, useCallback } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useWebSocket(url: string) {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [socketMessage, setSocketMessage] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef<number>(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    // Function to establish connection
    const connect = useCallback(() => {
        // Clear any existing socket
        if (socketRef.current) {
            socketRef.current.close();
        }

        try {
            const newSocket = new WebSocket(url);
            socketRef.current = newSocket;
            setConnectionStatus('connecting');

            newSocket.onopen = () => {
                setConnectionStatus('connected');
                reconnectAttemptsRef.current = 0;
            };

            newSocket.onmessage = (event) => {
                setSocketMessage(event.data);
            };

            newSocket.onclose = () => {
                setConnectionStatus('disconnected');
                attemptReconnect();
            };

            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
                newSocket.close();
            };
        } catch (error) {
            console.error('Error establishing WebSocket connection:', error);
            setConnectionStatus('error');
            attemptReconnect();
        }
    }, [url]);

    // Function to attempt reconnection
    const attemptReconnect = useCallback(() => {
        if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
            console.warn('Maximum reconnection attempts reached');
            return;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
        }, RECONNECT_INTERVAL);
    }, [connect]);

    // Function to send messages
    const sendSocketMessage = useCallback(
        (message: string) => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(message);
                return true;
            }
            return false;
        },
        []
    );

    // Connect on initial render
    useEffect(() => {
        if (typeof window !== 'undefined') {
            connect();

            // Clean up on unmount
            return () => {
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                if (socketRef.current) {
                    socketRef.current.close();
                }
            };
        }
    }, [connect]);

    return {
        socketMessage,
        sendSocketMessage,
        connectionStatus
    };
} 