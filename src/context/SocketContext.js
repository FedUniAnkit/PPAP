import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        newSocket.emit('join_staff_room');
      });

      return () => newSocket.close();
    } else if (socket) {
      socket.close();
      setSocket(null);
    }

    // This dependency array ensures the effect runs when the user's auth state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
