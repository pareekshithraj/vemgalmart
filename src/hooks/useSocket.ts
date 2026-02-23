import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
    const [socket] = useState<Socket>(() => {
        const socketInstance = io(SOCKET_URL);
        return socketInstance;
    });

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return socket;
};
