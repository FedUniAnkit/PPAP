import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import './Menu.css'; // We will create this file for styling

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch our delicious pizzas. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Add a visual confirmation
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Freshly baked, handcrafted pizzas just for you.</p>
      </div>

      {error && <p className="error-message">{error}</p>}
      {isLoading ? <p>Loading menu...</p> : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <p className="product-price">${product.price}</p>
                  <button onClick={() => handleAddToCart(product)} className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
