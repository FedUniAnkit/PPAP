import api from './api';

const productService = {
  // Get all active products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get a single product by its ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product (for admin/staff)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update a product (for admin/staff)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (for admin/staff)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
