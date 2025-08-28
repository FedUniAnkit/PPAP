# API Documentation - Pizza Order App

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "data": {}, // Response data
  "message": "Success/Error message",
  "error": "Error details (if any)"
}
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer" // optional, defaults to "customer"
}
```

### Login User
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
- **GET** `/auth/me`
- **Access**: Private
- **Headers**: Authorization required

## User Management Endpoints (Admin Only)

### Get All Users
- **GET** `/users`
- **Access**: Admin only
- **Query Parameters**:
  - `role`: Filter by role (customer, staff, admin)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

### Get User by ID
- **GET** `/users/:id`
- **Access**: Admin only

### Update User
- **PUT** `/users/:id`
- **Access**: Admin only
- **Body**: User fields to update

### Deactivate/Activate User
- **PATCH** `/users/:id/status`
- **Access**: Admin only
- **Body**:
```json
{
  "isActive": true/false
}
```

### Delete User
- **DELETE** `/users/:id`
- **Access**: Admin only

## Product Management Endpoints

### Get All Products
- **GET** `/products`
- **Access**: Public
- **Query Parameters**:
  - `category`: Filter by category
  - `available`: Filter by availability
  - `search`: Search by name

### Get Product by ID
- **GET** `/products/:id`
- **Access**: Public

### Create Product
- **POST** `/products`
- **Access**: Staff/Admin only
- **Body**:
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with fresh ingredients",
  "price": 14.99,
  "category": "pizza",
  "ingredients": ["Mozzarella", "Tomato Sauce", "Basil"],
  "sizes": [
    {"name": "Small", "price": 12.99},
    {"name": "Medium", "price": 14.99},
    {"name": "Large", "price": 17.99}
  ]
}
```

### Update Product
- **PUT** `/products/:id`
- **Access**: Staff/Admin only

### Delete Product
- **DELETE** `/products/:id`
- **Access**: Admin only

## Order Management Endpoints

### Get All Orders
- **GET** `/orders`
- **Access**: Staff/Admin (all orders), Customer (own orders)
- **Query Parameters**:
  - `status`: Filter by status
  - `customer`: Filter by customer ID (staff/admin only)
  - `date`: Filter by date range

### Get Order by ID
- **GET** `/orders/:id`
- **Access**: Owner/Staff/Admin

### Create Order
- **POST** `/orders`
- **Access**: Customer
- **Body**:
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "Medium",
      "customizations": ["Extra cheese"]
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Pizza City",
    "state": "PC",
    "zipCode": "12345"
  },
  "customerNotes": "Please ring doorbell"
}
```

### Update Order Status
- **PATCH** `/orders/:id/status`
- **Access**: Staff/Admin only
- **Body**:
```json
{
  "status": "confirmed", // pending, confirmed, preparing, ready, delivered, cancelled
  "staffNotes": "Order confirmed and in preparation"
}
```

### Cancel Order
- **PATCH** `/orders/:id/cancel`
- **Access**: Customer (own orders), Staff/Admin (any order)

## Dashboard/Analytics Endpoints (Admin Only)

### Sales Analytics
- **GET** `/dashboard/sales`
- **Access**: Admin only
- **Query Parameters**:
  - `period`: weekly, monthly, yearly
  - `startDate`: Start date for custom range
  - `endDate`: End date for custom range

### Product Analytics
- **GET** `/dashboard/products`
- **Access**: Admin only

### User Statistics
- **GET** `/dashboard/users`
- **Access**: Admin only

## File Upload Endpoints

### Upload Product Image
- **POST** `/upload/product-image`
- **Access**: Staff/Admin only
- **Content-Type**: multipart/form-data
- **Body**: Form data with 'image' field

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 422  | Validation Error |
| 500  | Internal Server Error |

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Authentication endpoints: 5 requests per 15 minutes per IP

## Data Validation Rules

### User Registration
- Name: Required, min 2 characters
- Email: Required, valid email format, unique
- Password: Required, min 6 characters
- Phone: Optional, valid phone format

### Product Creation
- Name: Required, min 2 characters
- Description: Required, min 10 characters
- Price: Required, positive number
- Category: Required, enum values

### Order Creation
- Items: Required, non-empty array
- Each item must have valid product ID and quantity > 0
