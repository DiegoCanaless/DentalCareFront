'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dentalcareback.onrender.com';

type AppointmentEvent = {
  id: number;
  date: string;
  time: string;
  status: string;
  user?: { id: number; name: string; email: string };
  treatment?: { id: number; name: string; duration: number; price: number };
  dentist?: { id: number; name: string } | null;
};

type UseSocketOptions = {
  onAppointmentCreated?: (appointment: AppointmentEvent) => void;
  onAppointmentUpdated?: (appointment: AppointmentEvent) => void;
  onAppointmentCancelled?: (data: { id: number }) => void;
};

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    if (options.onAppointmentCreated) {
      socketRef.current.on('appointment:created', options.onAppointmentCreated);
    }

    if (options.onAppointmentUpdated) {
      socketRef.current.on('appointment:updated', options.onAppointmentUpdated);
    }

    if (options.onAppointmentCancelled) {
      socketRef.current.on('appointment:cancelled', options.onAppointmentCancelled);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinRoom = useCallback((room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-appointments', room);
    }
  }, []);

  const leaveRoom = useCallback((room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-appointments', room);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
  };
}