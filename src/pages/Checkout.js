import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    paymentMethod: 'CreditCard',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const orderData = {
      orderItems: cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      paymentMethod: formData.paymentMethod,
      totalPrice: cartTotal,
    };

    try {
      const createdOrder = await orderService.createOrder(orderData);
      clearCart();
      // Redirect to a confirmation or my-orders page
      navigate(`/customer/orders/${createdOrder.data.id}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="checkout-container">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping Address</h2>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" required />

          <h2>Payment Method</h2>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="CreditCard">Credit Card (mock)</option>
            <option value="PayPal">PayPal (mock)</option>
          </select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Place Order - $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary-checkout">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total-checkout">
            <strong>Total</strong>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
