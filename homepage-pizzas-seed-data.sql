-- Additional Homepage Pizzas for Komorebi Pizza Shop
-- These are the pizzas currently displayed on the homepage that aren't in the main menu

-- Insert the homepage featured pizzas
INSERT INTO "Products" (
  id, name, description, price, category, subcategory, image, ingredients, sizes, 
  "dietaryInfo", allergens, "spiceLevel", "isPopular", "isNew", "sortOrder", 
  "preparationTime", "customizationOptions", "isAvailable"
) VALUES

-- HOMEPAGE FEATURED PIZZAS
('66666666-6666-6666-6666-666666666001', 'Margherita Supreme', 'Premium version of our classic Margherita with fresh mozzarella, basil, and premium San Marzano tomatoes', 24.00, 'pizza', 'classics', '/images/pizzas/margherita-supreme.jpg',
ARRAY['premium San Marzano tomatoes', 'fresh mozzarella', 'fresh basil', 'extra virgin olive oil'], 
'[{"size": "small", "price": 20.00}, {"size": "medium", "price": 24.00}, {"size": "large", "price": 28.00}, {"size": "family", "price": 32.00}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 1, 14, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666002', 'Pepperoni Classic', 'Our signature pepperoni pizza with premium pepperoni and mozzarella cheese', 22.00, 'pizza', 'classics', '/images/pizzas/pepperoni-classic.jpg',
ARRAY['tomato sauce', 'mozzarella', 'premium pepperoni'], 
'[{"size": "small", "price": 18.00}, {"size": "medium", "price": 22.00}, {"size": "large", "price": 26.00}, {"size": "family", "price": 30.00}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 2, 16, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666003', 'Meat Lovers Supreme', 'Ultimate meat pizza with pepperoni, Italian sausage, bacon, and ham', 28.00, 'pizza', 'meat-lovers', '/images/pizzas/meat-lovers-supreme.jpg',
ARRAY['tomato sauce', 'mozzarella', 'pepperoni', 'Italian sausage', 'bacon', 'ham'], 
'[{"size": "small", "price": 24.00}, {"size": "medium", "price": 28.00}, {"size": "large", "price": 32.00}, {"size": "family", "price": 36.00}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 3, 20, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666004', 'Veggie Delight', 'Garden fresh vegetables with herbs and cheese on our signature base', 26.00, 'pizza', 'veggie', '/images/pizzas/veggie-delight.jpg',
ARRAY['tomato sauce', 'mozzarella', 'bell peppers', 'mushrooms', 'red onion', 'cherry tomatoes', 'fresh herbs', 'olives'], 
'[{"size": "small", "price": 22.00}, {"size": "medium", "price": 26.00}, {"size": "large", "price": 30.00}, {"size": "family", "price": 34.00}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, false, 4, 16, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666005', 'Hawaiian Supreme', 'Premium ham and pineapple pizza with mozzarella cheese', 25.00, 'pizza', 'classics', '/images/pizzas/hawaiian-supreme.jpg',
ARRAY['tomato sauce', 'mozzarella', 'premium ham', 'fresh pineapple'], 
'[{"size": "small", "price": 21.00}, {"size": "medium", "price": 25.00}, {"size": "large", "price": 29.00}, {"size": "family", "price": 33.00}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, false, 5, 16, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666006', 'Teriyaki Delight', 'Japanese-inspired pizza with teriyaki chicken and fresh vegetables', 27.00, 'pizza', 'local-specials', '/images/pizzas/teriyaki-delight.jpg',
ARRAY['teriyaki sauce', 'mozzarella', 'grilled chicken', 'bell peppers', 'red onion', 'pineapple', 'sesame seeds'], 
'[{"size": "small", "price": 23.00}, {"size": "medium", "price": 27.00}, {"size": "large", "price": 31.00}, {"size": "family", "price": 35.00}]'::jsonb,
'{"halal": true}'::jsonb, ARRAY['gluten', 'dairy', 'sesame'], 1, false, true, 6, 18, '{"customizable": true}'::jsonb, true),

('66666666-6666-6666-6666-666666666007', 'Okonomiyaki Fusion', 'Unique fusion pizza with traditional Japanese okonomiyaki flavors', 26.00, 'pizza', 'local-specials', '/images/pizzas/okonomiyaki-fusion.jpg',
ARRAY['okonomiyaki sauce', 'mozzarella', 'cabbage', 'bacon', 'green onions', 'bonito flakes', 'nori', 'Japanese mayo'], 
'[{"size": "small", "price": 22.00}, {"size": "medium", "price": 26.00}, {"size": "large", "price": 30.00}, {"size": "family", "price": 34.00}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy', 'eggs', 'fish'], 1, false, true, 7, 20, '{"customizable": true}'::jsonb, true);

-- Success message
SELECT 'Homepage featured pizzas added successfully! ' || COUNT(*) || ' additional pizzas inserted.' as status
FROM "Products" 
WHERE id::text LIKE '66666666-6666-6666-6666-%';
