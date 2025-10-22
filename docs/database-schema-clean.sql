CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

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

CREATE TYPE payment_method AS ENUM (
  'cash',
  'credit_card',
  'debit_card',
  'paypal',
  'momo',
  'zalopay',
  'bank_transfer'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

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

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  avatar TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  preferred_language TEXT DEFAULT 'vi' CHECK (preferred_language IN ('vi', 'en')),
  notification_enabled BOOLEAN DEFAULT true,
  email_notification_enabled BOOLEAN DEFAULT true,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_phone ON profiles(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_name_search ON profiles USING gin(name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL CHECK (label IN ('home', 'work', 'other')),
  full_address TEXT NOT NULL,
  street TEXT,
  ward TEXT,
  district TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contact_name TEXT,
  contact_phone TEXT,
  delivery_instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_addresses_user ON addresses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_user_default ON addresses(user_id, is_default) WHERE deleted_at IS NULL;
CREATE INDEX idx_addresses_coordinates ON addresses(latitude, longitude) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_addresses_user_single_default ON addresses(user_id) WHERE is_default = true AND deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT NOT NULL,
  district TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  cuisines TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  order_count INTEGER DEFAULT 0 CHECK (order_count >= 0),
  delivery_time_min INTEGER,
  delivery_time_max INTEGER,
  delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
  minimum_order DECIMAL(10,2) DEFAULT 0 CHECK (minimum_order >= 0),
  free_delivery_threshold DECIMAL(10,2),
  operating_hours JSONB DEFAULT '{
    "monday": {"open": "09:00", "close": "22:00"},
    "tuesday": {"open": "09:00", "close": "22:00"},
    "wednesday": {"open": "09:00", "close": "22:00"},
    "thursday": {"open": "09:00", "close": "22:00"},
    "friday": {"open": "09:00", "close": "22:00"},
    "saturday": {"open": "09:00", "close": "23:00"},
    "sunday": {"open": "09:00", "close": "23:00"}
  }'::jsonb,
  is_open BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  has_promotion BOOLEAN DEFAULT false,
  promotion_text TEXT,
  promotion_discount DECIMAL(5,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_restaurants_is_open ON restaurants(is_open) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_is_featured ON restaurants(is_featured) WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_restaurants_categories ON restaurants USING gin(categories);
CREATE INDEX idx_restaurants_coordinates ON restaurants(latitude, longitude) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_city ON restaurants(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_name_search ON restaurants USING gin(name gin_trgm_ops);
CREATE INDEX idx_restaurants_description_search ON restaurants USING gin(description gin_trgm_ops);

CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  sold_count INTEGER DEFAULT 0 CHECK (sold_count >= 0),
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_quantity INTEGER,
  preparation_time INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE(restaurant_id, slug)
);

CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_category ON dishes(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_available ON dishes(is_available) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_featured ON dishes(is_featured) WHERE deleted_at IS NULL AND is_available = true;
CREATE INDEX idx_dishes_rating ON dishes(rating DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_price ON dishes(price) WHERE deleted_at IS NULL;
CREATE INDEX idx_dishes_tags ON dishes USING gin(tags);
CREATE INDEX idx_dishes_name_search ON dishes USING gin(name gin_trgm_ops);
CREATE INDEX idx_dishes_description_search ON dishes USING gin(description gin_trgm_ops);
CREATE INDEX idx_dishes_restaurant_available ON dishes(restaurant_id, is_available) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  address_id UUID REFERENCES addresses(id),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
  service_fee DECIMAL(10,2) DEFAULT 0 CHECK (service_fee >= 0),
  tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  coupon_code TEXT,
  discount_percentage DECIMAL(5,2),
  status order_status DEFAULT 'pending' NOT NULL,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  delivery_address JSONB NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  driver_id UUID,
  driver_assigned_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review TEXT,
  reviewed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status) WHERE status NOT IN ('delivered', 'cancelled');
CREATE INDEX idx_orders_payment_status ON orders(payment_status) WHERE payment_status != 'completed';
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_estimated_delivery ON orders(estimated_delivery) WHERE status IN ('confirmed', 'preparing', 'out_for_delivery');

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) NOT NULL,
  dish_name TEXT NOT NULL,
  dish_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  notes TEXT,
  options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_dish ON order_items(dish_id);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (
    (restaurant_id IS NOT NULL AND dish_id IS NULL) OR
    (restaurant_id IS NULL AND dish_id IS NOT NULL)
  ),
  UNIQUE (user_id, restaurant_id),
  UNIQUE (user_id, dish_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_restaurant ON favorites(restaurant_id) WHERE restaurant_id IS NOT NULL;
CREATE INDEX idx_favorites_dish ON favorites(dish_id) WHERE dish_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  food_quality_rating DECIMAL(2,1) CHECK (food_quality_rating >= 0 AND food_quality_rating <= 5),
  delivery_rating DECIMAL(2,1) CHECK (delivery_rating >= 0 AND delivery_rating <= 5),
  value_rating DECIMAL(2,1) CHECK (value_rating >= 0 AND value_rating <= 5),
  is_visible BOOLEAN DEFAULT true,
  is_verified_purchase BOOLEAN DEFAULT true,
  response TEXT,
  response_at TIMESTAMPTZ,
  helpful_count INTEGER DEFAULT 0 CHECK (helpful_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(order_id)
);

CREATE INDEX idx_reviews_user ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at DESC) WHERE is_visible = true;
CREATE INDEX idx_reviews_dish ON reviews(dish_id, created_at DESC) WHERE is_visible = true AND dish_id IS NOT NULL;
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_verified ON reviews(is_verified_purchase) WHERE is_visible = true;

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  action_url TEXT,
  action_label TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  sent_via TEXT[] DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_order ON notifications(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_delivery')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  max_discount DECIMAL(10,2),
  minimum_order DECIMAL(10,2) DEFAULT 0,
  applicable_to TEXT CHECK (applicable_to IN ('all', 'specific_restaurants', 'first_order')),
  restaurant_ids UUID[],
  usage_limit INTEGER,
  usage_per_user INTEGER DEFAULT 1,
  current_usage INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_coupons_code ON coupons(code) WHERE is_active = true;
CREATE INDEX idx_coupons_validity ON coupons(valid_from, valid_until) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(coupon_id, order_id)
);

CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  action_type TEXT CHECK (action_type IN ('restaurant', 'dish', 'category', 'url', 'coupon', 'none')),
  action_value TEXT,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  background_color TEXT,
  text_color TEXT DEFAULT '#FFFFFF',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_banners_active ON banners(is_active, display_order) WHERE deleted_at IS NULL;
CREATE INDEX idx_banners_dates ON banners(start_date, end_date) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_banners_restaurant ON banners(restaurant_id) WHERE restaurant_id IS NOT NULL;

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active restaurants" ON restaurants FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Anyone can view available dishes" ON dishes FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending orders" ON orders FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view visible reviews" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Users can create reviews for own orders" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM orders WHERE orders.id = reviews.order_id AND orders.user_id = auth.uid() AND orders.status = 'delivered'));
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true AND valid_from <= NOW() AND valid_until >= NOW() AND (usage_limit IS NULL OR current_usage < usage_limit));
CREATE POLICY "Users can view own coupon usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT USING (
  is_active = true 
  AND deleted_at IS NULL 
  AND (start_date IS NULL OR start_date <= NOW()) 
  AND (end_date IS NULL OR end_date >= NOW())
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  sequence_num TEXT;
  new_order_number TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT LPAD((COUNT(*) + 1)::TEXT, 6, '0') INTO sequence_num FROM orders WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  new_order_number := 'ORD-' || year_part || '-' || sequence_num;
  NEW.order_number := new_order_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION generate_order_number();

-- =============================================
-- Banner Analytics Functions
-- =============================================

CREATE OR REPLACE FUNCTION increment_banner_clicks(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE banners SET click_count = click_count + 1 WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_banner_impressions(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE banners SET impression_count = impression_count + 1 WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_id_val UUID;
BEGIN
  restaurant_id_val := COALESCE(NEW.restaurant_id, OLD.restaurant_id);
  UPDATE restaurants SET 
    rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE restaurant_id = restaurant_id_val AND is_visible = true), 0),
    review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = restaurant_id_val AND is_visible = true)
  WHERE id = restaurant_id_val;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_rating_on_review_change AFTER INSERT OR UPDATE OR DELETE ON reviews FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

CREATE OR REPLACE FUNCTION update_dish_rating()
RETURNS TRIGGER AS $$
DECLARE
  dish_id_val UUID;
BEGIN
  dish_id_val := COALESCE(NEW.dish_id, OLD.dish_id);
  IF dish_id_val IS NOT NULL THEN
    UPDATE dishes SET 
      rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE dish_id = dish_id_val AND is_visible = true), 0),
      review_count = (SELECT COUNT(*) FROM reviews WHERE dish_id = dish_id_val AND is_visible = true)
    WHERE id = dish_id_val;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dish_rating_on_review_change AFTER INSERT OR UPDATE OR DELETE ON reviews FOR EACH ROW EXECUTE FUNCTION update_dish_rating();

CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    UPDATE profiles SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_stats_on_order_delivered AFTER UPDATE ON orders FOR EACH ROW WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered') EXECUTE FUNCTION update_profile_stats();

CREATE OR REPLACE FUNCTION update_restaurant_order_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    UPDATE restaurants SET order_count = order_count + 1 WHERE id = NEW.restaurant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurant_order_count_on_delivered AFTER UPDATE ON orders FOR EACH ROW WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered') EXECUTE FUNCTION update_restaurant_order_count();

CREATE OR REPLACE FUNCTION update_dish_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    UPDATE dishes d SET sold_count = sold_count + oi.quantity FROM order_items oi WHERE oi.order_id = NEW.id AND oi.dish_id = d.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dish_sold_count_on_delivered AFTER UPDATE ON orders FOR EACH ROW WHEN (NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered') EXECUTE FUNCTION update_dish_sold_count();

CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

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
WHERE d.deleted_at IS NULL AND r.deleted_at IS NULL AND r.is_active = true;

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
WHERE d.deleted_at IS NULL AND d.is_available = true AND r.deleted_at IS NULL AND r.is_active = true
GROUP BY d.id, r.id
HAVING COUNT(oi.id) > 0
ORDER BY total_sold DESC, order_count DESC;

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

-- =============================================
-- BANNERS TABLE (Added 2024-12-22)
-- =============================================

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  
  action_type TEXT CHECK (action_type IN ('restaurant', 'dish', 'category', 'url', 'coupon', 'none')),
  action_value TEXT,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  
  background_color TEXT,
  text_color TEXT DEFAULT '#FFFFFF',
  
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_banners_active 
  ON banners(is_active) 
  WHERE is_active = true AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_banners_dates 
  ON banners(start_date, end_date) 
  WHERE is_active = true AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_banners_restaurant 
  ON banners(restaurant_id) 
  WHERE restaurant_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_banners_display_order 
  ON banners(display_order, created_at);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners
  FOR SELECT
  USING (
    is_active = true 
    AND deleted_at IS NULL 
    AND (start_date IS NULL OR start_date <= NOW()) 
    AND (end_date IS NULL OR end_date >= NOW())
  );

CREATE OR REPLACE FUNCTION increment_banner_clicks(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE banners 
  SET click_count = click_count + 1, updated_at = NOW() 
  WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_banner_impressions(banner_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE banners 
  SET impression_count = impression_count + 1, updated_at = NOW() 
  WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_banner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_banner_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_banner_updated_at();

