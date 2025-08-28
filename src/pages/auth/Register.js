import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      toast.success('Registration successful!');
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'staff':
          // Staff dashboard route not defined; send to orders page
          navigate('/staff/orders');
          break;
        case 'customer':
          // No /customer/dashboard route; send to home or menu
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Registration failed';
      setSubmitError(serverMessage);
      toast.error(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join Komorebi Pizza</h2>
          <p>Create your account to start ordering</p>
        </div>

        {submitError && (
          <div
            className="auth-error"
            role="alert"
            aria-live="polite"
            style={{
              background: '#fdecea',
              color: '#b71c1c',
              border: '1px solid #f5c6cb',
              padding: '12px 16px',
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            {/* If server sent multiple validation messages joined by comma, show as list */}
            {submitError.includes(',') ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {submitError.split(',').map((msg, idx) => (
                  <li key={idx}>{msg.trim()}</li>
                ))}
              </ul>
            ) : (
              <span>{submitError}</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
