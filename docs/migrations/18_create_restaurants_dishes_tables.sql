-- =============================================
-- RESTAURANTS AND DISHES SCHEMA MIGRATION
-- =============================================
-- Date: November 10, 2025
-- Description: Create restaurants and dishes tables for proper data structure
-- =============================================

BEGIN;

-- =============================================
-- RESTAURANTS TABLE - ADD MISSING COLUMNS
-- =============================================

-- Note: restaurants table already exists, we just need to add missing columns

-- Add missing columns to existing restaurants table
DO $$ BEGIN
  -- Add cover_image if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'cover_image') THEN
    ALTER TABLE restaurants ADD COLUMN cover_image TEXT;
  END IF;
  
  -- Add website if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'website') THEN
    ALTER TABLE restaurants ADD COLUMN website TEXT;
  END IF;
  
  -- Add comment_count if not exists (using total_reviews as base)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'comment_count') THEN
    ALTER TABLE restaurants ADD COLUMN comment_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add min_order_amount if not exists (using minimum_order)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'min_order_amount') THEN
    ALTER TABLE restaurants ADD COLUMN min_order_amount DECIMAL(10, 2) DEFAULT 0;
  END IF;
  
  -- Add business_hours if not exists (using opening_hours)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'business_hours') THEN
    ALTER TABLE restaurants ADD COLUMN business_hours JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  -- Add is_featured if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'is_featured') THEN
    ALTER TABLE restaurants ADD COLUMN is_featured BOOLEAN DEFAULT false;
    -- Copy data from existing featured column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'featured') THEN
      UPDATE restaurants SET is_featured = featured WHERE featured IS NOT NULL;
    END IF;
  END IF;
  
  -- Add is_partner if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'is_partner') THEN
    ALTER TABLE restaurants ADD COLUMN is_partner BOOLEAN DEFAULT false;
  END IF;
  
  -- Add metadata if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'metadata') THEN
    ALTER TABLE restaurants ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  -- Add display_order if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'display_order') THEN
    ALTER TABLE restaurants ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  
  -- Add review_count if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'review_count') THEN
    ALTER TABLE restaurants ADD COLUMN review_count INTEGER DEFAULT 0;
    -- Copy data from existing total_reviews column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'total_reviews') THEN
      UPDATE restaurants SET review_count = total_reviews WHERE total_reviews IS NOT NULL;
    END IF;
  END IF;
END $$;

-- Indexes for restaurants (using IF NOT EXISTS to avoid conflicts)
CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active, is_open) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON restaurants(is_featured DESC, display_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_created_at ON restaurants(created_at DESC);

-- =============================================
-- DISHES TABLE - ADD MISSING COLUMNS
-- =============================================

-- Note: dishes table already exists, we just need to add missing columns

-- Add missing columns to existing dishes table
DO $$ BEGIN
  -- Add discount_percent if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'discount_percent') THEN
    ALTER TABLE dishes ADD COLUMN discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100);
    -- Set default value for existing dishes if needed
    -- Only copy if discount_percentage column actually exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'discount_percentage') THEN
      UPDATE dishes SET discount_percent = discount_percentage WHERE discount_percentage IS NOT NULL;
    END IF;
  END IF;
  
  -- Add spice_level if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'spice_level') THEN
    ALTER TABLE dishes ADD COLUMN spice_level TEXT CHECK (spice_level IN ('mild', 'medium', 'hot', 'very_hot'));
  END IF;
  
  -- Convert ingredients from TEXT[] to JSONB if needed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'ingredients_json') THEN
    ALTER TABLE dishes ADD COLUMN ingredients_json JSONB DEFAULT '[]'::jsonb;
    -- Convert existing ingredients to JSON format if ingredients column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'ingredients') THEN
      UPDATE dishes SET ingredients_json = to_jsonb(ingredients) WHERE ingredients IS NOT NULL;
    END IF;
  END IF;
  
  -- Convert allergens from TEXT[] to JSONB if needed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'allergens_json') THEN
    ALTER TABLE dishes ADD COLUMN allergens_json JSONB DEFAULT '[]'::jsonb;
    -- Convert existing allergens to JSON format if allergens column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'allergens') THEN
      UPDATE dishes SET allergens_json = to_jsonb(allergens) WHERE allergens IS NOT NULL;
    END IF;
  END IF;
  
  -- Add nutrition_info if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'nutrition_info') THEN
    ALTER TABLE dishes ADD COLUMN nutrition_info JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  -- Add is_popular if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_popular') THEN
    ALTER TABLE dishes ADD COLUMN is_popular BOOLEAN DEFAULT false;
    -- Use is_featured as base for is_popular if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_featured') THEN
      UPDATE dishes SET is_popular = is_featured WHERE is_featured IS NOT NULL;
    END IF;
  END IF;
  
  -- Add is_best_seller if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_best_seller') THEN
    ALTER TABLE dishes ADD COLUMN is_best_seller BOOLEAN DEFAULT false;
  END IF;
  
  -- Add dietary flags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_vegetarian') THEN
    ALTER TABLE dishes ADD COLUMN is_vegetarian BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_vegan') THEN
    ALTER TABLE dishes ADD COLUMN is_vegan BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'is_gluten_free') THEN
    ALTER TABLE dishes ADD COLUMN is_gluten_free BOOLEAN DEFAULT false;
  END IF;
  
  -- Add metadata if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'metadata') THEN
    ALTER TABLE dishes ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
  
  -- Add display_order if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'display_order') THEN
    ALTER TABLE dishes ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  
  -- Add view_count if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'view_count') THEN
    ALTER TABLE dishes ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add order_count if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'order_count') THEN
    ALTER TABLE dishes ADD COLUMN order_count INTEGER DEFAULT 0;
    -- Use total_reviews as base for order_count if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'total_reviews') THEN
      UPDATE dishes SET order_count = total_reviews WHERE total_reviews IS NOT NULL;
    END IF;
  END IF;
  
  -- Add deleted_at if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dishes' AND column_name = 'deleted_at') THEN
    ALTER TABLE dishes ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- Indexes for dishes (using IF NOT EXISTS to avoid conflicts)
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant ON dishes(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_name ON dishes USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_price ON dishes(price) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_rating ON dishes(rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_popular ON dishes(is_popular DESC, rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_bestseller ON dishes(is_best_seller DESC, order_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_available ON dishes(is_available, restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_discount ON dishes(discount_percent DESC) WHERE deleted_at IS NULL AND discount_percent > 0;

-- =============================================
-- SAMPLE DATA (SAFE INSERT APPROACH)
-- =============================================

-- Insert sample restaurant using dynamic column checking
DO $$ 
DECLARE
  has_ward BOOLEAN;
  has_district BOOLEAN;
  insert_sql TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM restaurants WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid) THEN
    -- Check which optional columns exist
    has_ward := EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'ward');
    has_district := EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'district');
    
    -- Build dynamic INSERT statement
    insert_sql := 'INSERT INTO restaurants (
      id,
      name,
      slug,
      description,
      address,
      city';
    
    IF has_district THEN
      insert_sql := insert_sql || ', district';
    END IF;
    
    IF has_ward THEN
      insert_sql := insert_sql || ', ward';
    END IF;
    
    insert_sql := insert_sql || ',
      phone,
      rating,
      delivery_time_min,
      delivery_time_max,
      delivery_fee,
      minimum_order,
      latitude,
      longitude,
      is_active
    ) VALUES (
      ''550e8400-e29b-41d4-a716-446655440000''::uuid,
      ''Trà Sữa Gong Cha'',
      ''tra-sua-gong-cha'',
      ''Chuỗi trà sữa nổi tiếng với nhiều hương vị độc đáo'',
      ''123 Nguyễn Văn Cừ, Quận 5, TP.HCM'',
      ''TP.HCM''';
    
    IF has_district THEN
      insert_sql := insert_sql || ', ''Quận 5''';
    END IF;
    
    IF has_ward THEN
      insert_sql := insert_sql || ', ''Phường 4''';
    END IF;
    
    insert_sql := insert_sql || ',
      ''+84901234567'',
      4.8,
      20,
      30,
      15000,
      50000,
      10.762622,
      106.660172,
      true
    )';
    
    EXECUTE insert_sql;
  END IF;
END $$;

-- Insert sample dishes (using safe DO block approach)
DO $$ BEGIN
  -- Insert dishes only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM dishes WHERE restaurant_id = '550e8400-e29b-41d4-a716-446655440000'::uuid) THEN
    INSERT INTO dishes (
      id,
      restaurant_id,
      slug,
      name,
      description,
      image,
      category,
      price,
      original_price,
      rating,
      tags,
      is_available,
      is_popular
    ) VALUES 
    (
      '550e8400-e29b-41d4-a716-446655440001'::uuid,
      '550e8400-e29b-41d4-a716-446655440000'::uuid,
      'tra-sua-tran-chau-duong-den',
      'Trà sữa trân châu đường đen',
      'Trà sữa thơm ngon với trân châu đường đen dai dai',
      'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
      'Trà sữa',
      25000,
      30000,
      4.8,
      ARRAY['trà đen', 'sữa tươi', 'trân châu', 'đường đen'],
      true,
      true
    ),
    (
      '550e8400-e29b-41d4-a716-446655440002'::uuid,
      '550e8400-e29b-41d4-a716-446655440000'::uuid,
      'tra-sua-matcha',
      'Trà sữa matcha',
      'Trà sữa matcha Nhật Bản thượng hạng',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
      'Trà sữa',
      28000,
      null,
      4.7,
      ARRAY['matcha', 'sữa tươi', 'trân châu'],
      true,
      false
    ),
    (
      '550e8400-e29b-41d4-a716-446655440003'::uuid,
      '550e8400-e29b-41d4-a716-446655440000'::uuid,
      'ca-phe-sua-da',
      'Cà phê sữa đá',
      'Cà phê phin truyền thống pha sữa đá mát lạnh',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      'Cà phê',
      20000,
      null,
      4.6,
      ARRAY['cà phê phin', 'sữa đặc', 'đá'],
      true,
      false
    ),
    (
      '550e8400-e29b-41d4-a716-446655440004'::uuid,
      '550e8400-e29b-41d4-a716-446655440000'::uuid,
      'sinh-to-bo',
      'Sinh tố bơ',
      'Sinh tố bơ béo ngậy, bổ dưỡng',
      'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
      'Sinh tố',
      22000,
      25000,
      4.5,
      ARRAY['bơ', 'sữa tươi', 'đường', 'đá'],
      true,
      false
    ),
    (
      '550e8400-e29b-41d4-a716-446655440005'::uuid,
      '550e8400-e29b-41d4-a716-446655440000'::uuid,
      'nuoc-ep-cam-tuoi',
      'Nước ép cam tươi',
      'Cam tươi vắt 100% không chất bảo quản',
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
      'Nước ép',
      18000,
      null,
      4.4,
      ARRAY['cam tươi'],
      true,
      false
    );
  END IF;
END $$;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Restaurants policies (using IF NOT EXISTS via DO blocks)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'restaurants' AND policyname = 'Public restaurants are viewable by everyone') THEN
    CREATE POLICY "Public restaurants are viewable by everyone"
      ON restaurants FOR SELECT
      USING (deleted_at IS NULL AND is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'restaurants' AND policyname = 'Enable insert for authenticated users only') THEN
    CREATE POLICY "Enable insert for authenticated users only"
      ON restaurants FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'restaurants' AND policyname = 'Users can update their own restaurant data') THEN
    CREATE POLICY "Users can update their own restaurant data"
      ON restaurants FOR UPDATE
      USING (auth.uid()::text = metadata->>'owner_id');
  END IF;
END $$;

-- Dishes policies (using IF NOT EXISTS via DO blocks)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dishes' AND policyname = 'Public dishes are viewable by everyone') THEN
    CREATE POLICY "Public dishes are viewable by everyone"
      ON dishes FOR SELECT
      USING (deleted_at IS NULL AND is_available = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dishes' AND policyname = 'Enable insert for authenticated users only') THEN
    CREATE POLICY "Enable insert for authenticated users only"
      ON dishes FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dishes' AND policyname = 'Users can update dishes of their restaurants') THEN
    CREATE POLICY "Users can update dishes of their restaurants"
      ON dishes FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM restaurants r
          WHERE r.id = dishes.restaurant_id
          AND r.metadata->>'owner_id' = auth.uid()::text
        )
      );
  END IF;
END $$;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Create function if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Create triggers if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_restaurants_updated_at') THEN
    CREATE TRIGGER update_restaurants_updated_at
        BEFORE UPDATE ON restaurants
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_dishes_updated_at') THEN
    CREATE TRIGGER update_dishes_updated_at
        BEFORE UPDATE ON dishes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

COMMIT;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the migration

-- SELECT 'Restaurants created' as status, count(*) as count FROM restaurants;
-- SELECT 'Dishes created' as status, count(*) as count FROM dishes;
-- SELECT 'Sample restaurant' as type, name FROM restaurants WHERE id = 'sample-restaurant-1';
-- SELECT 'Sample dishes' as type, name, category FROM dishes WHERE restaurant_id = 'sample-restaurant-1';