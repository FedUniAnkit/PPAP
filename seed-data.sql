-- Pizza Order App - Comprehensive Seed Data
-- Run this after creating the database schema

-- Clear existing data (in correct order due to foreign keys)
DELETE FROM "Messages";
DELETE FROM "NewsletterSubscriptions";
DELETE FROM "ContentBlocks";
DELETE FROM "Orders";
DELETE FROM "Products";
DELETE FROM "Promotions";
DELETE FROM "Users";

-- Reset sequences
ALTER SEQUENCE "Messages_id_seq" RESTART WITH 1;
ALTER SEQUENCE "NewsletterSubscriptions_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ContentBlocks_id_seq" RESTART WITH 1;

-- Insert Users (passwords are hashed for: admin123, staff123, customer123, etc.)
INSERT INTO "Users" (id, name, email, password, phone, address, role, "isActive", avatar) VALUES 
-- Admin Users
('550e8400-e29b-41d4-a716-446655440000', 'Admin Manager', 'admin@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0100', '{"street": "123 Admin St", "city": "Management City", "state": "MC", "zip": "12345", "country": "USA"}', 'admin', true, '/avatars/admin.jpg'),
('550e8400-e29b-41d4-a716-446655440001', 'Super Admin', 'superadmin@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0101', '{"street": "456 Super St", "city": "Admin City", "state": "AC", "zip": "12346", "country": "USA"}', 'admin', true, '/avatars/superadmin.jpg'),

-- Staff Users
('550e8400-e29b-41d4-a716-446655440010', 'Kitchen Manager', 'kitchen@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0110', '{"street": "789 Kitchen Ave", "city": "Cook City", "state": "CC", "zip": "12347", "country": "USA"}', 'staff', true, '/avatars/kitchen.jpg'),
('550e8400-e29b-41d4-a716-446655440011', 'Delivery Driver', 'driver@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0111', '{"street": "321 Delivery Rd", "city": "Speed City", "state": "SC", "zip": "12348", "country": "USA"}', 'staff', true, '/avatars/driver.jpg'),
('550e8400-e29b-41d4-a716-446655440012', 'Customer Service', 'support@komorebi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0112', '{"street": "654 Service Blvd", "city": "Help City", "state": "HC", "zip": "12349", "country": "USA"}', 'staff', true, '/avatars/support.jpg'),

-- Customer Users
('550e8400-e29b-41d4-a716-446655440020', 'John Smith', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0120', '{"street": "123 Main St", "city": "Anytown", "state": "AT", "zip": "12350", "country": "USA"}', 'customer', true, '/avatars/john.jpg'),
('550e8400-e29b-41d4-a716-446655440021', 'Sarah Johnson', 'sarah@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0121', '{"street": "456 Oak Ave", "city": "Somewhere", "state": "SW", "zip": "12351", "country": "USA"}', 'customer', true, '/avatars/sarah.jpg'),
('550e8400-e29b-41d4-a716-446655440022', 'Mike Davis', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0122', '{"street": "789 Pine Rd", "city": "Elsewhere", "state": "EW", "zip": "12352", "country": "USA"}', 'customer', true, '/avatars/mike.jpg'),
('550e8400-e29b-41d4-a716-446655440023', 'Emily Brown', 'emily@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0123', '{"street": "321 Elm St", "city": "Nowhere", "state": "NW", "zip": "12353", "country": "USA"}', 'customer', true, '/avatars/emily.jpg'),
('550e8400-e29b-41d4-a716-446655440024', 'David Wilson', 'david@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0124', '{"street": "654 Maple Ave", "city": "Everywhere", "state": "EV", "zip": "12354", "country": "USA"}', 'customer', true, '/avatars/david.jpg');

-- Insert Promotions
INSERT INTO "Promotions" (id, code, description, "discountType", amount, "startDate", "endDate", "isActive") VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'WELCOME10', '10% off your first order', 'percentage', 10.00, NOW() - INTERVAL '30 days', NOW() + INTERVAL '365 days', true),
('660e8400-e29b-41d4-a716-446655440001', 'PIZZA20', '20% off any pizza', 'percentage', 20.00, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', true),
('660e8400-e29b-41d4-a716-446655440002', 'SAVE5', '$5 off orders over $25', 'fixed', 5.00, NOW() - INTERVAL '14 days', NOW() + INTERVAL '60 days', true),
('660e8400-e29b-41d4-a716-446655440003', 'WEEKEND15', '15% off weekend orders', 'percentage', 15.00, NOW() - INTERVAL '3 days', NOW() + INTERVAL '90 days', true),
('660e8400-e29b-41d4-a716-446655440004', 'EXPIRED', 'Expired promotion', 'percentage', 25.00, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', false);

-- Insert Products
INSERT INTO "Products" (id, name, description, price, category, image, ingredients, sizes, "isAvailable", "preparationTime", "nutritionalInfo") VALUES 
-- Pizzas
('770e8400-e29b-41d4-a716-446655440000', 'Margherita Pizza', 'Classic Italian pizza with fresh tomato sauce, mozzarella cheese, and basil leaves', 12.99, 'pizza', '/images/pizzas/margherita.jpg', 
 ARRAY['tomato sauce', 'mozzarella cheese', 'fresh basil', 'olive oil'], 
 '[{"size": "small", "price": 10.99, "diameter": "10 inch"}, {"size": "medium", "price": 12.99, "diameter": "12 inch"}, {"size": "large", "price": 15.99, "diameter": "14 inch"}]'::jsonb, 
 true, 12, '{"calories": 250, "protein": 12, "carbs": 30, "fat": 10}'::jsonb),

('770e8400-e29b-41d4-a716-446655440001', 'Pepperoni Pizza', 'Traditional pizza topped with spicy pepperoni and mozzarella cheese', 14.99, 'pizza', '/images/pizzas/pepperoni.jpg', 
 ARRAY['tomato sauce', 'mozzarella cheese', 'pepperoni'], 
 '[{"size": "small", "price": 12.99, "diameter": "10 inch"}, {"size": "medium", "price": 14.99, "diameter": "12 inch"}, {"size": "large", "price": 17.99, "diameter": "14 inch"}]'::jsonb, 
 true, 15, '{"calories": 320, "protein": 15, "carbs": 32, "fat": 16}'::jsonb),

('770e8400-e29b-41d4-a716-446655440002', 'Supreme Pizza', 'Loaded with pepperoni, sausage, bell peppers, onions, and mushrooms', 18.99, 'pizza', '/images/pizzas/supreme.jpg', 
 ARRAY['tomato sauce', 'mozzarella cheese', 'pepperoni', 'italian sausage', 'bell peppers', 'onions', 'mushrooms'], 
 '[{"size": "small", "price": 16.99, "diameter": "10 inch"}, {"size": "medium", "price": 18.99, "diameter": "12 inch"}, {"size": "large", "price": 22.99, "diameter": "14 inch"}]'::jsonb, 
 true, 18, '{"calories": 380, "protein": 18, "carbs": 35, "fat": 20}'::jsonb),

('770e8400-e29b-41d4-a716-446655440003', 'Hawaiian Pizza', 'Sweet and savory combination of ham and pineapple', 16.99, 'pizza', '/images/pizzas/hawaiian.jpg', 
 ARRAY['tomato sauce', 'mozzarella cheese', 'ham', 'pineapple'], 
 '[{"size": "small", "price": 14.99, "diameter": "10 inch"}, {"size": "medium", "price": 16.99, "diameter": "12 inch"}, {"size": "large", "price": 19.99, "diameter": "14 inch"}]'::jsonb, 
 true, 14, '{"calories": 290, "protein": 14, "carbs": 33, "fat": 12}'::jsonb),

('770e8400-e29b-41d4-a716-446655440004', 'Veggie Deluxe', 'Fresh vegetables including bell peppers, mushrooms, onions, tomatoes, and olives', 15.99, 'pizza', '/images/pizzas/veggie.jpg', 
 ARRAY['tomato sauce', 'mozzarella cheese', 'bell peppers', 'mushrooms', 'red onions', 'tomatoes', 'black olives'], 
 '[{"size": "small", "price": 13.99, "diameter": "10 inch"}, {"size": "medium", "price": 15.99, "diameter": "12 inch"}, {"size": "large", "price": 18.99, "diameter": "14 inch"}]'::jsonb, 
 true, 16, '{"calories": 240, "protein": 10, "carbs": 32, "fat": 8}'::jsonb),

-- Appetizers
('770e8400-e29b-41d4-a716-446655440010', 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese', 8.99, 'appetizer', '/images/appetizers/caesar-salad.jpg', 
 ARRAY['romaine lettuce', 'caesar dressing', 'croutons', 'parmesan cheese'], 
 '[]'::jsonb, true, 5, '{"calories": 180, "protein": 8, "carbs": 12, "fat": 12}'::jsonb),

('770e8400-e29b-41d4-a716-446655440011', 'Garlic Bread', 'Toasted bread with garlic butter and herbs', 6.99, 'appetizer', '/images/appetizers/garlic-bread.jpg', 
 ARRAY['bread', 'garlic', 'butter', 'parsley'], 
 '[]'::jsonb, true, 8, '{"calories": 220, "protein": 6, "carbs": 28, "fat": 10}'::jsonb),

('770e8400-e29b-41d4-a716-446655440012', 'Buffalo Wings', 'Spicy chicken wings served with ranch dressing', 11.99, 'appetizer', '/images/appetizers/buffalo-wings.jpg', 
 ARRAY['chicken wings', 'buffalo sauce', 'ranch dressing'], 
 '[{"size": "6 pieces", "price": 9.99}, {"size": "12 pieces", "price": 11.99}, {"size": "18 pieces", "price": 16.99}]'::jsonb, 
 true, 12, '{"calories": 340, "protein": 22, "carbs": 4, "fat": 26}'::jsonb),

('770e8400-e29b-41d4-a716-446655440013', 'Mozzarella Sticks', 'Crispy breaded mozzarella with marinara sauce', 7.99, 'appetizer', '/images/appetizers/mozzarella-sticks.jpg', 
 ARRAY['mozzarella cheese', 'breadcrumbs', 'marinara sauce'], 
 '[]'::jsonb, true, 10, '{"calories": 280, "protein": 14, "carbs": 20, "fat": 16}'::jsonb),

-- Drinks
('770e8400-e29b-41d4-a716-446655440020', 'Coca Cola', 'Classic refreshing cola', 2.99, 'drink', '/images/drinks/coca-cola.jpg', 
 ARRAY['carbonated water', 'sugar', 'caffeine', 'natural flavors'], 
 '[{"size": "small", "price": 1.99, "volume": "12 oz"}, {"size": "medium", "price": 2.99, "volume": "16 oz"}, {"size": "large", "price": 3.99, "volume": "20 oz"}]'::jsonb, 
 true, 1, '{"calories": 140, "protein": 0, "carbs": 39, "fat": 0}'::jsonb),

('770e8400-e29b-41d4-a716-446655440021', 'Pepsi', 'Bold and refreshing cola', 2.99, 'drink', '/images/drinks/pepsi.jpg', 
 ARRAY['carbonated water', 'sugar', 'caffeine', 'natural flavors'], 
 '[{"size": "small", "price": 1.99, "volume": "12 oz"}, {"size": "medium", "price": 2.99, "volume": "16 oz"}, {"size": "large", "price": 3.99, "volume": "20 oz"}]'::jsonb, 
 true, 1, '{"calories": 150, "protein": 0, "carbs": 41, "fat": 0}'::jsonb),

('770e8400-e29b-41d4-a716-446655440022', 'Orange Juice', 'Fresh squeezed orange juice', 3.99, 'drink', '/images/drinks/orange-juice.jpg', 
 ARRAY['fresh oranges'], 
 '[{"size": "small", "price": 2.99, "volume": "8 oz"}, {"size": "medium", "price": 3.99, "volume": "12 oz"}, {"size": "large", "price": 4.99, "volume": "16 oz"}]'::jsonb, 
 true, 2, '{"calories": 110, "protein": 2, "carbs": 26, "fat": 0}'::jsonb),

('770e8400-e29b-41d4-a716-446655440023', 'Iced Tea', 'Refreshing iced tea with lemon', 2.49, 'drink', '/images/drinks/iced-tea.jpg', 
 ARRAY['black tea', 'lemon', 'ice'], 
 '[{"size": "small", "price": 1.99, "volume": "12 oz"}, {"size": "medium", "price": 2.49, "volume": "16 oz"}, {"size": "large", "price": 3.49, "volume": "20 oz"}]'::jsonb, 
 true, 1, '{"calories": 70, "protein": 0, "carbs": 18, "fat": 0}'::jsonb),

-- Desserts
('770e8400-e29b-41d4-a716-446655440030', 'Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 6.99, 'dessert', '/images/desserts/chocolate-cake.jpg', 
 ARRAY['chocolate', 'flour', 'eggs', 'butter', 'sugar'], 
 '[]'::jsonb, true, 3, '{"calories": 450, "protein": 6, "carbs": 65, "fat": 20}'::jsonb),

('770e8400-e29b-41d4-a716-446655440031', 'Cheesecake', 'Creamy New York style cheesecake', 7.99, 'dessert', '/images/desserts/cheesecake.jpg', 
 ARRAY['cream cheese', 'graham crackers', 'eggs', 'sugar'], 
 '[]'::jsonb, true, 2, '{"calories": 410, "protein": 8, "carbs": 35, "fat": 28}'::jsonb),

('770e8400-e29b-41d4-a716-446655440032', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 8.99, 'dessert', '/images/desserts/tiramisu.jpg', 
 ARRAY['mascarpone', 'ladyfingers', 'coffee', 'cocoa powder'], 
 '[]'::jsonb, true, 4, '{"calories": 380, "protein": 7, "carbs": 42, "fat": 20}'::jsonb),

('770e8400-e29b-41d4-a716-446655440033', 'Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and whipped cream', 5.99, 'dessert', '/images/desserts/ice-cream-sundae.jpg', 
 ARRAY['vanilla ice cream', 'chocolate sauce', 'whipped cream', 'cherry'], 
 '[]'::jsonb, true, 2, '{"calories": 320, "protein": 5, "carbs": 45, "fat": 14}'::jsonb);

-- Insert Sample Orders
INSERT INTO "Orders" (id, "orderNumber", "customerId", items, "totalAmount", status, "paymentStatus", "paymentMethod", "deliveryAddress", "customerNotes", "promotionId") VALUES 
('880e8400-e29b-41d4-a716-446655440000', 'ORD-2024-001', '550e8400-e29b-41d4-a716-446655440020', 
 '[{"productId": "770e8400-e29b-41d4-a716-446655440000", "name": "Margherita Pizza", "size": "medium", "price": 12.99, "quantity": 1}, {"productId": "770e8400-e29b-41d4-a716-446655440020", "name": "Coca Cola", "size": "medium", "price": 2.99, "quantity": 2}]'::jsonb, 
 18.97, 'delivered', 'paid', 'card', 
 '{"street": "123 Main St", "city": "Anytown", "state": "AT", "zip": "12350", "country": "USA"}'::jsonb, 
 'Please ring doorbell', '660e8400-e29b-41d4-a716-446655440000'),

('880e8400-e29b-41d4-a716-446655440001', 'ORD-2024-002', '550e8400-e29b-41d4-a716-446655440021', 
 '[{"productId": "770e8400-e29b-41d4-a716-446655440001", "name": "Pepperoni Pizza", "size": "large", "price": 17.99, "quantity": 1}, {"productId": "770e8400-e29b-41d4-a716-446655440010", "name": "Caesar Salad", "price": 8.99, "quantity": 1}]'::jsonb, 
 26.98, 'preparing', 'paid', 'online', 
 '{"street": "456 Oak Ave", "city": "Somewhere", "state": "SW", "zip": "12351", "country": "USA"}'::jsonb, 
 'Extra cheese please', NULL),

('880e8400-e29b-41d4-a716-446655440002', 'ORD-2024-003', '550e8400-e29b-41d4-a716-446655440022', 
 '[{"productId": "770e8400-e29b-41d4-a716-446655440002", "name": "Supreme Pizza", "size": "medium", "price": 18.99, "quantity": 1}, {"productId": "770e8400-e29b-41d4-a716-446655440012", "name": "Buffalo Wings", "size": "12 pieces", "price": 11.99, "quantity": 1}]'::jsonb, 
 30.98, 'ready', 'paid', 'card', 
 '{"street": "789 Pine Rd", "city": "Elsewhere", "state": "EW", "zip": "12352", "country": "USA"}'::jsonb, 
 'Call when ready for pickup', '660e8400-e29b-41d4-a716-446655440001');

-- Insert Content Blocks
INSERT INTO "ContentBlocks" (slug, title, type, content, "lastUpdatedBy") VALUES 
('welcome-message', 'Welcome Message', 'html', '<h2>Welcome to Komorebi Pizza!</h2><p>Experience the finest Italian cuisine with our authentic recipes and fresh ingredients. Order now for fast delivery!</p>', '550e8400-e29b-41d4-a716-446655440000'),
('contact-info', 'Contact Information', 'json', '{"phone": "+1-555-PIZZA", "email": "info@komorebi.com", "address": "123 Pizza Street, Food City, FC 12345", "hours": "Mon-Sun: 11:00 AM - 11:00 PM"}', '550e8400-e29b-41d4-a716-446655440000'),
('about-us', 'About Us', 'markdown', '# About Komorebi Pizza\n\nFounded in 2020, Komorebi Pizza brings authentic Italian flavors to your doorstep. Our master chefs use only the finest ingredients imported directly from Italy.\n\n## Our Mission\nTo deliver happiness one pizza at a time.\n\n## Our Values\n- Quality ingredients\n- Fast delivery\n- Customer satisfaction', '550e8400-e29b-41d4-a716-446655440000'),
('delivery-policy', 'Delivery Policy', 'text', 'Free delivery on orders over $20. Standard delivery time is 30-45 minutes. We deliver within a 10-mile radius of our location.', '550e8400-e29b-41d4-a716-446655440000'),
('privacy-policy', 'Privacy Policy', 'html', '<h3>Privacy Policy</h3><p>We respect your privacy and protect your personal information. We do not share your data with third parties without your consent.</p><p>Last updated: January 2024</p>', '550e8400-e29b-41d4-a716-446655440000');

-- Insert Newsletter Subscriptions
INSERT INTO "NewsletterSubscriptions" (email, "isActive") VALUES 
('john@example.com', true),
('sarah@example.com', true),
('mike@example.com', true),
('emily@example.com', false),
('newsletter1@test.com', true),
('newsletter2@test.com', true),
('newsletter3@test.com', false);

-- Insert Messages (customer-staff communication)
INSERT INTO "Messages" ("orderId", "senderId", "receiverId", content, "isRead") VALUES 
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'Hi, can you please make sure the pizza is well done?', true),
('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', 'Absolutely! We will make sure your pizza is well done. Thanks for your order!', true),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'What is the estimated delivery time for my order?', true),
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440021', 'Your order should be ready in about 20 minutes. Thank you for your patience!', false),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'I will be there in 10 minutes to pick up my order', false);

-- Success message
SELECT 'Seed data inserted successfully! All tables now have comprehensive sample data.' as status;
