import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import ChatBox from '../../components/chat/ChatBox';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const { clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Could not fetch order details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      setIsCancelling(true);
      try {
        const response = await orderService.cancelOrder(id);
        setOrder(response.data); // Update order state with the response
        toast.success('Order successfully cancelled!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel the order.');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const handleModifyOrder = async () => {
    if (window.confirm('This will cancel your current order and take you to the cart to make changes. Are you sure?')) {
      setIsModifying(true);
      try {
        const response = await orderService.initiateOrderModification(id);
        if (response.success) {
          clearCart();
          response.data.forEach(item => {
            addToCart(item.Product, item.quantity);
          });
          toast.info('Your order has been cancelled. Please review your cart and proceed to checkout again.');
          navigate('/cart');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to modify the order.');
      } finally {
        setIsModifying(false);
      }
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-details-container">
      <div className="order-confirmation-header">
        <h1>Thank you for your order!</h1>
        <p>Your order has been placed successfully.</p>
      </div>

      <h2>Order Details (ID: {order.id})</h2>
      <div className="order-summary-card">
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
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

      <div className="order-actions">
        <Link to="/customer/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        {order.status === 'Pending' && (
          <>
            <button onClick={handleCancelOrder} className="btn btn-danger" disabled={isCancelling || isModifying}>
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
            <button onClick={handleModifyOrder} className="btn btn-warning" disabled={isModifying || isCancelling}>
              {isModifying ? 'Processing...' : 'Modify Order'}
            </button>
          </>
        )}
      </div>

      <ChatBox orderId={order.id} customerId={order.userId} />
    </div>
  );
};

export default OrderDetails;
