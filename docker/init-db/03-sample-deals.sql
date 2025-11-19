-- ============================================
-- SAMPLE DATA: DEALS
-- Date: 2025-01-26
-- Description: Sample deals data for TrumDealNgon component
-- Prerequisites: Must have restaurants and dishes data in database
-- ============================================

-- ============================================
-- STEP 1: VERIFY EXISTING DATA
-- ============================================
-- Run these queries first to get actual IDs from your database:

-- Get restaurant IDs:
-- SELECT id, name, logo FROM restaurants WHERE is_active = true ORDER BY rating DESC LIMIT 5;

-- Get dish IDs for each restaurant:
-- SELECT d.id, d.name, d.image, d.price, r.name as restaurant_name, r.id as restaurant_id
-- FROM dishes d 
-- JOIN restaurants r ON d.restaurant_id = r.id 
-- WHERE d.is_available = true AND r.is_active = true
-- ORDER BY d.sold_count DESC
-- LIMIT 20;

-- ============================================
-- STEP 2: INSERT SAMPLE DEALS
-- ============================================
-- Replace the UUIDs below with actual IDs from your database

-- Deal 1: Bún Bò Huế - 50% off
INSERT INTO deals (
  restaurant_id, 
  dish_id, 
  title, 
  description,
  original_price, 
  discounted_price, 
  discount_percent,
  valid_from,
  valid_until,
  max_redemptions,
  current_redemptions,
  max_per_user,
  display_order,
  is_featured,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440012', -- Phở Hà Nội Truyền Thống (replace with actual ID)
  (SELECT id FROM dishes WHERE restaurant_id = '550e8400-e29b-41d4-a716-446655440012' LIMIT 1), -- Get first dish from this restaurant
  'Deal Bún Bò Huế Đặc Biệt',
  'Bún bò Huế chính gốc với nước dùng ninh 8 tiếng. Giảm giá 50% cho đơn hàng đầu tiên!',
  50000,
  25000,
  50,
  NOW(),
  NOW() + INTERVAL '30 days',
  100,
  0,
  1,
  1,
  true,
  true
) ON CONFLICT DO NOTHING;

-- Deal 2: Phở Bò - 40% off
INSERT INTO deals (
  restaurant_id, 
  dish_id, 
  title, 
  description,
  original_price, 
  discounted_price, 
  discount_percent,
  valid_from,
  valid_until,
  max_redemptions,
  max_per_user,
  display_order,
  is_featured,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440012', -- Phở Hà Nội (replace with actual ID)
  (SELECT id FROM dishes WHERE restaurant_id = '550e8400-e29b-41d4-a716-446655440012' AND name ILIKE '%phở%' LIMIT 1),
  'Deal Phở Bò Hà Nội',
  'Phở bò truyền thống với thịt bò tươi. Ưu đãi đặc biệt giảm 40%!',
  45000,
  27000,
  40,
  NOW(),
  NOW() + INTERVAL '30 days',
  200,
  2,
  2,
  true,
  true
) ON CONFLICT DO NOTHING;

-- Deal 3: Cơm Tấm - 30% off
INSERT INTO deals (
  restaurant_id, 
  dish_id, 
  title,
  description,
  original_price, 
  discounted_price, 
  discount_percent,
  valid_from,
  valid_until,
  display_order,
  is_featured,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440011', -- Cơm Tấm Sườn Bì Chả (replace with actual ID)
  (SELECT id FROM dishes WHERE restaurant_id = '550e8400-e29b-41d4-a716-446655440011' LIMIT 1),
  'Deal Cơm Tấm Sườn Đặc Biệt',
  'Cơm tấm sườn nướng thơm ngon. Giảm giá hấp dẫn 30%!',
  40000,
  28000,
  30,
  NOW(),
  NOW() + INTERVAL '30 days',
  3,
  true,
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- ALTERNATIVE: DYNAMIC INSERT
-- ============================================
-- This approach creates deals automatically from existing data

-- Create deals for top-rated dishes
DO $$
DECLARE
  v_restaurant RECORD;
  v_dish RECORD;
  v_order INTEGER := 1;
BEGIN
  -- Get top 3 restaurants
  FOR v_restaurant IN 
    SELECT id, name FROM restaurants 
    WHERE is_active = true AND is_open = true
    ORDER BY rating DESC, order_count DESC
    LIMIT 3
  LOOP
    -- Get top dish from each restaurant
    FOR v_dish IN
      SELECT id, name, price, image
      FROM dishes
      WHERE restaurant_id = v_restaurant.id 
        AND is_available = true
      ORDER BY rating DESC, sold_count DESC
      LIMIT 1
    LOOP
      -- Create deal with 40-50% discount
      INSERT INTO deals (
        restaurant_id,
        dish_id,
        title,
        description,
        original_price,
        discounted_price,
        discount_percent,
        valid_from,
        valid_until,
        display_order,
        is_featured,
        is_active
      ) VALUES (
        v_restaurant.id,
        v_dish.id,
        'Deal ' || v_dish.name,
        'Ưu đãi đặc biệt cho ' || v_dish.name || ' tại ' || v_restaurant.name,
        v_dish.price,
        ROUND(v_dish.price * 0.5, 0), -- 50% off
        50,
        NOW(),
        NOW() + INTERVAL '30 days',
        v_order,
        true,
        true
      )
      ON CONFLICT DO NOTHING;
      
      v_order := v_order + 1;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 3: VERIFY DEALS
-- ============================================
-- Run this query to check your deals:

SELECT 
  d.id,
  d.title,
  d.original_price,
  d.discounted_price,
  d.discount_percent,
  d.display_order,
  d.is_featured,
  r.name as restaurant_name,
  r.logo as restaurant_logo,
  dish.name as dish_name,
  dish.image as dish_image
FROM deals d
JOIN restaurants r ON d.restaurant_id = r.id
JOIN dishes dish ON d.dish_id = dish.id
WHERE d.is_active = true 
  AND d.deleted_at IS NULL
  AND (d.valid_until IS NULL OR d.valid_until > NOW())
ORDER BY d.display_order;

-- ============================================
-- STEP 4: UPDATE EXISTING DEALS (OPTIONAL)
-- ============================================
-- If you need to update existing deals:

-- Update display order
UPDATE deals 
SET display_order = 1 
WHERE title LIKE '%Bún Bò%' AND is_active = true;

UPDATE deals 
SET display_order = 2 
WHERE title LIKE '%Phở%' AND is_active = true;

UPDATE deals 
SET display_order = 3 
WHERE title LIKE '%Cơm Tấm%' AND is_active = true;

-- Mark all as featured
UPDATE deals 
SET is_featured = true 
WHERE is_active = true;

-- Extend validity period
UPDATE deals 
SET valid_until = NOW() + INTERVAL '60 days'
WHERE is_active = true AND (valid_until IS NULL OR valid_until < NOW() + INTERVAL '30 days');

-- ============================================
-- CLEANUP (OPTIONAL)
-- ============================================
-- Remove expired deals
-- UPDATE deals SET is_active = false WHERE valid_until < NOW();

-- Delete test deals
-- DELETE FROM deals WHERE title LIKE '%Test%' OR title LIKE '%Sample%';
