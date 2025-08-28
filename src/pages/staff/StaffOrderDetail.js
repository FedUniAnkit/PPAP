import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import ChatBox from '../../components/chat/ChatBox';
import './StaffOrderDetail.css';

const StaffOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Could not fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="staff-order-details-container">
      <h2>Order Details (ID: {order.id})</h2>
      <div className="order-summary-card">
        <p><strong>Customer:</strong> {order.User.name} ({order.User.email})</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        <p><strong>Shipping to:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
      </div>

      <h3>Items Ordered</h3>
      <div className="order-items-list">
        {order.OrderItems.map(item => (
          <div key={item.id} className="order-item-card">
            <p><strong>{item.Product.name}</strong></p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <ChatBox orderId={order.id} customerId={order.userId} />

      <Link to="/staff/orders" className="btn btn-secondary">Back to All Orders</Link>
    </div>
  );
};

export default StaffOrderDetail;
