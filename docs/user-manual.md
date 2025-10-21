# User Manual - Komorebi Pizza Order System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Customer Guide](#customer-guide)
3. [Staff Guide](#staff-guide)
4. [Admin Guide](#admin-guide)
5. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled

### Accessing the System
1. Open your web browser
2. Navigate to: `http://localhost:3000` (development) or your deployed URL
3. You'll see the Komorebi Pizza homepage

### Creating an Account
1. Click "Register" in the top navigation
2. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number
   - Password (minimum 6 characters)
   - Address (for delivery)
3. Click "Create Account"
4. You'll be automatically logged in

---

## Customer Guide

### Browsing the Menu
1. Click "Menu" in the navigation bar
2. Browse products by category:
   - 🍕 Pizza
   - 🥗 Appetizers
   - 🥤 Drinks
   - 🍰 Desserts
3. Use the search bar to find specific items
4. Filter by availability or dietary preferences

### Placing an Order
1. **Add Items to Cart**:
   - Click on a product to view details
   - Select size (if applicable)
   - Choose quantity
   - Add any special instructions
   - Click "Add to Cart"

2. **Review Your Cart**:
   - Click the cart icon in the top right
   - Review items and quantities
   - Modify or remove items if needed
   - View total price

3. **Checkout Process**:
   - Click "Proceed to Checkout"
   - Confirm delivery address
   - Add order notes (optional)
   - Select payment method
   - Review order summary
   - Click "Place Order"

### Managing Your Orders
1. Go to "My Dashboard" → "Order History"
2. View all your past and current orders
3. Track order status:
   - **Pending**: Order received, awaiting confirmation
   - **Confirmed**: Order accepted by restaurant
   - **Preparing**: Food is being prepared
   - **Ready**: Order ready for pickup/delivery
   - **Delivered**: Order completed

### Updating Your Profile
1. Click your name in the top navigation
2. Select "Profile Settings"
3. Update your information:
   - Personal details
   - Delivery address
   - Phone number
   - Password

---

## Staff Guide

### Logging In
1. Use your staff credentials provided by the admin
2. You'll be redirected to the Staff Dashboard

### Managing Orders
1. **View All Orders**:
   - Dashboard shows all current orders
   - Orders are sorted by time (newest first)
   - Color-coded by status

2. **Processing Orders**:
   - Click on an order to view details
   - Update status as food progresses:
     - Confirm → Preparing → Ready → Delivered
   - Add staff notes for kitchen communication
   - Set estimated completion time

3. **Order Actions**:
   - **Confirm Order**: Accept the order
   - **Cancel Order**: Reject with reason
   - **Mark Ready**: When food is prepared
   - **Mark Delivered**: When order is completed

### Managing Products
1. **Add New Products**:
   - Go to "Products" → "Add New"
   - Fill in product details:
     - Name and description
     - Price and category
     - Available sizes
     - Ingredients list
     - Preparation time
   - Upload product image
   - Set availability status

2. **Update Existing Products**:
   - Find product in the list
   - Click "Edit"
   - Modify details as needed
   - Save changes

3. **Manage Availability**:
   - Quickly toggle product availability
   - Mark items as "Out of Stock"
   - Set seasonal availability

### Customer Communication
1. **Order Messages**:
   - View customer notes on orders
   - Send updates to customers
   - Notify about delays or changes

2. **Notifications**:
   - Receive alerts for new orders
   - Get notified of customer messages
   - System alerts for important updates

---

## Admin Guide

### User Management
1. **View All Users**:
   - Go to "Admin Panel" → "Users"
   - See all customers, staff, and admins
   - Filter by role or status

2. **User Actions**:
   - **Create New User**: Add staff or admin accounts
   - **Edit User Details**: Update information
   - **Deactivate/Activate**: Control user access
   - **Reset Password**: Help users with login issues
   - **Delete User**: Remove accounts (use carefully)

### Content Management
1. **Website Content**:
   - Update homepage content
   - Manage promotional banners
   - Edit menu descriptions
   - Update contact information

2. **Product Categories**:
   - Create new categories
   - Organize menu structure
   - Set category ordering

### Analytics Dashboard
1. **Sales Analytics**:
   - View sales by day, week, month, year
   - Track revenue trends
   - Identify peak hours/days
   - Export reports

2. **Product Analytics**:
   - Most popular items
   - Low-performing products
   - Inventory insights
   - Profit margins

3. **Customer Analytics**:
   - New vs returning customers
   - Order frequency
   - Average order value
   - Customer satisfaction metrics

### System Settings
1. **Email Configuration**:
   - Set up email notifications
   - Customize email templates
   - Configure SMTP settings

2. **Payment Settings**:
   - Manage payment methods
   - Configure Stripe settings
   - Set tax rates

3. **General Settings**:
   - Business hours
   - Delivery zones
   - Minimum order amounts
   - Service fees

---

## Troubleshooting

### Common Issues

#### Can't Log In
- **Check credentials**: Ensure email and password are correct
- **Account status**: Contact admin if account is deactivated
- **Clear browser cache**: Try clearing cookies and cache
- **Reset password**: Use "Forgot Password" link

#### Order Not Showing
- **Refresh page**: Sometimes orders take a moment to appear
- **Check order status**: Cancelled orders may not show in active list
- **Contact support**: If order is missing after payment

#### Payment Failed
- **Check card details**: Verify card number, expiry, and CVV
- **Insufficient funds**: Ensure adequate balance
- **Try different card**: Some cards may be restricted
- **Contact bank**: Bank may have blocked the transaction

#### Images Not Loading
- **Internet connection**: Check your connection speed
- **Browser compatibility**: Try a different browser
- **Clear cache**: Refresh the page or clear browser cache

### Getting Help
1. **Contact Information**:
   - Email: support@komorebi.com
   - Phone: +1 (555) 123-PIZZA
   - Hours: Monday-Sunday, 10 AM - 11 PM

2. **Self-Service**:
   - Check FAQ section
   - Review this user manual
   - Try basic troubleshooting steps

3. **For Staff/Admin Issues**:
   - Contact system administrator
   - Check system status page
   - Review error logs (admin only)

### Browser Compatibility
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Not Supported**: Internet Explorer

### Performance Tips
- Use a stable internet connection
- Close unnecessary browser tabs
- Clear browser cache regularly
- Update your browser to the latest version

---

*Last Updated: August 2025*
*Version: 1.0*
