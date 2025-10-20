-- Sample Data for Food Delivery App
-- This file contains realistic test data for development and testing
-- Execute this AFTER running database-schema-clean.sql

-- ==============================================
-- 1. CATEGORIES
-- ==============================================

INSERT INTO categories (id, name, slug, icon, display_order, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Cơm', 'com', '🍚', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Phở & Bún', 'pho-bun', '🍜', 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'Bánh mì & Bánh ngọt', 'banh-mi-banh-ngot', '🥖', 3, true),
('550e8400-e29b-41d4-a716-446655440004', 'Gà rán & Burger', 'ga-ran-burger', '🍔', 4, true),
('550e8400-e29b-41d4-a716-446655440005', 'Pizza & Pasta', 'pizza-pasta', '🍕', 5, true),
('550e8400-e29b-41d4-a716-446655440006', 'Trà sữa & Cà phê', 'tra-sua-ca-phe', '🧋', 6, true),
('550e8400-e29b-41d4-a716-446655440007', 'Đồ ăn vặt', 'do-an-vat', '🍿', 7, true),
('550e8400-e29b-41d4-a716-446655440008', 'Lẩu & Nướng', 'lau-nuong', '🍲', 8, true);

-- ==============================================
-- 2. RESTAURANTS
-- ==============================================

INSERT INTO restaurants (
  id, name, slug, description, logo, cover_image,
  address, phone, email, latitude, longitude,
  cuisines, rating, delivery_time_min, delivery_time_max,
  minimum_order, delivery_fee, free_delivery_threshold,
  operating_hours, is_open, is_featured, is_verified,
  has_promotion, is_active
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440011',
  'Cơm Tấm Sườn Bì Chả',
  'com-tam-suon-bi-cha',
  'Cơm tấm truyền thống ngon, giá rẻ. Món ăn đặc trưng của Sài Gòn với sườn nướng thơm lừng.',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
  '123 Nguyễn Trãi, Quận 1, TP.HCM',
  '0901234567',
  'contact@comtam.vn',
  10.7692,
  106.6828,
  ARRAY['Việt Nam', 'Cơm'],
  4.5,
  15,
  25,
  30000,
  15000,
  100000,
  '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "06:00", "close": "23:00"}, "sunday": {"open": "06:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Phở Hà Nội Truyền Thống',
  'pho-ha-noi-truyen-thong',
  'Phở bò Hà Nội chính gốc, nước dùng ninh từ xương trong 8 tiếng. Thịt bò tươi mỗi ngày.',
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd',
  '456 Lê Lợi, Quận 3, TP.HCM',
  '0902345678',
  'contact@phohanoi.vn',
  10.7765,
  106.6906,
  ARRAY['Việt Nam', 'Phở'],
  4.7,
  20,
  30,
  40000,
  15000,
  150000,
  '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "23:00"}, "saturday": {"open": "05:30", "close": "23:30"}, "sunday": {"open": "05:30", "close": "23:30"}}'::jsonb,
  true,
  true,
  true,
  false,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  'KFC - Kentucky Fried Chicken',
  'kfc-kentucky-fried-chicken',
  'Gà rán KFC với công thức bí mật 11 loại gia vị. Giao hàng nhanh chóng, món ăn luôn nóng giòn.',
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
  'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb',
  '789 Võ Văn Tần, Quận 3, TP.HCM',
  '1800-0088',
  'contact@kfc.vn',
  10.7808,
  106.6893,
  ARRAY['Gà rán', 'Fastfood', 'Mỹ'],
  4.3,
  25,
  35,
  50000,
  20000,
  120000,
  '{"monday": {"open": "09:00", "close": "22:00"}, "tuesday": {"open": "09:00", "close": "22:00"}, "wednesday": {"open": "09:00", "close": "22:00"}, "thursday": {"open": "09:00", "close": "22:00"}, "friday": {"open": "09:00", "close": "23:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "sunday": {"open": "09:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440014',
  'Pizza 4P''s',
  'pizza-4ps',
  'Pizza Ý cao cấp với phô mai tươi làm tại Đà Lạt. Không gian sang trọng, phục vụ chuyên nghiệp.',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f',
  '234 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
  '0903456789',
  'contact@pizza4ps.com',
  10.7834,
  106.6918,
  ARRAY['Pizza', 'Ý', 'Pasta'],
  4.8,
  30,
  45,
  100000,
  25000,
  200000,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "22:00"}}'::jsonb,
  true,
  true,
  true,
  false,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440015',
  'Trà Sữa Gongcha',
  'tra-sua-gongcha',
  'Trà sữa Đài Loan chính hiệu. Nguyên liệu cao cấp, pha chế thủ công, nhiều topping hấp dẫn.',
  'https://images.unsplash.com/photo-1525385133512-2f3bdd039054',
  'https://images.unsplash.com/photo-1576092768234-b3e0649b0741',
  '567 Pasteur, Quận 1, TP.HCM',
  '0904567890',
  'contact@gongcha.vn',
  10.7722,
  106.6972,
  ARRAY['Trà sữa', 'Đồ uống', 'Đài Loan'],
  4.4,
  10,
  20,
  25000,
  10000,
  80000,
  '{"monday": {"open": "08:00", "close": "22:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "friday": {"open": "08:00", "close": "23:00"}, "saturday": {"open": "08:00", "close": "23:00"}, "sunday": {"open": "08:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440016',
  'Lẩu Thái Tomyum Kungfu',
  'lau-thai-tomyum-kungfu',
  'Lẩu Thái chua cay đúng vị, tôm tươi hải sản tươi sống. Gia vị nhập khẩu từ Thái Lan.',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246',
  'https://images.unsplash.com/photo-1569058242252-92a3b86fc18f',
  '890 Cách Mạng Tháng 8, Quận 10, TP.HCM',
  '0905678901',
  'contact@tomyumkungfu.vn',
  10.7720,
  106.6661,
  ARRAY['Lẩu', 'Thái Lan', 'Hải sản'],
  4.6,
  35,
  50,
  150000,
  30000,
  300000,
  '{"monday": {"open": "10:00", "close": "22:00"}, "tuesday": {"open": "10:00", "close": "22:00"}, "wednesday": {"open": "10:00", "close": "22:00"}, "thursday": {"open": "10:00", "close": "22:00"}, "friday": {"open": "10:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "23:00"}}'::jsonb,
  true,
  false,
  true,
  true,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440017',
  'Bánh Mì 37 Nguyễn Trãi',
  'banh-mi-37-nguyen-trai',
  'Bánh mì Sài Gòn nổi tiếng với nhân đầy đặn, giá cả phải chăng. Bán từ sáng sớm đến đêm khuya.',
  'https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181',
  'https://images.unsplash.com/photo-1608039829572-78524f79c4c7',
  '37 Nguyễn Trãi, Quận 1, TP.HCM',
  '0906789012',
  'contact@banhmi37.vn',
  10.7688,
  106.6845,
  ARRAY['Bánh mì', 'Việt Nam', 'Ăn sáng'],
  4.5,
  10,
  15,
  15000,
  10000,
  50000,
  '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "23:00"}, "saturday": {"open": "06:00", "close": "23:00"}, "sunday": {"open": "06:00", "close": "23:00"}}'::jsonb,
  true,
  false,
  true,
  false,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440018',
  'Highlands Coffee',
  'highlands-coffee',
  'Chuỗi cà phê Việt Nam hàng đầu. Cà phê phin truyền thống và các món đồ uống hiện đại.',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348',
  '123 Hai Bà Trưng, Quận 1, TP.HCM',
  '1800-6083',
  'contact@highlandscoffee.vn',
  10.7714,
  106.6983,
  ARRAY['Cà phê', 'Đồ uống', 'Việt Nam'],
  4.4,
  15,
  25,
  30000,
  15000,
  100000,
  '{"monday": {"open": "07:00", "close": "22:00"}, "tuesday": {"open": "07:00", "close": "22:00"}, "wednesday": {"open": "07:00", "close": "22:00"}, "thursday": {"open": "07:00", "close": "22:00"}, "friday": {"open": "07:00", "close": "23:00"}, "saturday": {"open": "07:00", "close": "23:00"}, "sunday": {"open": "07:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  false,
  true
);

-- ==============================================
-- 3. DISHES
-- ==============================================

-- Dishes for Cơm Tấm Sườn Bì Chả
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, original_price, calories,
  is_available, is_vegetarian, is_spicy, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440001',
  'Cơm Tấm Sườn Bì Chả Trứng',
  'com-tam-suon-bi-cha-trung',
  'Cơm tấm sườn nướng + bì + chả trứng + mỡ hành + dưa góp. Đặc sản Sài Gòn.',
  ARRAY['https://images.unsplash.com/photo-1603133872878-684f208fb84b'],
  45000,
  50000,
  650,
  true,
  false,
  false,
  15
),
(
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440001',
  'Cơm Tấm Sườn Nướng',
  'com-tam-suon-nuong',
  'Cơm tấm sườn nướng thơm lừng, chấm nước mắm chua ngọt đậm đà.',
  ARRAY['https://images.unsplash.com/photo-1603133872878-684f208fb84b'],
  35000,
  40000,
  550,
  true,
  false,
  false,
  12
),
(
  '550e8400-e29b-41d4-a716-446655440023',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440001',
  'Cơm Gà Nướng Sả',
  'com-ga-nuong-sa',
  'Cơm gà nướng sả ớt thơm ngon, không ngấy. Đi kèm rau sống và nước chấm đặc biệt.',
  ARRAY['https://images.unsplash.com/photo-1598103442097-8b74394b95c6'],
  40000,
  NULL,
  580,
  true,
  false,
  true,
  15
);

-- Dishes for Phở Hà Nội
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, is_vegetarian, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440024',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440002',
  'Phở Bò Tái',
  'pho-bo-tai',
  'Phở bò tái nạm, nước dùng trong vắt từ xương bò ninh 8 tiếng. Thịt bò tươi mỗi ngày.',
  ARRAY['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'],
  60000,
  520,
  true,
  false,
  20
),
(
  '550e8400-e29b-41d4-a716-446655440025',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440002',
  'Phở Bò Chín',
  'pho-bo-chin',
  'Phở bò chín với thịt bò chín mềm, nạm, gân, sách. Đầy đặn và thơm ngon.',
  ARRAY['https://images.unsplash.com/photo-1547592166-23ac45744acd'],
  65000,
  580,
  true,
  false,
  20
),
(
  '550e8400-e29b-41d4-a716-446655440026',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440002',
  'Phở Gà',
  'pho-ga',
  'Phở gà nước trong, thịt gà thơm ngon. Phù hợp cho người ăn nhẹ.',
  ARRAY['https://images.unsplash.com/photo-1585032226651-759b368d7246'],
  55000,
  450,
  true,
  false,
  18
);

-- Dishes for KFC
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, original_price, calories,
  is_available, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440027',
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440004',
  'Combo Gà Rán 3 Miếng',
  'combo-ga-ran-3-mieng',
  '3 miếng gà giòn + 1 khoai tây chiên + 1 nước ngọt. Nóng giòn, thơm ngon.',
  ARRAY['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec'],
  99000,
  120000,
  850,
  true,
  15
),
(
  '550e8400-e29b-41d4-a716-446655440028',
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440004',
  'Burger Tôm',
  'burger-tom',
  'Burger tôm giòn với sốt đặc biệt, rau tươi và bánh mì nướng giòn.',
  ARRAY['https://images.unsplash.com/photo-1550547660-d9450f859349'],
  65000,
  NULL,
  520,
  true,
  10
);

-- Dishes for Pizza 4P's
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, is_vegetarian, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440029',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440005',
  'Pizza Margherita',
  'pizza-margherita',
  'Pizza truyền thống Ý với sốt cà chua, phô mai mozzarella Đà Lạt, húng quế tươi.',
  ARRAY['https://images.unsplash.com/photo-1574071318508-1cdbab80d002'],
  150000,
  720,
  true,
  true,
  20
),
(
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440005',
  'Pizza Bò & Nấm',
  'pizza-bo-nam',
  'Pizza thịt bò xay, nấm tươi, phô mai 3 lớp. Đậm đà hương vị.',
  ARRAY['https://images.unsplash.com/photo-1513104890138-7c749659a591'],
  180000,
  850,
  true,
  false,
  25
),
(
  '550e8400-e29b-41d4-a716-446655440031',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440005',
  'Pasta Carbonara',
  'pasta-carbonara',
  'Mì Ý Carbonara với thịt xông khói, kem tươi, phô mai Parmesan.',
  ARRAY['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9'],
  120000,
  680,
  true,
  false,
  18
);

-- Dishes for Trà Sữa Gongcha
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, is_vegetarian, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440032',
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440006',
  'Trà Sữa Ô Long',
  'tra-sua-o-long',
  'Trà Ô Long Đài Loan + sữa tươi + trân châu đen. Thơm ngon, không ngấy.',
  ARRAY['https://images.unsplash.com/photo-1525385133512-2f3bdd039054'],
  45000,
  350,
  true,
  true,
  8
),
(
  '550e8400-e29b-41d4-a716-446655440033',
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440006',
  'Trà Sữa Truyền Thống',
  'tra-sua-truyen-thong',
  'Trà đen Assam + sữa tươi. Hương vị truyền thống, ngọt vừa phải.',
  ARRAY['https://images.unsplash.com/photo-1576092768234-b3e0649b0741'],
  40000,
  320,
  true,
  true,
  5
);

-- Dishes for Lẩu Thái
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, is_spicy, spice_level, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440034',
  '550e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440008',
  'Lẩu Tomyum Hải Sản',
  'lau-tomyum-hai-san',
  'Lẩu Thái chua cay với tôm, mực, cá, nghêu. Gia vị nhập khẩu Thái Lan.',
  ARRAY['https://images.unsplash.com/photo-1585032226651-759b368d7246'],
  250000,
  900,
  true,
  true,
  3,
  30
);

-- Dishes for Bánh Mì
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440035',
  '550e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440003',
  'Bánh Mì Thịt',
  'banh-mi-thit',
  'Bánh mì pate, chả lụa, xúc xích, dưa leo, rau mùi. Đầy đặn và thơm ngon.',
  ARRAY['https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181'],
  25000,
  420,
  true,
  5
),
(
  '550e8400-e29b-41d4-a716-446655440036',
  '550e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440003',
  'Bánh Mì Trứng',
  'banh-mi-trung',
  'Bánh mì trứng ốp la, pate, dưa leo. Giá rẻ, no bụng.',
  ARRAY['https://images.unsplash.com/photo-1608039829572-78524f79c4c7'],
  20000,
  380,
  true,
  5
);

-- Dishes for Highlands Coffee
INSERT INTO dishes (
  id, restaurant_id, category_id, name, slug, description,
  images, price, calories,
  is_available, is_vegetarian, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440037',
  '550e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440006',
  'Phin Sữa Đá',
  'phin-sua-da',
  'Cà phê phin truyền thống pha với sữa đặc. Đậm đà, thơm ngon.',
  ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'],
  35000,
  180,
  true,
  true,
  10
),
(
  '550e8400-e29b-41d4-a716-446655440038',
  '550e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440006',
  'Freeze Trà Xanh',
  'freeze-tra-xanh',
  'Đá xay trà xanh với kem tươi. Mát lạnh, thơm ngon.',
  ARRAY['https://images.unsplash.com/photo-1556679343-c7306c1976bc'],
  50000,
  280,
  true,
  true,
  8
);

-- ==============================================
-- 4. COUPONS
-- ==============================================

INSERT INTO coupons (
  id, code, title, description,
  discount_type, discount_value, max_discount,
  minimum_order, applicable_to,
  usage_limit, used_count,
  valid_from, valid_to,
  is_active
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440041',
  'NEWUSER50',
  'Mã giảm 50K cho khách hàng mới',
  'Giảm ngay 50.000đ cho đơn hàng đầu tiên từ 100.000đ',
  'fixed',
  50000,
  50000,
  100000,
  'first_order',
  1000,
  234,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '30 days',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440042',
  'FREESHIP30',
  'Miễn phí ship cho đơn từ 150K',
  'Không phải trả phí giao hàng cho đơn từ 150.000đ',
  'free_shipping',
  30000,
  30000,
  150000,
  'all',
  5000,
  1456,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '60 days',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440043',
  'PIZZA20',
  'Giảm 20% cho Pizza 4P''s',
  'Giảm 20% tối đa 80.000đ cho đơn hàng Pizza 4P''s',
  'percentage',
  20,
  80000,
  200000,
  'restaurant',
  300,
  87,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days',
  true
);

-- Update restaurant_ids for Pizza coupon
UPDATE coupons 
SET restaurant_ids = ARRAY['550e8400-e29b-41d4-a716-446655440014']
WHERE code = 'PIZZA20';

-- ==============================================
-- 5. SAMPLE PROFILES (for testing)
-- ==============================================

-- Note: In real production, profiles are created by trigger when user signs up via Supabase Auth
-- This is just sample data structure - you'll need real auth.users UUIDs

INSERT INTO profiles (
  id, full_name, email, phone,
  avatar_url, date_of_birth,
  total_orders, total_spent,
  preferences
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440051',
  'Nguyễn Văn An',
  'nguyenvanan@example.com',
  '0901234567',
  'https://i.pravatar.cc/150?img=1',
  '1995-03-15',
  15,
  2500000,
  '{"favorite_cuisines": ["Việt Nam", "Pizza"], "dietary_restrictions": [], "preferred_payment": "momo"}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440052',
  'Trần Thị Bình',
  'tranthibinh@example.com',
  '0902345678',
  'https://i.pravatar.cc/150?img=2',
  '1998-07-22',
  8,
  1200000,
  '{"favorite_cuisines": ["Trà sữa", "Gà rán"], "dietary_restrictions": ["vegetarian"], "preferred_payment": "cod"}'::jsonb
);

-- ==============================================
-- 6. SAMPLE ADDRESSES
-- ==============================================

INSERT INTO addresses (
  id, user_id, label, recipient_name, recipient_phone,
  address_line1, ward, district, city,
  latitude, longitude,
  is_default
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440061',
  '550e8400-e29b-41d4-a716-446655440051',
  'Nhà riêng',
  'Nguyễn Văn An',
  '0901234567',
  '123 Nguyễn Văn Cừ',
  'Phường 1',
  'Quận 5',
  'TP.HCM',
  10.7565,
  106.6758,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440062',
  '550e8400-e29b-41d4-a716-446655440051',
  'Công ty',
  'Nguyễn Văn An',
  '0901234567',
  '456 Lý Thường Kiệt',
  'Phường 14',
  'Quận 10',
  'TP.HCM',
  10.7722,
  106.6654,
  false
);

-- ==============================================
-- NOTES FOR TESTING
-- ==============================================

-- After inserting this sample data, you can test:
-- 
-- 1. Create orders:
--    - Use sample user IDs and address IDs
--    - Pick dishes from different restaurants
--    - Test with/without coupons
--
-- 2. Add to favorites:
--    INSERT INTO favorites (user_id, restaurant_id) VALUES 
--    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440011');
--
-- 3. Create reviews after orders:
--    - Reviews must be linked to an order
--    - One review per order (enforced by UNIQUE constraint)
--
-- 4. Test search:
--    - Full-text search on restaurant names, dish names
--    - Filter by category, cuisines, price range
--    - Sort by rating, distance, delivery time
--
-- 5. Test RLS policies:
--    - Users can only see their own orders, addresses
--    - Users can only create/update their own data
--    - Public can see restaurants, dishes, categories
--
-- 6. Test triggers:
--    - Order numbers auto-generated
--    - Restaurant ratings auto-calculated from reviews
--    - Profile stats updated on order completion
--
-- 7. Test views:
--    SELECT * FROM dishes_with_restaurant WHERE restaurant_name LIKE '%Pizza%';
--    SELECT * FROM restaurants_with_stats ORDER BY order_count DESC LIMIT 10;
--    SELECT * FROM popular_dishes LIMIT 20;

-- ==============================================
-- SAMPLE ORDER (optional - for complete testing)
-- ==============================================

-- Uncomment to create a sample order:
/*
INSERT INTO orders (
  id, user_id, restaurant_id, address_id,
  subtotal, delivery_fee, service_fee, tax,
  total_amount, status, payment_method, payment_status,
  delivery_address, delivery_note
) VALUES (
  '550e8400-e29b-41d4-a716-446655440071',
  '550e8400-e29b-41d4-a716-446655440051',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440061',
  80000,
  15000,
  5000,
  5000,
  105000,
  'pending',
  'momo',
  'pending',
  '123 Nguyễn Văn Cừ, Phường 1, Quận 5, TP.HCM',
  'Giao trước 12h trưa. Gọi trước khi đến.'
);

INSERT INTO order_items (
  id, order_id, dish_id, quantity, unit_price,
  dish_name, dish_image
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440081',
  '550e8400-e29b-41d4-a716-446655440071',
  '550e8400-e29b-41d4-a716-446655440021',
  1,
  45000,
  'Cơm Tấm Sườn Bì Chả Trứng',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b'
),
(
  '550e8400-e29b-41d4-a716-446655440082',
  '550e8400-e29b-41d4-a716-446655440071',
  '550e8400-e29b-41d4-a716-446655440022',
  1,
  35000,
  'Cơm Tấm Sườn Nướng',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b'
);
*/
