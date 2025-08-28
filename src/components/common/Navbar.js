import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiHome } from 'react-icons/fi';
import logo from '../../assets/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };
  
  const navigateTo = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" title="Go to Homepage">
          <div className="home-section">
            <FiHome className="home-icon" />
            <span className="home-text">Home</span>
          </div>
          <div className="brand-section">
            <img src={logo} alt="Komorebi Pizza" className="logo-image" />
            <span className="logo-text">Komorebi Pizza</span>
          </div>
        </Link>

        <div className="nav-menu">
          <Link to="/menu" className="nav-link">
            Menu
          </Link>
          
          <Link to="/track-order" className="nav-link">
            Track My Order
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <div className="nav-dropdown">
                  <span className="nav-link nav-dropdown-toggle">Users</span>
                  <div className="nav-submenu" role="menu" aria-label="Users">
                    <Link to="/admin/users?role=customer" className="nav-subitem" role="menuitem">
                      My Customers
                    </Link>
                    <Link to="/admin/users?role=staff" className="nav-subitem" role="menuitem">
                      My Staff
                    </Link>
                  </div>
                </div>
              )}
              <div className="user-dropdown" ref={dropdownRef}>
                <button 
                  className="user-dropdown-toggle"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="user-avatar">
                    <FiUser />
                  </span>
                  <span className="user-name">
                    {user?.name}
                    <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="user-email">{user?.email}</div>
                      <div className="user-role">{user?.role}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item"
                      onClick={() => navigateTo('/settings')}
                    >
                      <FiSettings className="dropdown-icon" />
                      Account Settings
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => navigateTo('/cart')}
                    >
                      <span className="cart-count-badge">{cartCount}</span>
                      My Cart
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      <FiLogOut className="dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button primary">
                Register
              </Link>
            </>
          )}

          <Link to="/cart" className="nav-link cart-link">
            <span role="img" aria-label="cart">🛒</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
