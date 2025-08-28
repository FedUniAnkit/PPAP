import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NotificationHandler = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      const handleNewOrder = (order) => {
        console.log('New order notification received:', order);
        toast.info(`New order #${order.id} has been placed!`, {
          onClick: () => navigate('/staff/orders'),
          autoClose: 8000,
        });
      };

      socket.on('new_order', handleNewOrder);

      return () => {
        socket.off('new_order', handleNewOrder);
      };
    }
  }, [socket, navigate]);

  return null; // This component does not render anything
};

export default NotificationHandler;
