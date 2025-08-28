-- Pizza Order App Database Schema - PostgreSQL
-- This file documents the PostgreSQL table structure

-- Users Table
CREATE TABLE "Users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (length(name) >= 2),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
  phone VARCHAR(20),
  address JSONB DEFAULT '{}',
  role user_role DEFAULT 'customer',
  "isActive" BOOLEAN DEFAULT true,
  avatar VARCHAR(255) DEFAULT '',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');

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

-- Create ENUM type for product categories
CREATE TYPE product_category AS ENUM ('pizza', 'appetizer', 'drink', 'dessert');

-- Create indexes for Products
CREATE INDEX idx_products_category ON "Products"(category);
CREATE INDEX idx_products_available ON "Products"("isAvailable");

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

-- Create ENUM types for Orders
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'online');

-- Create indexes for Orders
CREATE INDEX idx_orders_customer ON "Orders"("customerId");
CREATE INDEX idx_orders_status ON "Orders"(status);
CREATE INDEX idx_orders_number ON "Orders"("orderNumber");
CREATE INDEX idx_orders_created ON "Orders"("createdAt");
CREATE INDEX idx_orders_promotion ON "Orders"("promotionId");

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

-- Create ENUM type for promotion discount types
CREATE TYPE promotion_discount_type AS ENUM ('percentage', 'fixed');

-- Create index for Promotions
CREATE INDEX idx_promotions_code ON "Promotions"(code);
CREATE INDEX idx_promotions_active_dates ON "Promotions"("isActive", "startDate", "endDate");

-- Categories Collection (Optional - for better organization)
-- {
--   _id: ObjectId,
--   name: String (required),
--   description: String,
--   isActive: Boolean (default: true),
--   createdAt: Date,
--   updatedAt: Date
-- }
