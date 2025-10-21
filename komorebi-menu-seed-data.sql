-- Komorebi Pizza Shop - Complete Menu Seed Data
-- This script populates the database with a comprehensive menu

-- Clear existing product data
DELETE FROM "Products";

-- Insert Pizza Menu Items
INSERT INTO "Products" (
  id, name, description, price, category, subcategory, image, ingredients, sizes, 
  "dietaryInfo", allergens, "spiceLevel", "isPopular", "isNew", "sortOrder", 
  "preparationTime", "customizationOptions", "isAvailable"
) VALUES

-- CLASSICS PIZZAS
('11111111-1111-1111-1111-111111111001', 'Margherita', 'Classic pizza with San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves', 12.99, 'pizza', 'classics', '/images/pizzas/margherita.jpg', 
ARRAY['tomato sauce', 'mozzarella', 'fresh basil', 'olive oil'], 
'[{"size": "small", "price": 10.99}, {"size": "medium", "price": 12.99}, {"size": "large", "price": 15.99}, {"size": "family", "price": 18.99}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 1, 12, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111002', 'Pepperoni', 'Traditional pizza topped with premium pepperoni and mozzarella cheese', 14.99, 'pizza', 'classics', '/images/pizzas/pepperoni.jpg',
ARRAY['tomato sauce', 'mozzarella', 'pepperoni'], 
'[{"size": "small", "price": 12.99}, {"size": "medium", "price": 14.99}, {"size": "large", "price": 17.99}, {"size": "family", "price": 20.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 2, 15, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111003', 'Hawaiian', 'Sweet and savory combination of ham, pineapple, and mozzarella', 15.99, 'pizza', 'classics', '/images/pizzas/hawaiian.jpg',
ARRAY['tomato sauce', 'mozzarella', 'ham', 'pineapple'], 
'[{"size": "small", "price": 13.99}, {"size": "medium", "price": 15.99}, {"size": "large", "price": 18.99}, {"size": "family", "price": 21.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 3, 15, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111004', 'BBQ Chicken', 'Tender chicken pieces with smoky BBQ sauce, red onion, and mozzarella', 16.99, 'pizza', 'classics', '/images/pizzas/bbq-chicken.jpg',
ARRAY['BBQ sauce', 'mozzarella', 'grilled chicken', 'red onion', 'cilantro'], 
'[{"size": "small", "price": 14.99}, {"size": "medium", "price": 16.99}, {"size": "large", "price": 19.99}, {"size": "family", "price": 22.99}]'::jsonb,
'{"halal": true}'::jsonb, ARRAY['gluten', 'dairy'], 1, true, false, 4, 18, '{"customizable": true}'::jsonb, true),

-- PREMIUM/GOURMET PIZZAS
('11111111-1111-1111-1111-111111111005', 'Truffle Mushroom', 'Luxurious pizza with wild mushrooms, truffle oil, mozzarella, and fresh herbs', 22.99, 'pizza', 'premium', '/images/pizzas/truffle-mushroom.jpg',
ARRAY['white sauce', 'mozzarella', 'wild mushrooms', 'truffle oil', 'fresh thyme', 'parmesan'], 
'[{"size": "small", "price": 20.99}, {"size": "medium", "price": 22.99}, {"size": "large", "price": 25.99}, {"size": "family", "price": 28.99}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, true, 5, 20, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111006', 'Prosciutto & Rocket', 'Thin-crust pizza with prosciutto di Parma, rocket, cherry tomatoes, and parmesan', 21.99, 'pizza', 'premium', '/images/pizzas/prosciutto-rocket.jpg',
ARRAY['tomato sauce', 'mozzarella', 'prosciutto', 'rocket', 'cherry tomatoes', 'parmesan'], 
'[{"size": "small", "price": 19.99}, {"size": "medium", "price": 21.99}, {"size": "large", "price": 24.99}, {"size": "family", "price": 27.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, true, 6, 18, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111007', 'Peri-Peri Chicken', 'Spicy Portuguese-style chicken with peri-peri sauce, capsicum, and red onion', 18.99, 'pizza', 'premium', '/images/pizzas/peri-peri-chicken.jpg',
ARRAY['peri-peri sauce', 'mozzarella', 'grilled chicken', 'capsicum', 'red onion', 'jalapeños'], 
'[{"size": "small", "price": 16.99}, {"size": "medium", "price": 18.99}, {"size": "large", "price": 21.99}, {"size": "family", "price": 24.99}]'::jsonb,
'{"halal": true, "spicy": true}'::jsonb, ARRAY['gluten', 'dairy'], 4, false, false, 7, 20, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111008', 'Tandoori Paneer', 'Indian-inspired pizza with tandoori paneer, capsicum, onion, and mint chutney', 17.99, 'pizza', 'premium', '/images/pizzas/tandoori-paneer.jpg',
ARRAY['tomato sauce', 'mozzarella', 'tandoori paneer', 'capsicum', 'red onion', 'mint chutney'], 
'[{"size": "small", "price": 15.99}, {"size": "medium", "price": 17.99}, {"size": "large", "price": 20.99}, {"size": "family", "price": 23.99}]'::jsonb,
'{"vegetarian": true, "spicy": true}'::jsonb, ARRAY['gluten', 'dairy'], 3, false, true, 8, 18, '{"customizable": true}'::jsonb, true),

-- VEGGIE/VEGAN PIZZAS
('11111111-1111-1111-1111-111111111009', 'Garden Vegetable', 'Fresh seasonal vegetables with mozzarella on tomato base', 15.99, 'pizza', 'veggie', '/images/pizzas/garden-veg.jpg',
ARRAY['tomato sauce', 'mozzarella', 'mushrooms', 'capsicum', 'red onion', 'cherry tomatoes', 'olives'], 
'[{"size": "small", "price": 13.99}, {"size": "medium", "price": 15.99}, {"size": "large", "price": 18.99}, {"size": "family", "price": 21.99}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, false, 9, 15, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111010', 'Vegan Margherita', 'Classic margherita made with house-made vegan cheese and fresh basil', 16.99, 'pizza', 'veggie', '/images/pizzas/vegan-margherita.jpg',
ARRAY['tomato sauce', 'vegan mozzarella', 'fresh basil', 'olive oil'], 
'[{"size": "small", "price": 14.99}, {"size": "medium", "price": 16.99}, {"size": "large", "price": 19.99}, {"size": "family", "price": 22.99}]'::jsonb,
'{"vegan": true, "vegetarian": true}'::jsonb, ARRAY['gluten'], 0, false, true, 10, 15, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111011', 'Mediterranean', 'Kalamata olives, sun-dried tomatoes, capsicum, artichoke hearts, and feta', 17.99, 'pizza', 'veggie', '/images/pizzas/mediterranean.jpg',
ARRAY['tomato sauce', 'mozzarella', 'kalamata olives', 'sun-dried tomatoes', 'capsicum', 'artichoke hearts', 'feta'], 
'[{"size": "small", "price": 15.99}, {"size": "medium", "price": 17.99}, {"size": "large", "price": 20.99}, {"size": "family", "price": 23.99}]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, false, 11, 16, '{"customizable": true}'::jsonb, true),

-- MEAT LOVERS PIZZAS
('11111111-1111-1111-1111-111111111012', 'Supreme', 'The ultimate pizza with pepperoni, ham, mushrooms, capsicum, olives, and onion', 19.99, 'pizza', 'meat-lovers', '/images/pizzas/supreme.jpg',
ARRAY['tomato sauce', 'mozzarella', 'pepperoni', 'ham', 'mushrooms', 'capsicum', 'olives', 'red onion'], 
'[{"size": "small", "price": 17.99}, {"size": "medium", "price": 19.99}, {"size": "large", "price": 22.99}, {"size": "family", "price": 25.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 12, 20, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111013', 'Double Pepperoni', 'Extra pepperoni for the true pepperoni lovers with double mozzarella', 17.99, 'pizza', 'meat-lovers', '/images/pizzas/double-pepperoni.jpg',
ARRAY['tomato sauce', 'double mozzarella', 'double pepperoni'], 
'[{"size": "small", "price": 15.99}, {"size": "medium", "price": 17.99}, {"size": "large", "price": 20.99}, {"size": "family", "price": 23.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 13, 16, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111014', 'Meat Feast', 'Carnivore''s delight with pepperoni, ham, bacon, beef, and Italian sausage', 21.99, 'pizza', 'meat-lovers', '/images/pizzas/meat-feast.jpg',
ARRAY['tomato sauce', 'mozzarella', 'pepperoni', 'ham', 'bacon', 'ground beef', 'Italian sausage'], 
'[{"size": "small", "price": 19.99}, {"size": "medium", "price": 21.99}, {"size": "large", "price": 24.99}, {"size": "family", "price": 27.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 0, false, false, 14, 22, '{"customizable": true}'::jsonb, true),

-- LOCAL SPECIALS
('11111111-1111-1111-1111-111111111015', 'Komorebi Signature', 'Our house special with prawns, chorizo, roasted capsicum, and garlic oil', 23.99, 'pizza', 'local-specials', '/images/pizzas/komorebi-signature.jpg',
ARRAY['garlic oil', 'mozzarella', 'tiger prawns', 'chorizo', 'roasted capsicum', 'fresh herbs'], 
'[{"size": "small", "price": 21.99}, {"size": "medium", "price": 23.99}, {"size": "large", "price": 26.99}, {"size": "family", "price": 29.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy', 'seafood'], 1, false, true, 15, 25, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111016', 'Outback BBQ', 'Australian-inspired with bacon, red onion, smoky BBQ sauce, and bush herbs', 18.99, 'pizza', 'local-specials', '/images/pizzas/outback-bbq.jpg',
ARRAY['smoky BBQ sauce', 'mozzarella', 'bacon', 'red onion', 'bush herbs'], 
'[{"size": "small", "price": 16.99}, {"size": "medium", "price": 18.99}, {"size": "large", "price": 21.99}, {"size": "family", "price": 24.99}]'::jsonb,
'{}'::jsonb, ARRAY['gluten', 'dairy'], 2, false, false, 16, 18, '{"customizable": true}'::jsonb, true),

('11111111-1111-1111-1111-111111111017', 'Spicy Kathmandu', 'Nepalese-inspired with spiced chicken, onion, capsicum, and traditional spice blend', 19.99, 'pizza', 'local-specials', '/images/pizzas/spicy-kathmandu.jpg',
ARRAY['tomato sauce', 'mozzarella', 'spiced chicken', 'red onion', 'capsicum', 'Nepalese spices', 'cilantro'], 
'[{"size": "small", "price": 17.99}, {"size": "medium", "price": 19.99}, {"size": "large", "price": 22.99}, {"size": "family", "price": 25.99}]'::jsonb,
'{"halal": true, "spicy": true}'::jsonb, ARRAY['gluten', 'dairy'], 5, false, true, 17, 20, '{"customizable": true}'::jsonb, true),

-- BUILD YOUR OWN BASE
('11111111-1111-1111-1111-111111111018', 'Build Your Own Pizza', 'Create your perfect pizza with our fresh ingredients and premium toppings', 9.99, 'pizza', 'build-your-own', '/images/pizzas/build-your-own.jpg',
ARRAY['base price includes dough, sauce, and cheese'], 
'[{"size": "small", "price": 9.99}, {"size": "medium", "price": 12.99}, {"size": "large", "price": 15.99}, {"size": "family", "price": 18.99}]'::jsonb,
'{"customizable": true}'::jsonb, ARRAY[]::text[], 0, false, false, 18, 15, '{"fullyCustomizable": true}'::jsonb, true),

-- SIDES
('22222222-2222-2222-2222-222222222001', 'Garlic Bread', 'Freshly baked bread with garlic butter and herbs', 6.99, 'side', 'bread', '/images/sides/garlic-bread.jpg',
ARRAY['bread', 'garlic butter', 'herbs'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 1, 8, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222002', 'Cheesy Garlic Bread', 'Garlic bread topped with melted mozzarella cheese', 8.99, 'side', 'bread', '/images/sides/cheesy-garlic-bread.jpg',
ARRAY['bread', 'garlic butter', 'mozzarella', 'herbs'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 2, 10, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222003', 'Chicken Wings - Mild', 'Tender chicken wings with mild buffalo sauce (6 pieces)', 12.99, 'side', 'wings', '/images/sides/wings-mild.jpg',
ARRAY['chicken wings', 'mild buffalo sauce'], '[]'::jsonb,
'{"halal": true}'::jsonb, ARRAY[]::text[], 1, true, false, 3, 15, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222004', 'Chicken Wings - BBQ', 'Chicken wings glazed with smoky BBQ sauce (6 pieces)', 12.99, 'side', 'wings', '/images/sides/wings-bbq.jpg',
ARRAY['chicken wings', 'BBQ sauce'], '[]'::jsonb,
'{"halal": true}'::jsonb, ARRAY[]::text[], 1, false, false, 4, 15, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222005', 'Chicken Wings - Peri-Peri', 'Spicy peri-peri chicken wings for heat lovers (6 pieces)', 12.99, 'side', 'wings', '/images/sides/wings-peri-peri.jpg',
ARRAY['chicken wings', 'peri-peri sauce'], '[]'::jsonb,
'{"halal": true, "spicy": true}'::jsonb, ARRAY[]::text[], 4, false, false, 5, 15, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222006', 'Garden Salad', 'Fresh mixed greens, cherry tomatoes, cucumber, and balsamic dressing', 9.99, 'side', 'salad', '/images/sides/garden-salad.jpg',
ARRAY['mixed greens', 'cherry tomatoes', 'cucumber', 'red onion', 'balsamic dressing'], '[]'::jsonb,
'{"vegan": true, "vegetarian": true}'::jsonb, ARRAY[]::text[], 0, false, false, 6, 5, '{}'::jsonb, true),

('22222222-2222-2222-2222-222222222007', 'Caesar Salad', 'Crisp romaine lettuce, parmesan, croutons, and Caesar dressing', 11.99, 'side', 'salad', '/images/sides/caesar-salad.jpg',
ARRAY['romaine lettuce', 'parmesan', 'croutons', 'Caesar dressing'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy'], 0, true, false, 7, 5, '{}'::jsonb, true),

-- DRINKS
('33333333-3333-3333-3333-333333333001', 'Coca-Cola', 'Classic Coca-Cola', 2.99, 'drink', 'soft-drinks', '/images/drinks/coca-cola.jpg',
ARRAY['carbonated water', 'sugar', 'caffeine'], 
'[{"size": "330ml", "price": 2.99}, {"size": "1.25L", "price": 4.99}]'::jsonb,
'{"vegan": true}'::jsonb, ARRAY[]::text[], 0, true, false, 1, 1, '{}'::jsonb, true),

('33333333-3333-3333-3333-333333333002', 'Sprite', 'Refreshing lemon-lime soda', 2.99, 'drink', 'soft-drinks', '/images/drinks/sprite.jpg',
ARRAY['carbonated water', 'lemon-lime flavor'], 
'[{"size": "330ml", "price": 2.99}, {"size": "1.25L", "price": 4.99}]'::jsonb,
'{"vegan": true}'::jsonb, ARRAY[]::text[], 0, false, false, 2, 1, '{}'::jsonb, true),

('33333333-3333-3333-3333-333333333003', 'Orange Juice', 'Fresh squeezed orange juice', 3.99, 'drink', 'juices', '/images/drinks/orange-juice.jpg',
ARRAY['fresh oranges'], '[]'::jsonb,
'{"vegan": true, "vegetarian": true}'::jsonb, ARRAY[]::text[], 0, false, false, 3, 2, '{}'::jsonb, true),

('33333333-3333-3333-3333-333333333004', 'Sparkling Water', 'Premium sparkling mineral water', 2.49, 'drink', 'water', '/images/drinks/sparkling-water.jpg',
ARRAY['sparkling mineral water'], '[]'::jsonb,
'{"vegan": true}'::jsonb, ARRAY[]::text[], 0, false, false, 4, 1, '{}'::jsonb, true),

('33333333-3333-3333-3333-333333333005', 'Still Water', 'Premium still mineral water', 1.99, 'drink', 'water', '/images/drinks/still-water.jpg',
ARRAY['mineral water'], '[]'::jsonb,
'{"vegan": true}'::jsonb, ARRAY[]::text[], 0, false, false, 5, 1, '{}'::jsonb, true),

-- DESSERTS
('44444444-4444-4444-4444-444444444001', 'Tiramisu Cup', 'Classic Italian tiramisu in individual serving', 6.99, 'dessert', 'italian', '/images/desserts/tiramisu.jpg',
ARRAY['mascarpone', 'coffee', 'ladyfingers', 'cocoa'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy', 'eggs'], 0, true, false, 1, 2, '{}'::jsonb, true),

('44444444-4444-4444-4444-444444444002', 'Churros with Chocolate Dip', 'Crispy churros served with rich chocolate dipping sauce (4 pieces)', 7.99, 'dessert', 'spanish', '/images/desserts/churros.jpg',
ARRAY['churros', 'chocolate sauce', 'cinnamon sugar'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy', 'eggs'], 0, true, false, 2, 8, '{}'::jsonb, true),

('44444444-4444-4444-4444-444444444003', 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 8.99, 'dessert', 'cakes', '/images/desserts/lava-cake.jpg',
ARRAY['chocolate cake', 'vanilla ice cream'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['gluten', 'dairy', 'eggs'], 0, false, false, 3, 12, '{}'::jsonb, true),

('44444444-4444-4444-4444-444444444004', 'Gelato Tub - Vanilla', 'Premium Italian gelato (500ml tub)', 9.99, 'dessert', 'gelato', '/images/desserts/gelato-vanilla.jpg',
ARRAY['milk', 'cream', 'vanilla'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['dairy'], 0, false, false, 4, 1, '{}'::jsonb, true),

('44444444-4444-4444-4444-444444444005', 'Gelato Tub - Chocolate', 'Rich chocolate Italian gelato (500ml tub)', 9.99, 'dessert', 'gelato', '/images/desserts/gelato-chocolate.jpg',
ARRAY['milk', 'cream', 'chocolate'], '[]'::jsonb,
'{"vegetarian": true}'::jsonb, ARRAY['dairy'], 0, false, false, 5, 1, '{}'::jsonb, true),

-- DEALS
('55555555-5555-5555-5555-555555555001', 'Family Feast Deal', 'Any 2 large pizzas + garlic bread + 1.25L drink', 39.99, 'deal', 'family', '/images/deals/family-feast.jpg',
ARRAY['2 large pizzas', 'garlic bread', '1.25L drink'], '[]'::jsonb,
'{}'::jsonb, ARRAY[]::text[], 0, true, false, 1, 25, '{"dealItems": ["pizza", "pizza", "garlic-bread", "drink"]}'::jsonb, true),

('55555555-5555-5555-5555-555555555002', 'Lunch Special', 'Any small pizza + side + drink', 16.99, 'deal', 'lunch', '/images/deals/lunch-special.jpg',
ARRAY['small pizza', 'side', 'drink'], '[]'::jsonb,
'{}'::jsonb, ARRAY[]::text[], 0, true, false, 2, 15, '{"dealItems": ["pizza", "side", "drink"], "availableHours": "11:00-15:00"}'::jsonb, true),

('55555555-5555-5555-5555-555555555003', 'Date Night', '2 medium pizzas + 2 desserts + bottle of wine', 49.99, 'deal', 'special', '/images/deals/date-night.jpg',
ARRAY['2 medium pizzas', '2 desserts', 'bottle of wine'], '[]'::jsonb,
'{}'::jsonb, ARRAY[]::text[], 0, false, true, 3, 30, '{"dealItems": ["pizza", "pizza", "dessert", "dessert", "wine"], "minimumAge": 18}'::jsonb, true);

-- Note: Products table uses UUID primary keys, so no sequence update needed

-- Success message
SELECT 'Komorebi Pizza Shop menu data inserted successfully! ' || COUNT(*) || ' products added.' as status
FROM "Products";
