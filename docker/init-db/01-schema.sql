-- ============================================
-- FOOD DELIVERY APP - COMPLETE DATABASE SCHEMA
-- Version: 5.0.0
-- Date: 2025-11-11
-- Description: Complete production-ready schema with all tables and features
-- Includes: Navigation fixes, Data accuracy, and Universal compatibility
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- ============================================
-- ENUMS (Type Safety)
-- ============================================

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'cash',
    'credit_card',
    'debit_card',
    'paypal',
    'momo',
    'zalopay',
    'bank_transfer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'order_update',
    'order_confirmed',
    'order_preparing',
    'order_delivered',
    'order_cancelled',
    'promotion',
    'system',
    'welcome'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CORE TABLES
-- ============================================

-- =======================
-- 1. PROFILES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  avatar TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Preferences
  preferred_language TEXT DEFAULT 'vi' CHECK (preferred_language IN ('vi', 'en')),
  notification_enabled BOOLEAN DEFAULT true,
  email_notification_enabled BOOLEAN DEFAULT true,
  
  -- Stats (denormalized for performance)
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 2. ADDRESSES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Address type
  label TEXT NOT NULL CHECK (label IN ('home', 'work', 'other')),
  
  -- Address details
  full_address TEXT NOT NULL,
  street TEXT,
  ward TEXT,
  district TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  
  -- Geolocation
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  contact_name TEXT,
  contact_phone TEXT,
  delivery_instructions TEXT,
  
  -- Default address
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 3. RESTAURANTS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  website TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Address
  address TEXT NOT NULL,
  ward TEXT,
  district TEXT,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  phone TEXT,
  email TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_partner BOOLEAN DEFAULT false,
  
  -- Rating and reviews
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Business info
  opening_time TIME,
  closing_time TIME,
  delivery_time_min INTEGER DEFAULT 30,
  delivery_time_max INTEGER DEFAULT 60,
  delivery_fee DECIMAL(10,2) DEFAULT 15000,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Business hours (JSONB for flexibility)
  business_hours JSONB DEFAULT '{}'::jsonb,
  
  -- Categories
  cuisine_types TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Stats (denormalized)
  total_orders INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 4. DISHES TABLE  
-- =======================
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2),
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  
  -- Status
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  
  -- Dietary flags
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  
  -- Category
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Additional fields for compatibility
  spice_level TEXT CHECK (spice_level IN ('mild', 'medium', 'hot', 'very_hot')),
  
  -- JSON fields for ingredients and allergens
  ingredients_json JSONB DEFAULT '[]'::jsonb,
  allergens_json JSONB DEFAULT '[]'::jsonb,
  
  -- Options (e.g., size, toppings)
  options JSONB DEFAULT '[]'::jsonb,
  
  -- Nutrition (optional)
  calories INTEGER,
  nutrition_info JSONB DEFAULT '{}'::jsonb,
  
  -- Stats
  total_orders INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(restaurant_id, slug)
);

-- =======================
-- 5. CATEGORIES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL, -- Ionicons name
  image TEXT, -- Image URL (optional)
  bg_color TEXT DEFAULT '#26C6DA',
  text_color TEXT DEFAULT '#FFFFFF',
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_special BOOLEAN DEFAULT false, -- For metallic shine effect
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Stats
  total_restaurants INTEGER DEFAULT 0,
  total_dishes INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 6. DEALS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE NOT NULL,
  
  -- Deal info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
  discounted_price DECIMAL(10,2) NOT NULL CHECK (discounted_price >= 0),
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  valid_until TIMESTAMPTZ,
  
  -- Limits
  max_redemptions INTEGER, -- NULL = unlimited
  current_redemptions INTEGER DEFAULT 0,
  max_per_user INTEGER DEFAULT 1,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CHECK (discounted_price < original_price),
  CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- =======================
-- 7. COLLECTIONS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 8. FLASH SALES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS flash_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  
  -- Sale info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  original_price DECIMAL(10,2) NOT NULL CHECK (original_price >= 0),
  flash_price DECIMAL(10,2) NOT NULL CHECK (flash_price >= 0),
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  
  -- Timing
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  
  -- Limits
  total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
  sold_quantity INTEGER DEFAULT 0 CHECK (sold_quantity >= 0),
  max_per_user INTEGER DEFAULT 1 CHECK (max_per_user > 0),
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  
  -- Constraints
  CHECK (flash_price < original_price),
  CHECK (ends_at > starts_at),
  CHECK (sold_quantity <= total_quantity)
);

-- =======================
-- 9. BANNERS TABLE  
-- =======================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  
  -- Media
  image TEXT NOT NULL,
  
  -- Action
  action_type TEXT NOT NULL CHECK (action_type IN ('restaurant', 'category', 'deal', 'external', 'none')),
  action_data JSONB DEFAULT '{}'::jsonb, -- Store restaurant_id, category_id, deal_id, or URL
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timing (optional)
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 10. ORDERS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  
  -- Order info
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  
  -- Delivery
  delivery_address JSONB NOT NULL,
  estimated_delivery_time INTEGER, -- in minutes
  actual_delivery_time TIMESTAMPTZ,
  
  -- Payment
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- =======================
-- 11. ORDER ITEMS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) NOT NULL,
  
  -- Item details
  dish_name TEXT NOT NULL, -- Snapshot at order time
  dish_price DECIMAL(10,2) NOT NULL CHECK (dish_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  
  -- Customizations
  options JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =======================
-- 12. FAVORITES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  
  -- Type (ensure only one is set)
  type TEXT NOT NULL CHECK (type IN ('restaurant', 'dish')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  UNIQUE(user_id, restaurant_id, type),
  UNIQUE(user_id, dish_id, type),
  CHECK (
    (type = 'restaurant' AND restaurant_id IS NOT NULL AND dish_id IS NULL) OR
    (type = 'dish' AND dish_id IS NOT NULL AND restaurant_id IS NULL)
  )
);

-- =======================
-- 13. NOTIFICATIONS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification content
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  
  -- Related data
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  
  -- Metadata
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_name_search ON profiles USING gin(name gin_trgm_ops);

-- Addresses indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_addresses_user_default ON addresses(user_id, is_default) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_addresses_coordinates ON addresses(latitude, longitude) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_addresses_user_single_default ON addresses(user_id) WHERE is_default = true AND deleted_at IS NULL;

-- Restaurants indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON restaurants(is_featured DESC, display_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC, total_reviews DESC) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_coordinates ON restaurants(latitude, longitude) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_restaurants_name_search ON restaurants USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants USING gin(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_restaurants_tags ON restaurants USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_restaurants_created_at ON restaurants(created_at DESC);

-- Dishes indexes
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant ON dishes(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant_available ON dishes(restaurant_id, is_available) WHERE is_available = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_popular ON dishes(is_popular DESC, rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_bestseller ON dishes(is_best_seller DESC, order_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_new ON dishes(is_new, created_at DESC) WHERE is_new = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_price ON dishes(price) WHERE is_available = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_name_search ON dishes USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dishes_tags ON dishes USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_dishes_discount ON dishes(discount_percent DESC) WHERE deleted_at IS NULL AND discount_percent > 0;

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_is_special ON categories(is_special) WHERE deleted_at IS NULL AND is_active = true;

-- Deals indexes
CREATE INDEX IF NOT EXISTS idx_deals_restaurant ON deals(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_dish ON deals(dish_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_is_active ON deals(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_is_featured ON deals(is_featured) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_deals_valid_dates ON deals(valid_from, valid_until) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_deals_display_order ON deals(display_order) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_deals_featured_active ON deals(is_featured, display_order, valid_until) WHERE deleted_at IS NULL AND is_active = true;

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_collections_is_active ON collections(is_active) WHERE deleted_at IS NULL;

-- Flash sales indexes
CREATE INDEX IF NOT EXISTS idx_flash_sales_dish ON flash_sales(dish_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_flash_sales_restaurant ON flash_sales(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_flash_sales_timing ON flash_sales(starts_at, ends_at) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_flash_sales_active ON flash_sales(is_active, display_order) WHERE deleted_at IS NULL;

-- Banners indexes
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_banners_timing ON banners(starts_at, ends_at) WHERE deleted_at IS NULL AND is_active = true;

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number) WHERE deleted_at IS NULL;

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_dish ON order_items(dish_id);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_restaurant ON favorites(restaurant_id) WHERE restaurant_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_favorites_dish ON favorites(dish_id) WHERE dish_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_favorites_type ON favorites(type);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Create triggers for all tables that need updated_at
CREATE TRIGGER IF NOT EXISTS trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_flash_sales_updated_at
  BEFORE UPDATE ON flash_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS trigger_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Addresses policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'addresses' AND policyname = 'Users can manage own addresses') THEN
    CREATE POLICY "Users can manage own addresses"
      ON addresses FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Public read policies for content tables
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'restaurants' AND policyname = 'Public restaurants are viewable by everyone') THEN
    CREATE POLICY "Public restaurants are viewable by everyone"
      ON restaurants FOR SELECT
      USING (deleted_at IS NULL AND is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dishes' AND policyname = 'Public dishes are viewable by everyone') THEN
    CREATE POLICY "Public dishes are viewable by everyone"
      ON dishes FOR SELECT
      USING (deleted_at IS NULL AND is_available = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Categories are viewable by everyone') THEN
    CREATE POLICY "Categories are viewable by everyone"
      ON categories FOR SELECT
      USING (is_active = true AND deleted_at IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Deals are viewable by everyone') THEN
    CREATE POLICY "Deals are viewable by everyone"
      ON deals FOR SELECT
      USING (is_active = true AND deleted_at IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collections' AND policyname = 'Collections are viewable by everyone') THEN
    CREATE POLICY "Collections are viewable by everyone"
      ON collections FOR SELECT
      USING (is_active = true AND deleted_at IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'flash_sales' AND policyname = 'Flash sales are viewable by everyone') THEN
    CREATE POLICY "Flash sales are viewable by everyone"
      ON flash_sales FOR SELECT
      USING (is_active = true AND deleted_at IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banners' AND policyname = 'Banners are viewable by everyone') THEN
    CREATE POLICY "Banners are viewable by everyone"
      ON banners FOR SELECT
      USING (is_active = true AND deleted_at IS NULL);
  END IF;
END $$;

-- Orders policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can manage own orders') THEN
    CREATE POLICY "Users can manage own orders"
      ON orders FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can manage own order items') THEN
    CREATE POLICY "Users can manage own order items"
      ON order_items FOR ALL
      USING (EXISTS (
        SELECT 1 FROM orders o
        WHERE o.id = order_items.order_id
        AND o.user_id = auth.uid()
      ));
  END IF;
END $$;

-- Favorites policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favorites' AND policyname = 'Users can manage own favorites') THEN
    CREATE POLICY "Users can manage own favorites"
      ON favorites FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Notifications policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can manage own notifications') THEN
    CREATE POLICY "Users can manage own notifications"
      ON notifications FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles with authentication and preferences';
COMMENT ON TABLE addresses IS 'User delivery addresses with geolocation';
COMMENT ON TABLE restaurants IS 'Restaurant information and business details';
COMMENT ON TABLE dishes IS 'Menu items for restaurants';
COMMENT ON TABLE categories IS 'Food categories for navigation and filtering';
COMMENT ON TABLE deals IS 'Special deals and promotions';
COMMENT ON TABLE collections IS 'Curated collections of restaurants or dishes';
COMMENT ON TABLE flash_sales IS 'Limited-time flash sales with quantity limits';
COMMENT ON TABLE banners IS 'Promotional banners for home screen';
COMMENT ON TABLE orders IS 'Customer orders with delivery information';
COMMENT ON TABLE order_items IS 'Individual items within orders';
COMMENT ON TABLE favorites IS 'User favorites (restaurants and dishes)';
COMMENT ON TABLE notifications IS 'User notifications and alerts';

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample categories
INSERT INTO categories (name, slug, icon, bg_color, is_special, display_order) VALUES
('Deal 0đ', 'deal-0d', 'flash', '#FFD700', true, 1),
('Ăn khuya', 'an-khuya', 'moon', '#8B5CF6', false, 2),
('Freeship', 'freeship', 'bicycle', '#10B981', false, 3),
('Món mới', 'mon-moi', 'sparkles', '#F59E0B', false, 4),
('Bán chạy', 'ban-chay', 'trending-up', '#EF4444', false, 5),
('Đồ uống', 'do-uong', 'cafe', '#8B4513', false, 6),
('Ăn vặt', 'an-vat', 'fast-food', '#EC4899', false, 7),
('Món Việt', 'mon-viet', 'restaurant', '#06B6D4', false, 8),
('Món Á', 'mon-a', 'fish', '#F97316', false, 9),
('Món Âu', 'mon-au', 'pizza', '#6366F1', false, 10),
('Tráng miệng', 'trang-mieng', 'ice-cream', '#EC4899', false, 11),
('Lẩu nướng', 'lau-nuong', 'flame', '#DC2626', false, 12)
ON CONFLICT (slug) DO NOTHING;

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

-- Insert sample dishes
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

-- Insert sample banners
INSERT INTO banners (title, subtitle, image, action_type, action_data, display_order) VALUES
('Khuyến mãi đặc biệt', 'Giảm giá lên đến 50%', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'category', '{"category_slug": "deal-0d"}', 1),
('Món mới hấp dẫn', 'Thử ngay những món ăn mới nhất', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 'category', '{"category_slug": "mon-moi"}', 2),
('Freeship 0đ', 'Miễn phí giao hàng toàn bộ đơn hàng', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'category', '{"category_slug": "freeship"}', 3),
('Ăn vặt ngon', 'Những món ăn vặt không thể bỏ qua', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800', 'category', '{"category_slug": "an-vat"}', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$ BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'DATABASE SCHEMA SETUP COMPLETED SUCCESSFULLY';
  RAISE NOTICE 'Version: 5.0.0';
  RAISE NOTICE 'Date: 2025-11-11';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Features included:';
  RAISE NOTICE '- Complete 13-table schema';
  RAISE NOTICE '- Navigation logic compatibility';
  RAISE NOTICE '- Universal column compatibility';
  RAISE NOTICE '- Sample data with proper UUIDs';
  RAISE NOTICE '- Row Level Security (RLS)';
  RAISE NOTICE '- Performance indexes';
  RAISE NOTICE '- Automatic triggers';
  RAISE NOTICE '============================================';
END $$;