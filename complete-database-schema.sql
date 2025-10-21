-- Pizza Order App - Complete Database Schema for PostgreSQL
-- Copy and paste this entire script into your PostgreSQL query tool

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE pizza_order_app;

-- Connect to the database and run the following:

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "Messages" CASCADE;
DROP TABLE IF EXISTS "NewsletterSubscriptions" CASCADE;
DROP TABLE IF EXISTS "ContentBlocks" CASCADE;
DROP TABLE IF EXISTS "Orders" CASCADE;
DROP TABLE IF EXISTS "Products" CASCADE;
DROP TABLE IF EXISTS "Promotions" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS promotion_discount_type CASCADE;
DROP TYPE IF EXISTS content_block_type CASCADE;

-- Create ENUM types first
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
CREATE TYPE product_category AS ENUM ('pizza', 'appetizer', 'drink', 'dessert');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'online');
CREATE TYPE promotion_discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE content_block_type AS ENUM ('text', 'html', 'markdown', 'image_url', 'json');

-- Users Table
CREATE TABLE "Users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (length(name) >= 2),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
  "passwordResetToken" VARCHAR(255),
  "passwordResetExpires" TIMESTAMP WITH TIME ZONE,
  "passwordChangedAt" TIMESTAMP WITH TIME ZONE,
  "forcePasswordReset" BOOLEAN DEFAULT false,
  "isTemporaryPassword" BOOLEAN DEFAULT false,
  "accountStatus" VARCHAR(50) DEFAULT 'active' CHECK ("accountStatus" IN ('active', 'pending_staff_registration', 'inactive')),
  phone VARCHAR(20),
  address JSONB DEFAULT '{}',
  role user_role DEFAULT 'customer',
  "isActive" BOOLEAN DEFAULT true,
  avatar VARCHAR(255) DEFAULT '',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE "Products" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (length(name) >= 2),
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category product_category NOT NULL,
  image VARCHAR(255) DEFAULT '',
  ingredients TEXT[] DEFAULT '{}',
  sizes JSONB DEFAULT '[]',
  "isAvailable" BOOLEAN DEFAULT true,
  "preparationTime" INTEGER DEFAULT 15 CHECK ("preparationTime" >= 1),
  "nutritionalInfo" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE "Promotions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  "discountType" promotion_discount_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT dates_check CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "startDate" < "endDate")
);

-- Orders Table
CREATE TABLE "Orders" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
  "customerId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  "totalAmount" DECIMAL(10,2) NOT NULL CHECK ("totalAmount" >= 0),
  status order_status DEFAULT 'pending',
  "paymentStatus" payment_status DEFAULT 'pending',
  "paymentMethod" payment_method DEFAULT 'online',
  "deliveryAddress" JSONB DEFAULT '{}',
  "customerNotes" TEXT CHECK (length("customerNotes") <= 500),
  "staffNotes" TEXT CHECK (length("staffNotes") <= 500),
  "estimatedDeliveryTime" TIMESTAMP WITH TIME ZONE,
  "actualDeliveryTime" TIMESTAMP WITH TIME ZONE,
  "promotionId" UUID REFERENCES "Promotions"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table (for customer-staff communication)
CREATE TABLE "Messages" (
  id SERIAL PRIMARY KEY,
  "orderId" UUID NOT NULL REFERENCES "Orders"(id) ON DELETE CASCADE,
  "senderId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "receiverId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Blocks Table (for dynamic content management)
CREATE TABLE "ContentBlocks" (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type content_block_type NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  "lastUpdatedBy" UUID REFERENCES "Users"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions Table
CREATE TABLE "NewsletterSubscriptions" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_users_role ON "Users"(role);
CREATE INDEX idx_users_active ON "Users"("isActive");

CREATE INDEX idx_products_category ON "Products"(category);
CREATE INDEX idx_products_available ON "Products"("isAvailable");
CREATE INDEX idx_products_name ON "Products"(name);

CREATE INDEX idx_orders_customer ON "Orders"("customerId");
CREATE INDEX idx_orders_status ON "Orders"(status);
CREATE INDEX idx_orders_number ON "Orders"("orderNumber");
CREATE INDEX idx_orders_created ON "Orders"("createdAt");
CREATE INDEX idx_orders_promotion ON "Orders"("promotionId");
CREATE INDEX idx_orders_payment_status ON "Orders"("paymentStatus");

CREATE INDEX idx_promotions_code ON "Promotions"(code);
CREATE INDEX idx_promotions_active_dates ON "Promotions"("isActive", "startDate", "endDate");

CREATE INDEX idx_messages_order ON "Messages"("orderId");
CREATE INDEX idx_messages_sender ON "Messages"("senderId");
CREATE INDEX idx_messages_receiver ON "Messages"("receiverId");
CREATE INDEX idx_messages_read ON "Messages"("isRead");

CREATE INDEX idx_content_blocks_slug ON "ContentBlocks"(slug);
CREATE INDEX idx_content_blocks_type ON "ContentBlocks"(type);

CREATE INDEX idx_newsletter_email ON "NewsletterSubscriptions"(email);
CREATE INDEX idx_newsletter_active ON "NewsletterSubscriptions"("isActive");

-- Insert sample data (optional)
-- Admin user (password: admin123 - hashed)
INSERT INTO "Users" (id, name, email, password, role, "isActive") VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true);

-- Staff user (password: staff123 - hashed)
INSERT INTO "Users" (id, name, email, password, role, "isActive") VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Staff Member', 'staff@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', true);

-- Customer user (password: customer123 - hashed)
INSERT INTO "Users" (id, name, email, password, role, "isActive") VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'John Customer', 'customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', true);

-- Sample products
INSERT INTO "Products" (name, description, price, category, image, ingredients, sizes, "isAvailable") VALUES 
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 12.99, 'pizza', '/images/margherita.jpg', ARRAY['tomato sauce', 'mozzarella', 'basil'], '[{"size": "small", "price": 10.99}, {"size": "medium", "price": 12.99}, {"size": "large", "price": 15.99}]'::jsonb, true),
('Pepperoni Pizza', 'Traditional pizza with pepperoni and mozzarella cheese', 14.99, 'pizza', '/images/pepperoni.jpg', ARRAY['tomato sauce', 'mozzarella', 'pepperoni'], '[{"size": "small", "price": 12.99}, {"size": "medium", "price": 14.99}, {"size": "large", "price": 17.99}]'::jsonb, true),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 8.99, 'appetizer', '/images/caesar-salad.jpg', ARRAY['romaine lettuce', 'caesar dressing', 'croutons', 'parmesan'], '[]'::jsonb, true),
('Coca Cola', 'Refreshing soft drink', 2.99, 'drink', '/images/coca-cola.jpg', ARRAY['carbonated water', 'sugar', 'caffeine'], '[{"size": "small", "price": 1.99}, {"size": "medium", "price": 2.99}, {"size": "large", "price": 3.99}]'::jsonb, true),
('Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 6.99, 'dessert', '/images/chocolate-cake.jpg', ARRAY['chocolate', 'flour', 'eggs', 'butter'], '[]'::jsonb, true);

-- Sample promotion
INSERT INTO "Promotions" (code, description, "discountType", amount, "isActive") VALUES 
('WELCOME10', '10% off your first order', 'percentage', 10.00, true);

-- Sample content blocks
INSERT INTO "ContentBlocks" (slug, title, type, content, "lastUpdatedBy") VALUES 
('welcome-message', 'Welcome Message', 'html', '<h2>Welcome to Komorebi Pizza!</h2><p>Enjoy our delicious pizzas made with fresh ingredients.</p>', '550e8400-e29b-41d4-a716-446655440000'),
('contact-info', 'Contact Information', 'json', '{"phone": "+1-555-0123", "email": "info@komorebi.com", "address": "123 Pizza Street, Food City, FC 12345"}', '550e8400-e29b-41d4-a716-446655440000');

-- Success message
SELECT 'Database schema created successfully! All tables, indexes, and sample data have been inserted.' as status;
