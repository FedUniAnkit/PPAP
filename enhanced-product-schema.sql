-- Enhanced Product Schema for Komorebi Pizza Shop
-- This script adds new columns and updates the existing product structure

-- First, let's update the product_category enum to include more specific categories
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'side';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'deal';

-- Add new columns to Products table for enhanced menu functionality
ALTER TABLE "Products" 
ADD COLUMN IF NOT EXISTS "subcategory" VARCHAR(50),
ADD COLUMN IF NOT EXISTS "dietaryInfo" JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "customizationOptions" JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "allergens" TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "spiceLevel" INTEGER DEFAULT 0 CHECK ("spiceLevel" >= 0 AND "spiceLevel" <= 5),
ADD COLUMN IF NOT EXISTS "isPopular" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "isNew" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0;

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON "Products"("subcategory");
CREATE INDEX IF NOT EXISTS idx_products_dietary ON "Products" USING GIN ("dietaryInfo");
CREATE INDEX IF NOT EXISTS idx_products_popular ON "Products"("isPopular");
CREATE INDEX IF NOT EXISTS idx_products_new ON "Products"("isNew");
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON "Products"("sortOrder");
CREATE INDEX IF NOT EXISTS idx_products_spice_level ON "Products"("spiceLevel");

-- Create a new table for customization options (for Build Your Own functionality)
CREATE TABLE IF NOT EXISTS "CustomizationOptions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "optionType" VARCHAR(50) NOT NULL, -- 'size', 'crust', 'sauce', 'cheese', 'topping'
  name VARCHAR(100) NOT NULL,
  "displayName" VARCHAR(100) NOT NULL,
  "priceModifier" DECIMAL(10,2) DEFAULT 0.00,
  category VARCHAR(50), -- 'veg', 'protein', 'premium' for toppings
  "dietaryInfo" JSONB DEFAULT '{}',
  "isAvailable" BOOLEAN DEFAULT true,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for CustomizationOptions
CREATE INDEX IF NOT EXISTS idx_customization_type ON "CustomizationOptions"("optionType");
CREATE INDEX IF NOT EXISTS idx_customization_category ON "CustomizationOptions"(category);
CREATE INDEX IF NOT EXISTS idx_customization_available ON "CustomizationOptions"("isAvailable");

-- Insert customization options data
INSERT INTO "CustomizationOptions" ("optionType", name, "displayName", "priceModifier", category, "dietaryInfo", "sortOrder") VALUES
-- Sizes
('size', 'small', 'Small (9")', 0.00, NULL, '{}', 1),
('size', 'medium', 'Medium (11")', 2.00, NULL, '{}', 2),
('size', 'large', 'Large (13")', 5.00, NULL, '{}', 3),
('size', 'family', 'Family (15")', 8.00, NULL, '{}', 4),

-- Crusts
('crust', 'classic', 'Classic', 0.00, NULL, '{}', 1),
('crust', 'thin', 'Thin & Crispy', 0.00, NULL, '{}', 2),
('crust', 'deep_dish', 'Deep Dish', 2.00, NULL, '{}', 3),
('crust', 'gluten_free', 'Gluten-Free', 3.00, NULL, '{"glutenFree": true}', 4),
('crust', 'stuffed', 'Stuffed Crust', 4.00, NULL, '{}', 5),

-- Sauces
('sauce', 'tomato', 'Tomato Base', 0.00, NULL, '{"vegan": true}', 1),
('sauce', 'bbq', 'BBQ Sauce', 0.00, NULL, '{}', 2),
('sauce', 'peri_peri', 'Peri-Peri', 0.00, NULL, '{"spicy": true}', 3),
('sauce', 'garlic', 'Creamy Garlic', 0.00, NULL, '{"vegetarian": true}', 4),

-- Cheese
('cheese', 'mozzarella', 'Mozzarella', 0.00, NULL, '{"vegetarian": true}', 1),
('cheese', 'extra_cheese', 'Extra Cheese', 2.00, NULL, '{"vegetarian": true}', 2),
('cheese', 'vegan_cheese', 'Vegan Cheese', 2.00, NULL, '{"vegan": true}', 3),

-- Vegetable Toppings
('topping', 'mushrooms', 'Mushrooms', 1.50, 'veg', '{"vegan": true}', 1),
('topping', 'capsicum', 'Capsicum', 1.50, 'veg', '{"vegan": true}', 2),
('topping', 'onion', 'Red Onion', 1.50, 'veg', '{"vegan": true}', 3),
('topping', 'olives', 'Kalamata Olives', 1.50, 'veg', '{"vegan": true}', 4),
('topping', 'jalapeno', 'Jalapeño', 1.50, 'veg', '{"vegan": true, "spicy": true}', 5),
('topping', 'pineapple', 'Pineapple', 1.50, 'veg', '{"vegan": true}', 6),
('topping', 'tomato', 'Fresh Tomato', 1.50, 'veg', '{"vegan": true}', 7),
('topping', 'corn', 'Sweet Corn', 1.50, 'veg', '{"vegan": true}', 8),
('topping', 'spinach', 'Baby Spinach', 1.50, 'veg', '{"vegan": true}', 9),

-- Protein Toppings
('topping', 'pepperoni', 'Pepperoni', 2.50, 'protein', '{}', 10),
('topping', 'chicken', 'Grilled Chicken', 2.50, 'protein', '{"halal": true}', 11),
('topping', 'ham', 'Ham', 2.50, 'protein', '{}', 12),
('topping', 'bacon', 'Bacon', 2.50, 'protein', '{}', 13),
('topping', 'beef', 'Ground Beef', 2.50, 'protein', '{"halal": true}', 14),
('topping', 'paneer', 'Paneer', 2.50, 'protein', '{"vegetarian": true}', 15),
('topping', 'sausage', 'Italian Sausage', 2.50, 'protein', '{}', 16),

-- Premium Toppings
('topping', 'prosciutto', 'Prosciutto', 4.00, 'premium', '{}', 17),
('topping', 'prawns', 'Tiger Prawns', 4.00, 'premium', '{}', 18),
('topping', 'truffle_oil', 'Truffle Oil', 3.50, 'premium', '{"vegetarian": true}', 19),
('topping', 'artichoke', 'Artichoke Hearts', 3.00, 'premium', '{"vegan": true}', 20),
('topping', 'feta', 'Feta Cheese', 3.00, 'premium', '{"vegetarian": true}', 21),
('topping', 'goat_cheese', 'Goat Cheese', 3.50, 'premium', '{"vegetarian": true}', 22);

-- Success message
SELECT 'Enhanced product schema created successfully! New columns and customization options have been added.' as status;
