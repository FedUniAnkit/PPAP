import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getMyOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError('Failed to fetch your order history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-orders-container">
      <h1>My Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-history-card">
              <div className="order-card-header">
                <h3>Order #{order.id}</h3>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-card-body">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="order-card-footer">
                <Link to={`/customer/orders/${order.id}`} className="btn btn-secondary">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
