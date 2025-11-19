-- ============================================
-- SAMPLE DATA FOR FOOD DELIVERY APP
-- ============================================
-- Execute this AFTER running database-schema-clean.sql
-- This file contains realistic Vietnamese restaurant test data
-- ============================================

-- ==============================================
-- 1. RESTAURANTS (5 restaurants)
-- ==============================================

INSERT INTO restaurants (
  id, name, slug, description, logo, cover_image,
  phone, email, website,
  address, city, district, latitude, longitude,
  categories, cuisines,
  rating, review_count, order_count,
  delivery_time_min, delivery_time_max,
  delivery_fee, minimum_order, free_delivery_threshold,
  operating_hours,
  is_open, is_featured, is_verified, is_active,
  has_promotion, promotion_text, promotion_discount
) VALUES
-- Restaurant 1: Cơm Tấm Sườn Bì Chả
(
  '550e8400-e29b-41d4-a716-446655440011',
  'Cơm Tấm Sườn Bì Chả',
  'com-tam-suon-bi-cha',
  'Cơm tấm truyền thống ngon, giá rẻ. Món ăn đặc trưng của Sài Gòn với sườn nướng thơm lừng.',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
  '0901234567',
  'contact@comtam.vn',
  NULL,
  '123 Nguyễn Trãi, Quận 1, TP.HCM',
  'TP.HCM',
  'Quận 1',
  10.7692,
  106.6828,
  ARRAY['Cơm', 'Việt Nam', 'Ăn trưa'],
  ARRAY['Việt Nam', 'Cơm tấm'],
  4.5,
  127,
  543,
  15,
  25,
  15000,
  30000,
  100000,
  '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "06:00", "close": "23:00"}, "sunday": {"open": "06:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  true,
  'Giảm 15% cho đơn hàng đầu tiên',
  15
),
-- Restaurant 2: Phở Hà Nội Truyền Thống
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Phở Hà Nội Truyền Thống',
  'pho-ha-noi-truyen-thong',
  'Phở bò Hà Nội chính gốc, nước dùng ninh từ xương trong 8 tiếng. Thịt bò tươi mỗi ngày.',
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd',
  '0902345678',
  'contact@phohanoi.vn',
  'https://phohanoi.vn',
  '456 Lê Lợi, Quận 3, TP.HCM',
  'TP.HCM',
  'Quận 3',
  10.7765,
  106.6906,
  ARRAY['Phở', 'Bún', 'Việt Nam'],
  ARRAY['Việt Nam', 'Phở', 'Bún bò'],
  4.7,
  289,
  1024,
  20,
  30,
  15000,
  40000,
  150000,
  '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "23:00"}, "saturday": {"open": "05:30", "close": "23:30"}, "sunday": {"open": "05:30", "close": "23:30"}}'::jsonb,
  true,
  true,
  true,
  true,
  false,
  NULL,
  NULL
),
-- Restaurant 3: Burger King
(
  '550e8400-e29b-41d4-a716-446655440013',
  'Burger King Vietnam',
  'burger-king-vietnam',
  'Burger flame-grilled 100% thịt bò. Giao hàng nhanh chóng, món ăn luôn nóng giòn.',
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
  'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb',
  '1800-6656',
  'contact@burgerking.vn',
  'https://burgerking.vn',
  '789 Võ Văn Tần, Quận 3, TP.HCM',
  'TP.HCM',
  'Quận 3',
  10.7808,
  106.6893,
  ARRAY['Burger', 'Fastfood', 'Gà rán'],
  ARRAY['Mỹ', 'Burger', 'Gà rán'],
  4.3,
  456,
  2341,
  25,
  35,
  20000,
  50000,
  120000,
  '{"monday": {"open": "09:00", "close": "22:00"}, "tuesday": {"open": "09:00", "close": "22:00"}, "wednesday": {"open": "09:00", "close": "22:00"}, "thursday": {"open": "09:00", "close": "22:00"}, "friday": {"open": "09:00", "close": "23:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "sunday": {"open": "09:00", "close": "23:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  true,
  'Mua 1 tặng 1 Whopper mỗi thứ 2',
  50
),
-- Restaurant 4: Pizza 4P's
(
  '550e8400-e29b-41d4-a716-446655440014',
  'Pizza 4P''s',
  'pizza-4ps',
  'Pizza Ý cao cấp với phô mai tươi làm tại Đà Lạt. Không gian sang trọng, phục vụ chuyên nghiệp.',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f',
  '0903456789',
  'contact@pizza4ps.com',
  'https://pizza4ps.com',
  '234 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
  'TP.HCM',
  'Quận 3',
  10.7834,
  106.6918,
  ARRAY['Pizza', 'Pasta', 'Ý'],
  ARRAY['Ý', 'Pizza', 'Pasta', 'Salad'],
  4.8,
  892,
  3456,
  30,
  45,
  25000,
  100000,
  200000,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "22:00"}}'::jsonb,
  true,
  true,
  true,
  true,
  false,
  NULL,
  NULL
),
-- Restaurant 5: BBQ House
(
  '550e8400-e29b-41d4-a716-446655440015',
  'BBQ House - Nướng Hàn Quốc',
  'bbq-house-nuong-han-quoc',
  'Thịt nướng Hàn Quốc cao cấp, buffet không giới hạn. Gia vị nhập khẩu Hàn Quốc.',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246',
  'https://images.unsplash.com/photo-1569058242252-92a3b86fc18f',
  '0904567890',
  'contact@bbqhouse.vn',
  NULL,
  '567 Pasteur, Quận 1, TP.HCM',
  'TP.HCM',
  'Quận 1',
  10.7722,
  106.6972,
  ARRAY['Nướng', 'Hàn Quốc', 'BBQ'],
  ARRAY['Hàn Quốc', 'Nướng', 'Lẩu'],
  4.6,
  678,
  1987,
  35,
  50,
  30000,
  150000,
  300000,
  '{"monday": {"open": "10:00", "close": "22:00"}, "tuesday": {"open": "10:00", "close": "22:00"}, "wednesday": {"open": "10:00", "close": "22:00"}, "thursday": {"open": "10:00", "close": "22:00"}, "friday": {"open": "10:00", "close": "23:00"}, "saturday": {"open": "10:00", "close": "23:00"}, "sunday": {"open": "10:00", "close": "23:00"}}'::jsonb,
  true,
  false,
  true,
  true,
  true,
  'Free 1 phần kimchi cho đơn trên 200k',
  0
);

-- ==============================================
-- 2. DISHES (15 dishes across 5 restaurants)
-- ==============================================

-- Dishes for Restaurant 1: Cơm Tấm Sườn Bì Chả
INSERT INTO dishes (
  id, restaurant_id, name, slug, description,
  image, images, price, original_price,
  category, tags,
  rating, review_count, sold_count,
  calories, protein, carbs, fat,
  is_vegetarian, is_vegan, is_gluten_free, is_spicy, spice_level,
  is_available, is_featured, available_quantity, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440021',
  '550e8400-e29b-41d4-a716-446655440011',
  'Cơm Tấm Sườn Bì Chả Trứng',
  'com-tam-suon-bi-cha-trung',
  'Cơm tấm sườn nướng + bì + chả trứng + mỡ hành + dưa góp. Đặc sản Sài Gòn.',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
  ARRAY['https://images.unsplash.com/photo-1603133872878-684f208fb84b'],
  45000,
  50000,
  'Cơm',
  ARRAY['cơm tấm', 'sườn nướng', 'đặc sản', 'sài gòn'],
  4.6,
  89,
  234,
  650,
  28.5,
  72.3,
  18.7,
  false,
  false,
  false,
  false,
  0,
  true,
  true,
  NULL,
  15
),
(
  '550e8400-e29b-41d4-a716-446655440022',
  '550e8400-e29b-41d4-a716-446655440011',
  'Cơm Tấm Sườn Nướng',
  'com-tam-suon-nuong',
  'Cơm tấm sườn nướng thơm lừng, chấm nước mắm chua ngọt đậm đà.',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
  ARRAY['https://images.unsplash.com/photo-1603133872878-684f208fb84b'],
  35000,
  40000,
  'Cơm',
  ARRAY['cơm tấm', 'sườn nướng', 'giá rẻ'],
  4.5,
  67,
  312,
  550,
  24.0,
  68.5,
  15.2,
  false,
  false,
  false,
  false,
  0,
  true,
  false,
  NULL,
  12
),
(
  '550e8400-e29b-41d4-a716-446655440023',
  '550e8400-e29b-41d4-a716-446655440011',
  'Cơm Gà Nướng Sả',
  'com-ga-nuong-sa',
  'Cơm gà nướng sả ớt thơm ngon, không ngấy. Đi kèm rau sống và nước chấm đặc biệt.',
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
  ARRAY['https://images.unsplash.com/photo-1598103442097-8b74394b95c6'],
  40000,
  NULL,
  'Cơm',
  ARRAY['gà nướng', 'sả', 'cay'],
  4.4,
  45,
  187,
  580,
  32.0,
  65.0,
  16.5,
  false,
  false,
  false,
  true,
  2,
  true,
  false,
  NULL,
  15
);

-- Dishes for Restaurant 2: Phở Hà Nội
INSERT INTO dishes (
  id, restaurant_id, name, slug, description,
  image, images, price,
  category, tags,
  rating, review_count, sold_count,
  calories, protein, carbs, fat,
  is_vegetarian, is_spicy, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440024',
  '550e8400-e29b-41d4-a716-446655440012',
  'Phở Bò Tái',
  'pho-bo-tai',
  'Phở bò tái nạm, nước dùng trong vắt từ xương bò ninh 8 tiếng. Thịt bò tươi mỗi ngày.',
  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
  ARRAY['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'],
  60000,
  'Phở',
  ARRAY['phở bò', 'tái', 'hà nội'],
  4.8,
  156,
  567,
  520,
  26.0,
  58.0,
  12.5,
  false,
  false,
  20
),
(
  '550e8400-e29b-41d4-a716-446655440025',
  '550e8400-e29b-41d4-a716-446655440012',
  'Phở Bò Chín',
  'pho-bo-chin',
  'Phở bò chín với thịt bò chín mềm, nạm, gân, sách. Đầy đặn và thơm ngon.',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd',
  ARRAY['https://images.unsplash.com/photo-1547592166-23ac45744acd'],
  65000,
  'Phở',
  ARRAY['phở bò', 'chín', 'đầy đặn'],
  4.7,
  134,
  489,
  580,
  30.0,
  60.0,
  14.0,
  false,
  false,
  20
),
(
  '550e8400-e29b-41d4-a716-446655440026',
  '550e8400-e29b-41d4-a716-446655440012',
  'Phở Gà',
  'pho-ga',
  'Phở gà nước trong, thịt gà thơm ngon. Phù hợp cho người ăn nhẹ.',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246',
  ARRAY['https://images.unsplash.com/photo-1585032226651-759b368d7246'],
  55000,
  'Phở',
  ARRAY['phở gà', 'ăn nhẹ', 'healthy'],
  4.5,
  98,
  345,
  450,
  28.0,
  55.0,
  10.0,
  false,
  false,
  18
);

-- Dishes for Restaurant 3: Burger King
INSERT INTO dishes (
  id, restaurant_id, name, slug, description,
  image, images, price, original_price,
  category, tags,
  rating, review_count, sold_count,
  calories, preparation_time, is_featured
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440027',
  '550e8400-e29b-41d4-a716-446655440013',
  'Whopper Burger',
  'whopper-burger',
  'Burger bò flame-grilled 100% thịt bò + rau tươi + sốt đặc biệt. Burger biểu tượng của BK.',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  ARRAY['https://images.unsplash.com/photo-1568901346375-23c9450c58cd'],
  89000,
  99000,
  'Burger',
  ARRAY['burger', 'whopper', 'bò', 'signature'],
  4.5,
  234,
  1234,
  670,
  15,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440028',
  '550e8400-e29b-41d4-a716-446655440013',
  'Chicken Burger Giòn Cay',
  'chicken-burger-gion-cay',
  'Burger gà giòn cay với sốt mayo đặc biệt, rau tươi và dưa chua.',
  'https://images.unsplash.com/photo-1550547660-d9450f859349',
  ARRAY['https://images.unsplash.com/photo-1550547660-d9450f859349'],
  65000,
  NULL,
  'Burger',
  ARRAY['burger', 'gà', 'cay', 'giòn'],
  4.3,
  189,
  876,
  520,
  10,
  false
),
(
  '550e8400-e29b-41d4-a716-446655440029',
  '550e8400-e29b-41d4-a716-446655440013',
  'Combo Gà Rán 3 Miếng',
  'combo-ga-ran-3-mieng',
  '3 miếng gà giòn + 1 khoai tây chiên + 1 nước ngọt. Nóng giòn, thơm ngon.',
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
  ARRAY['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec'],
  99000,
  120000,
  'Gà rán',
  ARRAY['gà rán', 'combo', 'giòn', 'deal'],
  4.4,
  312,
  1567,
  850,
  15,
  true
);

-- Dishes for Restaurant 4: Pizza 4P's
INSERT INTO dishes (
  id, restaurant_id, name, slug, description,
  image, images, price,
  category, tags,
  rating, review_count, sold_count,
  calories, is_vegetarian, preparation_time, is_featured
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440014',
  'Pizza Margherita',
  'pizza-margherita',
  'Pizza truyền thống Ý với sốt cà chua, phô mai mozzarella Đà Lạt, húng quế tươi.',
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  ARRAY['https://images.unsplash.com/photo-1574071318508-1cdbab80d002'],
  150000,
  'Pizza',
  ARRAY['pizza', 'margherita', 'vegetarian', 'classic'],
  4.9,
  456,
  2134,
  720,
  true,
  20,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440031',
  '550e8400-e29b-41d4-a716-446655440014',
  'Pizza Bò & Nấm Truffle',
  'pizza-bo-nam-truffle',
  'Pizza thịt bò xay, nấm truffle, phô mai 3 lớp. Đậm đà hương vị cao cấp.',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  ARRAY['https://images.unsplash.com/photo-1513104890138-7c749659a591'],
  220000,
  'Pizza',
  ARRAY['pizza', 'bò', 'nấm truffle', 'cao cấp'],
  4.8,
  389,
  1456,
  850,
  false,
  25,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440032',
  '550e8400-e29b-41d4-a716-446655440014',
  'Pasta Carbonara',
  'pasta-carbonara',
  'Mì Ý Carbonara với thịt xông khói, kem tươi, phô mai Parmesan.',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
  ARRAY['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9'],
  120000,
  'Pasta',
  ARRAY['pasta', 'carbonara', 'ý', 'kem'],
  4.7,
  267,
  987,
  680,
  false,
  18,
  false
);

-- Dishes for Restaurant 5: BBQ House
INSERT INTO dishes (
  id, restaurant_id, name, slug, description,
  image, images, price,
  category, tags,
  rating, review_count, sold_count,
  calories, is_spicy, spice_level, preparation_time
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440033',
  '550e8400-e29b-41d4-a716-446655440015',
  'Combo Thịt Nướng Hàn Quốc (2-3 người)',
  'combo-thit-nuong-han-quoc-2-3-nguoi',
  'Thịt ba chỉ, thịt nướng sườn, rau sống, kimchi, đậu phụ. Đủ cho 2-3 người.',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246',
  ARRAY['https://images.unsplash.com/photo-1585032226651-759b368d7246'],
  350000,
  'Nướng',
  ARRAY['nướng', 'hàn quốc', 'combo', 'bbq'],
  4.7,
  234,
  678,
  1200,
  true,
  2,
  30
),
(
  '550e8400-e29b-41d4-a716-446655440034',
  '550e8400-e29b-41d4-a716-446655440015',
  'Lẩu Kim Chi Hải Sản',
  'lau-kim-chi-hai-san',
  'Lẩu kim chi cay với tôm, mực, nghêu, cá. Gia vị nhập khẩu Hàn Quốc.',
  'https://images.unsplash.com/photo-1569058242252-92a3b86fc18f',
  ARRAY['https://images.unsplash.com/photo-1569058242252-92a3b86fc18f'],
  280000,
  'Lẩu',
  ARRAY['lẩu', 'kim chi', 'hải sản', 'cay'],
  4.6,
  178,
  456,
  900,
  true,
  3,
  25
),
(
  '550e8400-e29b-41d4-a716-446655440035',
  '550e8400-e29b-41d4-a716-446655440015',
  'Cơm Trộn Hàn Quốc (Bibimbap)',
  'com-tron-han-quoc-bibimbap',
  'Cơm trộn với rau củ, thịt bò, trứng ốp la. Trộn với sốt gochujang cay nồng.',
  'https://images.unsplash.com/photo-1590301157890-4810ed352733',
  ARRAY['https://images.unsplash.com/photo-1590301157890-4810ed352733'],
  85000,
  'Cơm',
  ARRAY['bibimbap', 'cơm trộn', 'hàn quốc', 'healthy'],
  4.5,
  145,
  567,
  620,
  true,
  2,
  15
);

-- ==============================================
-- 3. COUPONS (3 coupons)
-- ==============================================

INSERT INTO coupons (
  id, code, description,
  discount_type, discount_value,
  minimum_order, max_discount,
  applicable_to,
  usage_limit, usage_per_user,
  valid_from, valid_until,
  is_active
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440041',
  'WELCOME15',
  'Giảm 15% cho đơn hàng đầu tiên, giảm tối đa 50k. Áp dụng cho khách hàng mới.',
  'percentage',
  15.00,
  50000,
  50000,
  'first_order',
  1000,
  1,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '30 days',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440042',
  'FREESHIP',
  'Miễn phí giao hàng cho đơn hàng từ 100k. Tiết kiệm tối đa 30k phí ship.',
  'free_delivery',
  30000,
  100000,
  30000,
  'all',
  500,
  5,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '60 days',
  true
),
(
  '550e8400-e29b-41d4-a716-446655440043',
  'PIZZA20',
  'Giảm 20% tất cả món Pizza tại Pizza 4P''s. Giảm tối đa 100k.',
  'percentage',
  20.00,
  150000,
  100000,
  'specific_restaurants',
  200,
  3,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days',
  true
);

-- Update restaurant_ids for Pizza 4P's coupon
UPDATE coupons 
SET restaurant_ids = ARRAY['550e8400-e29b-41d4-a716-446655440014'::UUID]
WHERE code = 'PIZZA20';

-- ==============================================
-- 4. BANNERS (4 promotional banners)
-- ==============================================

INSERT INTO banners (
  id, title, subtitle, image,
  action_type, action_value, restaurant_id,
  background_color, text_color,
  display_order, is_active,
  start_date, end_date
) VALUES
-- Banner 1: Flash Sale Pizza 4P's
(
  '550e8400-e29b-41d4-a716-446655440051',
  '🍕 Pizza 4P''s - Giảm 20%',
  'Áp dụng tất cả món Pizza. Giảm tối đa 100k',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop',
  'restaurant',
  '550e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440014'::UUID,
  '#FF6B6B',
  '#FFFFFF',
  1,
  true,
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days'
),
-- Banner 2: Free Ship
(
  '550e8400-e29b-41d4-a716-446655440052',
  '🚚 Miễn Phí Giao Hàng',
  'Đơn từ 100k - Tiết kiệm 30k phí ship',
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop',
  'coupon',
  'FREESHIP',
  NULL,
  '#4ECDC4',
  '#FFFFFF',
  2,
  true,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '60 days'
),
-- Banner 3: Welcome Discount
(
  '550e8400-e29b-41d4-a716-446655440053',
  '🎉 Chào Mừng Khách Mới',
  'Giảm ngay 15% đơn hàng đầu tiên',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
  'coupon',
  'WELCOME15',
  NULL,
  '#FFD93D',
  '#2D3436',
  3,
  true,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '30 days'
),
-- Banner 4: BBQ House Promotion
(
  '550e8400-e29b-41d4-a716-446655440054',
  '🔥 BBQ House - Ưu Đãi Hot',
  'Tặng kimchi cho đơn trên 200k',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=400&fit=crop',
  'restaurant',
  '550e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440015'::UUID,
  '#F97316',
  '#FFFFFF',
  4,
  true,
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '10 days'
);

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================
-- Run these to verify data was inserted correctly:

-- Check restaurants
-- SELECT id, name, slug, rating, is_featured FROM restaurants ORDER BY rating DESC;

-- Check dishes with restaurant info
-- SELECT d.name as dish_name, r.name as restaurant_name, d.price, d.category 
-- FROM dishes d 
-- JOIN restaurants r ON d.restaurant_id = r.id 
-- ORDER BY r.name, d.price;

-- Check coupons
-- SELECT code, description, discount_type, discount_value, valid_until FROM coupons WHERE is_active = true;

-- Check banners
-- SELECT title, subtitle, action_type, display_order, is_active FROM banners ORDER BY display_order;

-- Count items
-- SELECT 
--   (SELECT COUNT(*) FROM restaurants) as total_restaurants,
--   (SELECT COUNT(*) FROM dishes) as total_dishes,
--   (SELECT COUNT(*) FROM coupons) as total_coupons,
--   (SELECT COUNT(*) FROM banners) as total_banners;

-- ==============================================
-- NOTES FOR USAGE
-- ==============================================
-- 
-- IMPORTANT: Profiles and Addresses
-- - Profiles are auto-created by trigger when users sign up via Supabase Auth
-- - DO NOT manually insert profiles without corresponding auth.users records
-- - Addresses require valid user_id from auth.users table
-- - Create users through Supabase Auth UI first, then add addresses
--
-- After inserting this sample data, you can:
--
-- 1. SEARCH & FILTER:
--    SELECT * FROM restaurants WHERE name ILIKE '%phở%';
--    SELECT * FROM dishes WHERE category = 'Pizza';
--    SELECT * FROM restaurants WHERE 'Việt Nam' = ANY(cuisines);
--
-- 2. USE VIEWS:
--    SELECT * FROM dishes_with_restaurant WHERE restaurant_name LIKE '%Pizza%';
--    SELECT * FROM restaurants_with_stats ORDER BY order_count DESC LIMIT 10;
--    SELECT * FROM popular_dishes LIMIT 20;
--
-- 3. FULL-TEXT SEARCH:
--    SELECT * FROM restaurants WHERE name % 'pho' ORDER BY similarity(name, 'pho') DESC;
--
-- 4. CREATE TEST USER (via Supabase Auth):
--    - Go to Authentication → Users in Supabase Dashboard
--    - Create test user (profile will be auto-created by trigger)
--
-- 5. ADD ADDRESSES (after creating user):
--    INSERT INTO addresses (user_id, label, full_address, city, contact_name, contact_phone, is_default)
--    VALUES ('your-auth-user-uuid', 'home', '123 Nguyễn Huệ, Q1, HCM', 'TP.HCM', 'Nguyễn Văn A', '0901234567', true);
--
-- 6. ADD FAVORITES:
--    INSERT INTO favorites (user_id, restaurant_id) 
--    VALUES ('your-user-id', '550e8400-e29b-41d4-a716-446655440011');
--
-- 7. CREATE ORDERS:
--    - Use sample restaurant IDs and dish IDs from above
--    - Test with/without coupons
--    - Verify triggers update ratings and stats

-- ============================================
-- END OF SAMPLE DATA
-- ============================================
