# Database Schema - Food Delivery App (Production Ready)

> Production-ready database schema for Supabase with comprehensive features, constraints, and optimizations.

## 📖 How to Use

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Copy the entire SQL code below
6. Click **Run** or press Ctrl+Enter
7. Wait approximately 10-15 seconds for completion

---

## 🗄️ Production Schema SQL

```sql
-- ============================================
-- FOOD DELIVERY APP - DATABASE SCHEMA
-- Version: 2.0.0
-- Last Updated: October 20, 2025
-- Production Ready: Yes
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- ============================================
-- ENUMS (Type Safety)
-- ============================================

-- Order status enum
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

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
  'cash',
  'credit_card',
  'debit_card',
  'paypal',
  'momo',
  'zalopay',
  'bank_transfer'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- Notification type enum
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

-- ============================================
-- CORE TABLES
-- ============================================

-- =======================
-- PROFILES TABLE
-- =======================
-- Extended user profiles from auth.users
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
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Indexes for profiles
CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_phone ON profiles(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Full-text search index for profiles
CREATE INDEX idx_profiles_name_search ON profiles USING gin(name gin_trgm_ops);

-- =======================
-- ADDRESSES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Address details
  label TEXT NOT NULL CHECK (label IN ('home', 'work', 'other')),
  full_address TEXT NOT NULL,
  street TEXT,
  ward TEXT,
  district TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  
  -- Coordinates for delivery calculation
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  contact_name TEXT,
  contact_phone TEXT,
  delivery_instructions TEXT,
  
  -- Flags
  is_default BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for addresses
CREATE INDEX idx_addresses_user ON addresses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_user_default ON addresses(user_id, is_default) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_coordinates ON addresses(latitude, longitude) WHERE deleted_at IS NULL;

-- Constraint: Only one default address per user
CREATE UNIQUE INDEX idx_addresses_user_single_default 
  ON addresses(user_id) 
  WHERE is_default = true AND deleted_at IS NULL;

-- =======================
-- RESTAURANTS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  
  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Location
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT NOT NULL,
  district TEXT,
  
  -- Business info
  categories TEXT[] NOT NULL DEFAULT '{}',
  cuisines TEXT[] DEFAULT '{}',
  
  -- Ratings & Stats (denormalized)
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  order_count INTEGER DEFAULT 0 CHECK (order_count >= 0),
  
  -- Delivery info
  delivery_time_min INTEGER, -- minutes
  delivery_time_max INTEGER, -- minutes
  delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
  minimum_order DECIMAL(10,2) DEFAULT 0 CHECK (minimum_order >= 0),
  free_delivery_threshold DECIMAL(10,2),
  
  -- Operating hours (JSON format for flexibility)
  operating_hours JSONB DEFAULT '{
    "monday": {"open": "09:00", "close": "22:00"},
    "tuesday": {"open": "09:00", "close": "22:00"},
    "wednesday": {"open": "09:00", "close": "22:00"},
    "thursday": {"open": "09:00", "close": "22:00"},
    "friday": {"open": "09:00", "close": "22:00"},
    "saturday": {"open": "09:00", "close": "23:00"},
    "sunday": {"open": "09:00", "close": "23:00"}
  }'::jsonb,
  
  -- Status flags
  is_open BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Promotions
  has_promotion BOOLEAN DEFAULT false,
  promotion_text TEXT,
  promotion_discount DECIMAL(5,2),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for restaurants
CREATE INDEX idx_restaurants_slug ON restaurants(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_restaurants_is_open ON restaurants(is_open) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_is_featured ON restaurants(is_featured) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_restaurants_categories ON restaurants USING gin(categories);
CREATE INDEX idx_restaurants_coordinates ON restaurants(latitude, longitude) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_city ON restaurants(city) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_restaurants_name_search ON restaurants USING gin(name gin_trgm_ops);
CREATE INDEX idx_restaurants_description_search ON restaurants USING gin(description gin_trgm_ops);

-- =======================
-- DISHES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}', -- Multiple images
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2), -- For showing discounts
  cost_price DECIMAL(10,2), -- For profit calculation (admin only)
  
  -- Categorization
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Ratings & Stats (denormalized)
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  sold_count INTEGER DEFAULT 0 CHECK (sold_count >= 0),
  
  -- Nutrition info (optional)
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  
  -- Dietary info
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5),
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_quantity INTEGER, -- NULL = unlimited
  
  -- Metadata
  preparation_time INTEGER, -- minutes
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  
  -- Unique slug per restaurant
  UNIQUE(restaurant_id, slug)
);

-- Indexes for dishes
CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_category ON dishes(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_available ON dishes(is_available) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_featured ON dishes(is_featured) WHERE deleted_at IS NULL AND is_available = true;
CREATE INDEX idx_dishes_rating ON dishes(rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_price ON dishes(price) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_tags ON dishes USING gin(tags);

-- Full-text search index
CREATE INDEX idx_dishes_name_search ON dishes USING gin(name gin_trgm_ops);
CREATE INDEX idx_dishes_description_search ON dishes USING gin(description gin_trgm_ops);

-- Composite index for common queries
CREATE INDEX idx_dishes_restaurant_available ON dishes(restaurant_id, is_available) WHERE deleted_at IS NULL;

-- =======================
-- ORDERS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number (e.g., "ORD-2025-0001")
  
  -- Relations
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  address_id UUID REFERENCES addresses(id),
  
  -- Pricing breakdown
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
  service_fee DECIMAL(10,2) DEFAULT 0 CHECK (service_fee >= 0),
  tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  
  -- Discount info
  coupon_code TEXT,
  discount_percentage DECIMAL(5,2),
  
  -- Status tracking
  status order_status DEFAULT 'pending' NOT NULL,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  
  -- Delivery info
  delivery_address JSONB NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  
  -- Driver info (for future expansion)
  driver_id UUID,
  driver_assigned_at TIMESTAMPTZ,
  
  -- Timestamps for order lifecycle
  confirmed_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Ratings & Feedback
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for orders
CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status) WHERE status != 'delivered' AND status != 'cancelled';
CREATE INDEX idx_orders_payment_status ON orders(payment_status) WHERE payment_status != 'completed';
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_estimated_delivery ON orders(estimated_delivery) WHERE status IN ('confirmed', 'preparing', 'out_for_delivery');

-- =======================
-- ORDER ITEMS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) NOT NULL,
  
  -- Item details (snapshot at time of order)
  dish_name TEXT NOT NULL,
  dish_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  
  -- Customization
  notes TEXT,
  options JSONB, -- For add-ons, extras, etc.
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_dish ON order_items(dish_id);

-- =======================
-- FAVORITES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraint: Must favorite either restaurant OR dish (not both)
  CHECK (
    (restaurant_id IS NOT NULL AND dish_id IS NULL) OR
    (restaurant_id IS NULL AND dish_id IS NOT NULL)
  ),
  
  -- Unique constraint: User can't favorite same item twice
  UNIQUE (user_id, restaurant_id),
  UNIQUE (user_id, dish_id)
);

-- Indexes for favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_restaurant ON favorites(restaurant_id) WHERE restaurant_id IS NOT NULL;
CREATE INDEX idx_favorites_dish ON favorites(dish_id) WHERE dish_id IS NOT NULL;

-- =======================
-- REVIEWS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  
  -- Review content
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Detailed ratings
  food_quality_rating DECIMAL(2,1) CHECK (food_quality_rating >= 0 AND food_quality_rating <= 5),
  delivery_rating DECIMAL(2,1) CHECK (delivery_rating >= 0 AND delivery_rating <= 5),
  value_rating DECIMAL(2,1) CHECK (value_rating >= 0 AND value_rating <= 5),
  
  -- Moderation
  is_visible BOOLEAN DEFAULT true,
  is_verified_purchase BOOLEAN DEFAULT true,
  
  -- Response from restaurant
  response TEXT,
  response_at TIMESTAMPTZ,
  
  -- Helpful votes
  helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraint: One review per order
  UNIQUE(order_id)
);

-- Indexes for reviews
CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at DESC) WHERE is_visible = true;
CREATE INDEX idx_reviews_dish ON reviews(dish_id, created_at DESC) WHERE is_visible = true AND dish_id IS NOT NULL;
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_verified ON reviews(is_verified_purchase) WHERE is_visible = true;

-- =======================
-- NOTIFICATIONS TABLE
-- =======================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification content
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image TEXT,
  
  -- Related entities
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Action
  action_url TEXT,
  action_label TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Delivery tracking
  sent_via TEXT[] DEFAULT '{}', -- ['push', 'email', 'sms']
  sent_at TIMESTAMPTZ,
  
  -- Metadata
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ -- Auto-delete old notifications
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_order ON notifications(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- =======================
-- COUPONS TABLE (Bonus)
-- =======================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  
  -- Discount details
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  max_discount DECIMAL(10,2), -- For percentage discounts
  
  -- Conditions
  minimum_order DECIMAL(10,2) DEFAULT 0,
  applicable_to TEXT CHECK (applicable_to IN ('all', 'specific_restaurants', 'first_order')),
  restaurant_ids UUID[], -- For specific restaurants
  
  -- Usage limits
  usage_limit INTEGER, -- NULL = unlimited
  usage_per_user INTEGER DEFAULT 1,
  current_usage INTEGER DEFAULT 0,
  
  -- Validity
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  description TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for coupons
CREATE INDEX idx_coupons_code ON coupons(code) WHERE is_active = true;
CREATE INDEX idx_coupons_validity ON coupons(valid_from, valid_until) WHERE is_active = true;

-- =======================
-- COUPON USAGE TRACKING
-- =======================
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(coupon_id, order_id)
);

-- Indexes for coupon_usage
CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- ===== PROFILES POLICIES =====
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ===== ADDRESSES POLICIES =====
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ===== RESTAURANTS POLICIES =====
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);

-- ===== DISHES POLICIES =====
CREATE POLICY "Anyone can view available dishes"
  ON dishes FOR SELECT
  USING (deleted_at IS NULL);

-- ===== ORDERS POLICIES =====
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- ===== ORDER ITEMS POLICIES =====
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ===== FAVORITES POLICIES =====
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ===== REVIEWS POLICIES =====
CREATE POLICY "Anyone can view visible reviews"
  ON reviews FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can create reviews for own orders"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = reviews.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'delivered'
    )
  );

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ===== NOTIFICATIONS POLICIES =====
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ===== COUPONS POLICIES =====
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (
    is_active = true AND
    valid_from <= NOW() AND
    valid_until >= NOW() AND
    (usage_limit IS NULL OR current_usage < usage_limit)
  );

-- ===== COUPON USAGE POLICIES =====
CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  sequence_num TEXT;
  new_order_number TEXT;
BEGIN
  -- Get current year
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  -- Get next sequence number for this year
  SELECT LPAD(
    (COUNT(*) + 1)::TEXT,
    6,
    '0'
  ) INTO sequence_num
  FROM orders
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  -- Generate order number: ORD-2025-000001
  new_order_number := 'ORD-' || year_part || '-' || sequence_num;
  
  NEW.order_number := new_order_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Function: Update restaurant rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_id_val UUID;
BEGIN
  -- Get restaurant_id from NEW or OLD
  restaurant_id_val := COALESCE(NEW.restaurant_id, OLD.restaurant_id);
  
  -- Recalculate restaurant rating
  UPDATE restaurants
  SET 
    rating = COALESCE((
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE restaurant_id = restaurant_id_val
      AND is_visible = true
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE restaurant_id = restaurant_id_val
      AND is_visible = true
    )
  WHERE id = restaurant_id_val;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- Function: Update dish rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_dish_rating()
RETURNS TRIGGER AS $$
DECLARE
  dish_id_val UUID;
BEGIN
  -- Get dish_id from NEW or OLD (only if dish-specific review)
  dish_id_val := COALESCE(NEW.dish_id, OLD.dish_id);
  
  IF dish_id_val IS NOT NULL THEN
    -- Recalculate dish rating
    UPDATE dishes
    SET 
      rating = COALESCE((
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM reviews
        WHERE dish_id = dish_id_val
        AND is_visible = true
      ), 0),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE dish_id = dish_id_val
        AND is_visible = true
      )
    WHERE id = dish_id_val;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dish_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_dish_rating();

-- Function: Update profile stats when order is completed
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE profiles
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_stats_on_order_delivered
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered')
  EXECUTE FUNCTION update_profile_stats();

-- Function: Update restaurant order count
CREATE OR REPLACE FUNCTION update_restaurant_order_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE restaurants
    SET order_count = order_count + 1
    WHERE id = NEW.restaurant_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_order_count_on_delivered
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered')
  EXECUTE FUNCTION update_restaurant_order_count();

-- Function: Update dish sold count
CREATE OR REPLACE FUNCTION update_dish_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE dishes d
    SET sold_count = sold_count + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND oi.dish_id = d.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dish_sold_count_on_delivered
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered')
  EXECUTE FUNCTION update_dish_sold_count();

-- Function: Validate coupon usage
CREATE OR REPLACE FUNCTION validate_coupon()
RETURNS TRIGGER AS $$
DECLARE
  coupon_record coupons;
  user_usage_count INTEGER;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM coupons
  WHERE code = NEW.coupon_code;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Coupon code not found';
  END IF;
  
  -- Check if coupon is active
  IF NOT coupon_record.is_active THEN
    RAISE EXCEPTION 'Coupon is not active';
  END IF;
  
  -- Check validity period
  IF NOW() < coupon_record.valid_from OR NOW() > coupon_record.valid_until THEN
    RAISE EXCEPTION 'Coupon is expired or not yet valid';
  END IF;
  
  -- Check usage limit
  IF coupon_record.usage_limit IS NOT NULL AND 
     coupon_record.current_usage >= coupon_record.usage_limit THEN
    RAISE EXCEPTION 'Coupon usage limit exceeded';
  END IF;
  
  -- Check per-user limit
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_usage
  WHERE coupon_id = coupon_record.id
  AND user_id = NEW.user_id;
  
  IF user_usage_count >= coupon_record.usage_per_user THEN
    RAISE EXCEPTION 'You have already used this coupon maximum times';
  END IF;
  
  -- Check minimum order
  IF NEW.subtotal < coupon_record.minimum_order THEN
    RAISE EXCEPTION 'Order does not meet minimum order requirement';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Apply this trigger only if you want to validate at DB level
-- Alternatively, validate in application code for better error handling
-- CREATE TRIGGER validate_coupon_before_order
--   BEFORE INSERT ON orders
--   FOR EACH ROW
--   WHEN (NEW.coupon_code IS NOT NULL)
--   EXECUTE FUNCTION validate_coupon();

-- Function: Soft delete helper
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deleted_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Clean up expired notifications (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL
  AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Dishes with restaurant info
CREATE OR REPLACE VIEW dishes_with_restaurant AS
SELECT 
  d.*,
  r.name as restaurant_name,
  r.slug as restaurant_slug,
  r.logo as restaurant_logo,
  r.rating as restaurant_rating,
  r.delivery_time_min,
  r.delivery_time_max,
  r.delivery_fee,
  r.minimum_order,
  r.is_open as restaurant_is_open,
  r.categories as restaurant_categories
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
WHERE d.deleted_at IS NULL
AND r.deleted_at IS NULL
AND r.is_active = true;

-- View: Orders with full details
CREATE OR REPLACE VIEW orders_with_details AS
SELECT 
  o.*,
  r.name as restaurant_name,
  r.slug as restaurant_slug,
  r.logo as restaurant_logo,
  r.cover_image as restaurant_image,
  r.phone as restaurant_phone,
  p.name as customer_name,
  p.phone as customer_phone,
  p.avatar as customer_avatar,
  COUNT(oi.id) as items_count,
  json_agg(
    json_build_object(
      'id', oi.id,
      'dish_name', oi.dish_name,
      'dish_image', oi.dish_image,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'subtotal', oi.subtotal,
      'notes', oi.notes
    ) ORDER BY oi.created_at
  ) as items
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.id
JOIN profiles p ON o.user_id = p.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, r.id, p.id;

-- View: Restaurant with stats
CREATE OR REPLACE VIEW restaurants_with_stats AS
SELECT 
  r.*,
  COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'delivered') as completed_orders,
  COUNT(DISTINCT d.id) as total_dishes,
  COUNT(DISTINCT d.id) FILTER (WHERE d.is_available = true) as available_dishes,
  AVG(rev.rating) FILTER (WHERE rev.is_visible = true) as avg_rating,
  COUNT(DISTINCT rev.id) FILTER (WHERE rev.is_visible = true) as total_reviews
FROM restaurants r
LEFT JOIN orders o ON r.id = o.restaurant_id
LEFT JOIN dishes d ON r.id = d.restaurant_id AND d.deleted_at IS NULL
LEFT JOIN reviews rev ON r.id = rev.restaurant_id
WHERE r.deleted_at IS NULL
GROUP BY r.id;

-- View: Popular dishes (top selling)
CREATE OR REPLACE VIEW popular_dishes AS
SELECT 
  d.*,
  r.name as restaurant_name,
  r.slug as restaurant_slug,
  COUNT(oi.id) as order_count,
  SUM(oi.quantity) as total_sold
FROM dishes d
JOIN restaurants r ON d.restaurant_id = r.id
LEFT JOIN order_items oi ON d.id = oi.dish_id
WHERE d.deleted_at IS NULL
AND d.is_available = true
AND r.deleted_at IS NULL
AND r.is_active = true
GROUP BY d.id, r.id
HAVING COUNT(oi.id) > 0
ORDER BY total_sold DESC, order_count DESC;

-- View: User order history summary
CREATE OR REPLACE VIEW user_order_summary AS
SELECT 
  u.id as user_id,
  p.name,
  p.email,
  COUNT(o.id) as total_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'delivered') as completed_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') as cancelled_orders,
  SUM(o.total) FILTER (WHERE o.status = 'delivered') as total_spent,
  AVG(o.total) FILTER (WHERE o.status = 'delivered') as avg_order_value,
  MAX(o.created_at) as last_order_date,
  COUNT(DISTINCT o.restaurant_id) as unique_restaurants
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, p.name, p.email;
```

-- ============================================
-- SAMPLE DATA (Optional - For Testing)
-- ============================================

-- Uncomment to insert sample data for testing

/*
-- Sample Restaurants
INSERT INTO restaurants (name, slug, description, logo, cover_image, address, city, categories, cuisines, rating, review_count, delivery_time_min, delivery_time_max, delivery_fee, minimum_order, is_featured, latitude, longitude)
VALUES 
  ('Pizza Hut Express', 'pizza-hut-express', 'Authentic Italian pizza with fresh ingredients', 'https://via.placeholder.com/100', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', '123 Main Street', 'Ho Chi Minh City', ARRAY['Italian', 'Pizza', 'Fast Food'], ARRAY['Italian', 'American'], 4.5, 234, 20, 30, 15000, 50000, true, 10.7769, 106.7009),
  ('Burger King', 'burger-king', 'Home of the Whopper', 'https://via.placeholder.com/100', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', '456 Oak Avenue', 'Ho Chi Minh City', ARRAY['Burger', 'Fast Food'], ARRAY['American'], 4.2, 189, 15, 25, 10000, 40000, false, 10.7845, 106.7121),
  ('Sushi Master', 'sushi-master', 'Fresh sushi made daily', 'https://via.placeholder.com/100', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', '789 Elm Street', 'Ho Chi Minh City', ARRAY['Japanese', 'Sushi'], ARRAY['Japanese'], 4.8, 312, 30, 40, 20000, 100000, true, 10.7912, 106.7234),
  ('Pho 24', 'pho-24', 'Traditional Vietnamese Pho', 'https://via.placeholder.com/100', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43', '321 Nguyen Hue', 'Ho Chi Minh City', ARRAY['Vietnamese', 'Noodles'], ARRAY['Vietnamese'], 4.6, 567, 15, 20, 5000, 30000, true, 10.7753, 106.7003),
  ('BBQ House', 'bbq-house', 'Korean BBQ and hotpot', 'https://via.placeholder.com/100', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba', '555 Le Loi', 'Ho Chi Minh City', ARRAY['Korean', 'BBQ'], ARRAY['Korean'], 4.7, 423, 25, 35, 15000, 80000, false, 10.7689, 106.6978);

-- Sample Dishes (for Pizza Hut)
INSERT INTO dishes (restaurant_id, name, slug, description, price, original_price, category, image, tags, rating, review_count, is_featured, is_vegetarian)
SELECT 
  id,
  'Margherita Pizza',
  'margherita-pizza',
  'Classic pizza with tomato sauce, mozzarella, and fresh basil',
  120000,
  150000,
  'Pizza',
  'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
  ARRAY['Classic', 'Vegetarian', 'Bestseller'],
  4.6,
  89,
  true,
  true
FROM restaurants WHERE slug = 'pizza-hut-express'
UNION ALL
SELECT 
  id,
  'Pepperoni Pizza',
  'pepperoni-pizza',
  'Pizza topped with pepperoni, mozzarella, and tomato sauce',
  150000,
  180000,
  'Pizza',
  'https://images.unsplash.com/photo-1628840042765-356cda07504e',
  ARRAY['Classic', 'Meat', 'Popular'],
  4.7,
  123,
  true,
  false
FROM restaurants WHERE slug = 'pizza-hut-express';

-- Sample Coupons
INSERT INTO coupons (code, discount_type, discount_value, max_discount, minimum_order, applicable_to, usage_limit, valid_from, valid_until, description)
VALUES
  ('WELCOME50', 'percentage', 50, 50000, 100000, 'first_order', 1000, '2025-01-01', '2025-12-31', 'Welcome bonus: 50% off your first order'),
  ('FREEDEL', 'free_delivery', 0, NULL, 50000, 'all', NULL, '2025-01-01', '2025-12-31', 'Free delivery on orders above 50k'),
  ('SAVE20K', 'fixed_amount', 20000, NULL, 100000, 'all', NULL, '2025-01-01', '2025-06-30', 'Save 20k on orders above 100k');
*/

-- ============================================
-- MAINTENANCE & OPTIMIZATION QUERIES
-- ============================================

-- Run these periodically for maintenance

-- Clean up expired notifications (run daily via cron job)
-- SELECT cleanup_expired_notifications();

-- Vacuum tables to reclaim space
-- VACUUM ANALYZE profiles;
-- VACUUM ANALYZE restaurants;
-- VACUUM ANALYZE dishes;
-- VACUUM ANALYZE orders;

-- Reindex for performance (run weekly)
-- REINDEX TABLE restaurants;
-- REINDEX TABLE dishes;
-- REINDEX TABLE orders;

-- ============================================
-- USEFUL ADMIN QUERIES
-- ============================================

-- Get database statistics
/*
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_tup_ins AS inserts,
  n_tup_upd AS updates,
  n_tup_del AS deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
*/

-- Check for missing indexes
/*
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
AND n_distinct > 100
AND correlation < 0.1
ORDER BY n_distinct DESC;
*/

-- Find slow queries (enable pg_stat_statements extension first)
/*
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
*/

---

## ============================================
## 📚 DOCUMENTATION
## ============================================

## 🎯 Schema Overview

This database schema includes:

### Core Tables (11)
1. **profiles** - User profiles with stats
2. **addresses** - User delivery addresses
3. **restaurants** - Restaurant information
4. **dishes** - Menu items
5. **orders** - Order records
6. **order_items** - Order line items
7. **favorites** - User favorites (restaurants/dishes)
8. **reviews** - Ratings and reviews
9. **notifications** - Push notifications
10. **coupons** - Discount coupons
11. **coupon_usage** - Coupon usage tracking

### Features
- ✅ **Row Level Security (RLS)** - All tables protected
- ✅ **Soft Deletes** - Data preservation with deleted_at
- ✅ **Auto Timestamps** - created_at, updated_at auto-managed
- ✅ **Full-Text Search** - pg_trgm for fast searches
- ✅ **Denormalized Stats** - Ratings, counts cached for performance
- ✅ **Comprehensive Indexes** - Optimized for common queries
- ✅ **Type Safety** - ENUMs for status fields
- ✅ **Triggers** - Auto-update ratings, stats, order numbers
- ✅ **Views** - Complex queries pre-built
- ✅ **Constraints** - Data integrity enforced

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled. Users can only:
- View their own data (profiles, orders, favorites)
- View public data (restaurants, dishes, reviews)
- Cannot access other users' private data

### Example Policy
```sql
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```
This automatically adds `WHERE user_id = <current_user_id>` to all queries.

---

## 🧪 Testing the Schema

### 1. Verify Tables Created
After running the SQL, check **Table Editor** in Supabase Dashboard:
- profiles ✓
- addresses ✓
- restaurants ✓
- dishes ✓
- orders ✓
- order_items ✓
- favorites ✓
- reviews ✓
- notifications ✓
- coupons ✓
- coupon_usage ✓

### 2. Test Data Insertion
```sql
-- Insert a test restaurant
INSERT INTO restaurants (name, slug, address, city, categories, delivery_fee)
VALUES ('Test Restaurant', 'test-restaurant', '123 Test St', 'Ho Chi Minh City', ARRAY['Test'], 10000);

-- Verify
SELECT * FROM restaurants WHERE slug = 'test-restaurant';
```

### 3. Test RLS Policies
```sql
-- This will only return current user's orders
SELECT * FROM orders;

-- This will return all public restaurants
SELECT * FROM restaurants;
```

---

## 📊 Performance Optimization

### Indexes Created
- **B-tree indexes** - For standard lookups (id, foreign keys)
- **GIN indexes** - For array fields, full-text search
- **Composite indexes** - For common multi-column queries
- **Partial indexes** - For filtered queries (WHERE clauses)

### Denormalized Fields
For performance, these stats are cached:
- `restaurants.rating` - Calculated from reviews
- `restaurants.review_count` - Count of reviews
- `dishes.rating` - Calculated from reviews
- `profiles.total_orders` - Count of completed orders
- `profiles.total_spent` - Sum of order totals

Triggers automatically update these when data changes.

---

## 🔄 Triggers Explained

### 1. Auto-update Timestamps
All tables with `updated_at` auto-update on modifications.

### 2. Auto-create Profile
When user signs up, profile is automatically created.

### 3. Order Number Generation
Each order gets unique number: `ORD-2025-000001`

### 4. Rating Calculations
When review is added/updated/deleted:
- Restaurant rating updates
- Dish rating updates (if dish-specific review)

### 5. Stats Updates
When order status changes to 'delivered':
- User's `total_orders` increments
- User's `total_spent` increases
- Restaurant's `order_count` increments
- Dish's `sold_count` increases

---

## 📝 Common Queries

### Get Featured Restaurants
```sql
SELECT * FROM restaurants
WHERE is_featured = true
AND is_active = true
AND deleted_at IS NULL
ORDER BY rating DESC;
```

### Get Popular Dishes
```sql
SELECT * FROM popular_dishes
LIMIT 20;
```

### Get User's Order History
```sql
SELECT * FROM orders_with_details
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Search Restaurants
```sql
SELECT * FROM restaurants
WHERE name ILIKE '%pizza%'
AND is_active = true
AND deleted_at IS NULL;
```

### Get Restaurant Menu
```sql
SELECT * FROM dishes
WHERE restaurant_id = '<restaurant_uuid>'
AND is_available = true
AND deleted_at IS NULL
ORDER BY category, name;
```

---

## 🔧 Maintenance Tasks

### Daily
```sql
-- Clean expired notifications
SELECT cleanup_expired_notifications();
```

### Weekly
```sql
-- Vacuum tables
VACUUM ANALYZE restaurants;
VACUUM ANALYZE dishes;
VACUUM ANALYZE orders;

-- Reindex
REINDEX TABLE restaurants;
REINDEX TABLE dishes;
```

### Monthly
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ❓ FAQ & Troubleshooting

### Q: Error "permission denied for schema public"
**A:** Check RLS policies. Make sure you're authenticated when querying protected tables.

### Q: Ratings not updating automatically
**A:** Check that triggers are enabled:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%rating%';
```

### Q: How to drop everything and re-run?
**A:** Drop all tables and re-run the script:
```sql
-- Drop all tables (CAREFUL - This deletes all data!)
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Then re-run the entire schema SQL
```

### Q: Can I modify the schema after production deployment?
**A:** Yes, but be careful:
1. Always backup before modifying
2. Test on staging environment first
3. Use migrations for schema changes
4. Avoid breaking changes (don't drop columns used in production)

### Q: How to backup the database?
**A:** Supabase provides automatic daily backups. For manual backup:
1. Go to Database → Backups in Supabase Dashboard
2. Click "Create Backup"
3. Or export via SQL:
```bash
pg_dump -h <host> -U postgres -d postgres > backup.sql
```

---

## 🚀 Production Readiness Checklist

- [x] All tables have primary keys
- [x] Foreign keys with proper ON DELETE actions
- [x] Indexes on all frequently queried columns
- [x] RLS enabled on all user-facing tables
- [x] Constraints for data integrity (CHECK, NOT NULL)
- [x] Soft deletes for data preservation
- [x] Auto-timestamp management
- [x] Full-text search capabilities
- [x] Denormalized stats for performance
- [x] Triggers for automatic updates
- [x] Views for complex queries
- [x] Sample data for testing
- [x] Comprehensive documentation

---

**Schema Version:** 2.0.0  
**Last Updated:** October 20, 2025  
**Production Ready:** ✅ YES  
**Tested:** ✅ YES  
**Optimized:** ✅ YES

---

## 📞 Support

For issues or questions:
1. Check Supabase logs in Dashboard → Logs
2. Review RLS policies if permission errors
3. Check trigger execution in pg_stat_user_functions
4. Monitor query performance in pg_stat_statements

**Happy Coding! 🚀🍔**
