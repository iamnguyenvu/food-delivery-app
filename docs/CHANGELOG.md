# 📝 Changelog

## October 27, 2025

### ✅ Commit 1: `8b81b50`
**Message:** "feat: complete login flow with OAuth and database schema"

**Changes:**
- ✅ Created 3 new screens: login, verify-otp, help-center
- ✅ Created complete database schema (14 tables)
- ✅ Added OAuth setup guide (Google, Github)
- ✅ Created comprehensive documentation (5 files)
- ✅ Loaded adaptive icon in login screen
- ✅ Added useCategories and useDeals hooks

**Files Changed:** 9 files, 507 insertions, 4 deletions

---

### ✅ Commit 2: `0e156fa`
**Message:** "refactor: restructure screens and fix app configuration"

**Changes:**
- ✅ Moved all screens to `(screens)` folder
- ✅ Set `headerShown: false` for all screens in layout
- ✅ Updated all navigation routes to new paths
- ✅ Fixed app name to "DearU Food" in all configs
- ✅ Fixed slug to "dearu-food" (removed spaces)
- ✅ Updated metro.config.js for web support
- ✅ Fixed import.meta error on web

**Files Changed:** 16 files, 36 insertions, 14 deletions

---

## 📂 New File Structure

```
app/
├── (screens)/                        ✨ NEW FOLDER
│   ├── _layout.tsx                   ✨ NEW (headerShown: false)
│   ├── login.tsx                     📍 MOVED
│   ├── verify-otp.tsx                📍 MOVED
│   ├── help-center.tsx               📍 MOVED
│   ├── address-input.tsx             📍 MOVED
│   ├── location-picker.tsx           📍 MOVED
│   └── location-map-picker.tsx       📍 MOVED
```

---

## 🐛 Fixes

### 1. Web Platform Error ✅
- **Issue:** `Cannot use 'import.meta' outside a module`
- **Solution:** Updated metro.config.js with transformer config

### 2. App Name Display ✅
- **Issue:** App showing "food-delivery" instead of "DearU Food"
- **Solution:** Updated app.json, app.config.js, package.json

### 3. Header Showing ✅
- **Issue:** Screens showing default Expo Router header
- **Solution:** Created (screens)/_layout.tsx with headerShown: false

---

## 📊 Session Statistics

- **Commits:** 2
- **Files Modified:** 25 total
- **Lines Added:** 543
- **Documentation:** 5 new files (~10,000 words)
- **Screens Created:** 3
- **Screens Moved:** 6
- **Configuration Updates:** 4 files

---

## 🎯 Testing Status

### Completed ✅
- [x] App name shows "DearU Food"
- [x] Navigation routes work
- [x] Web builds without errors
- [x] Android builds successfully

### Pending 📋
- [ ] Test OAuth integration
- [ ] Run database schema
- [ ] Test login flow end-to-end

---

**Branch:** `nguyenvu`  
**Last Commit:** `0e156fa`  
**Status:** 🟢 Ready for Development

---

# Previous Changelog - Những thay đổi trong dự án

## [26/10/2025] - Card Component & Profile Screen Implementation

### ✨ New Features

#### 1. **Card Component - Reusable UI Component**
**File:** `components/common/Card.tsx`

- ✅ Tạo component Card tái sử dụng để thay thế View
- ✅ Background màu trắng mặc định, có thể custom
- ✅ Border radius 12px mặc định, có thể custom
- ✅ Height tự động theo nội dung
- ✅ Hỗ trợ tất cả ViewProps

**Usage:**
```tsx
<Card backgroundColor="bg-white" borderRadius={12}>
  <Text>Your content</Text>
</Card>
```

#### 2. **Profile Screen - Complete Implementation**
**Files:**
- `components/profile/ProfileHeader.tsx` - Avatar + user info
- `components/profile/MenuItem.tsx` - Menu item với icon + label + chevron + badge
- `components/profile/MenuSection.tsx` - Nhóm menu items trong Card
- `app/(tabs)/profile.tsx` - Profile screen hoàn chỉnh

**Menu Sections:**
- 💰 Financial: Ví voucher, Xu tích lũy
- 💳 Payment & Address: Phương thức thanh toán, Địa chỉ
- 💬 Referral (Commented): Mời bạn bè, App chủ quán
- ⚙️ Help & Settings: Trung tâm trợ giúp, Cài đặt

**Features:**
- ✅ Header tương tự Index screen
- ✅ Avatar hình tròn (default icon nếu chưa có ảnh)
- ✅ Username từ email
- ✅ Full name từ user_metadata (optional)
- ✅ Badge cho vouchers và points
- ✅ Icon + Label + Chevron cho mỗi menu item
- ✅ Divider giữa các items
- ✅ Card component bọc từng section

#### 3. **GPS Auto-Save Address - Fixed**
**File:** `components/location/LocationPermissionModal.tsx`

- ✅ Fix lỗi sai định dạng Address type
- ✅ Auto-save địa chỉ sau khi GPS lấy tọa độ
- ✅ Sử dụng `formatAddress()` function đúng cách
- ✅ Hỗ trợ logged-in user (database) và guest (local storage)

**Code:**
```typescript
const addressData = formatAddress(results[0]);
if (user?.id) {
  await saveToDatabase(coords, addressData, "other", false);
} else {
  await LocationStorage.saveAddress({...});
}
```

---

### 📚 Documentation Updates

- ✅ `CARD_PROFILE_IMPLEMENTATION.md` - Complete guide for Card & Profile
- ✅ `IMPLEMENTATION_STATUS.md` - Updated status tracking
  - GPS auto-save: 🔄 → ✅
  - Profile Screen: ❌ → ✅
  - Card Component: NEW ✅

---

### 🐛 Bug Fixes

- Fixed `formatAddress()` return type handling in LocationPermissionModal
- Fixed border radius not applying dynamically in Card component
- Fixed marginBottom not working in MenuSection component

---

### 📝 Next Steps

1. Test Profile Screen on device/simulator
2. Create placeholder routes for Profile menu items
3. Add auto-save to Map Picker
4. Implement My Addresses Screen

---

## [19/10/2025] - Chuyển sang Supabase

### ✨ Thay đổi lớn

#### 1. **Bỏ Mock Data - Dùng Supabase Backend**

**Trước đây:**
- App dùng dữ liệu giả (mock data) trong file `mockData.ts`
- Không có database thực sự
- Chỉ phù hợp demo/học

**Bây giờ:**
- Kết nối trực tiếp với Supabase (PostgreSQL)
- Data thực từ database
- Sẵn sàng production

**Files thay đổi:**
- ❌ Xóa: `src/lib/mockData.ts`
- ✅ Sử dụng: `src/lib/supabase.ts`

---

#### 2. **Setup Environment Variables**

**Files mới:**
- `.env.example` - Template cho config
- `app.config.js` - Load env vars vào Expo

**Cách dùng:**
```bash
# Copy template
cp .env.example .env

# Điền thông tin Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

#### 3. **Cấu trúc `src/` mới**

```
src/
├── lib/
│   └── supabase.ts       # Supabase client (thay mockData.ts)
├── hooks/
│   ├── index.ts
│   └── useAuth.ts        # Hook xác thực
├── store/
│   └── cartStore.ts      # Zustand store (giữ nguyên)
└── types/
    └── index.ts          # TypeScript types
```

**Giải thích:**
- `lib/supabase.ts`: Khởi tạo Supabase client
- `hooks/useAuth.ts`: Quản lý login/signup/logout
- `types/index.ts`: Định nghĩa kiểu dữ liệu (Restaurant, Dish, Order...)
- `store/cartStore.ts`: State management cho giỏ hàng

---

#### 4. **Documentation mới**

##### 📄 `SETUP.md`
Hướng dẫn setup từ A-Z:
- Cài dependencies
- Tạo Supabase project
- Setup database
- Chạy app

##### 📄 `docs/SUPABASE_GUIDE.md`
Giải thích chi tiết:
- Supabase là gì?
- Cách hoạt động
- Query examples
- Row Level Security (RLS)
- Best practices

##### 📄 `docs/database-schema.sql`
SQL code để tạo database:
- 7 tables chính
- RLS policies
- Indexes cho performance
- Triggers tự động

---

#### 5. **Git Configuration**

**Thay đổi:**
- Dùng `.git/info/exclude` thay vì `.gitignore` cho docs
- Lý do: Keep `.gitignore` minimal, docs chỉ exclude local

**Files được exclude:**
- `docs/` - Design files & guides
- `*.vpp`, `*.vpp.bak*` - Visual Paradigm files
- `SETUP.md`, `PRODUCTION_SETUP.md` - Setup guides

---

### 🔧 Technical Changes

#### Supabase Client (`src/lib/supabase.ts`)

**Trước (mock):**
```typescript
export const mockRestaurants = [
  { id: '1', name: 'Pizza Palace', ... },
  // Hardcoded data
];
```

**Sau (Supabase):**
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.PUBLIC_SUPABASE_ANON_KEY!
);

// Dùng:
const { data } = await supabase.from('restaurants').select('*');
```

---

#### Authentication Hook (`src/hooks/useAuth.ts`)

**Functionality:**
- ✅ Đăng nhập/đăng ký
- ✅ Theo dõi user state
- ✅ Tự động refresh token
- ✅ Logout

**Usage:**
```typescript
function LoginScreen() {
  const { signIn, user, isLoading } = useAuth();
  
  const handleLogin = async () => {
    await signIn('user@example.com', 'password');
    // User được redirect tự động
  };
}
```

---

#### Cart Store (`src/store/cartStore.ts`)

**Không đổi logic, chỉ clean code:**
- Bỏ comment dài
- Giữ nguyên API

**Usage (giống cũ):**
```typescript
const { items, addItem, getTotalPrice } = useCartStore();

addItem(dish, 2); // Thêm 2 món
const total = getTotalPrice();
```

---

### 🗄️ Database Schema

**7 Tables chính:**

1. **profiles** - Thông tin user (extends auth.users)
2. **restaurants** - Danh sách nhà hàng
3. **dishes** - Món ăn của từng nhà hàng
4. **orders** - Đơn hàng
5. **order_items** - Chi tiết món trong đơn
6. **favorites** - Món/nhà hàng yêu thích
7. **notifications** - Thông báo cho user

**Quan hệ:**
```
restaurants (1) -----> (N) dishes
orders (1) -----> (N) order_items
users (1) -----> (N) orders
users (1) -----> (N) favorites
users (1) -----> (N) notifications
```

---

### 🔐 Security - Row Level Security (RLS)

**Cực kỳ quan trọng!**

**Ví dụ:** User A không thể xem orders của User B

**Policy:**
```sql
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

**Kết quả:**
```typescript
// User A query orders
const { data } = await supabase.from('orders').select('*');
// Supabase tự động filter: WHERE user_id = 'user-a-id'
// User A chỉ thấy orders của mình ✅
```

**Public tables:** restaurants, dishes (ai cũng xem được)  
**Private tables:** orders, favorites, notifications (chỉ user mình)

---

### 📦 Dependencies mới

Cần cài thêm:

```bash
npm install @supabase/supabase-js
```

**Package.json đã có:**
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `zod` - Validation
- `react-hook-form` - Forms

---

### 🚀 Migration Guide (Nếu đã có code cũ)

#### Bước 1: Update code gọi data

**Trước:**
```typescript
import { mockRestaurants } from '@/lib/mockData';

function HomeScreen() {
  const [restaurants] = useState(mockRestaurants);
  // ...
}
```

**Sau:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';

function HomeScreen() {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_open', true);
      return data;
    }
  });
  
  if (isLoading) return <Loading />;
  // ...
}
```

#### Bước 2: Thêm authentication

**Wrap app với auth check:**
```typescript
// app/_layout.tsx
export default function RootLayout() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <SplashScreen />;
  
  if (!user) {
    return <Redirect href="/sign-in" />;
  }
  
  return <Stack />;
}
```

---

### 📊 Query Examples

Xem chi tiết trong `docs/SUPABASE_GUIDE.md`

**Lấy restaurants:**
```typescript
const { data } = await supabase.from('restaurants').select('*');
```

**Lấy dishes của restaurant:**
```typescript
const { data } = await supabase
  .from('dishes')
  .select('*')
  .eq('restaurant_id', id);
```

**Tạo order:**
```typescript
const { data } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    restaurant_id: restaurantId,
    total: 50.99,
    status: 'pending'
  })
  .select()
  .single();
```

**Toggle favorite:**
```typescript
// Check existing
const { data } = await supabase
  .from('favorites')
  .select('*')
  .eq('user_id', userId)
  .eq('dish_id', dishId);

if (data.length > 0) {
  // Unfavorite
  await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('dish_id', dishId);
} else {
  // Favorite
  await supabase
    .from('favorites')
    .insert({ user_id: userId, dish_id: dishId });
}
```

---

### ⚠️ Breaking Changes

#### 1. Mock data không còn hoạt động

**Impact:** Nếu code cũ import `mockData.ts` sẽ lỗi

**Fix:** Thay bằng Supabase queries

#### 2. Cần environment variables

**Impact:** App crash nếu thiếu `.env`

**Fix:** Copy `.env.example` → `.env` và điền thông tin

#### 3. TypeScript types thay đổi

**Trước:**
```typescript
interface Restaurant {
  isFavorite?: boolean; // Trong mock data
}
```

**Sau:**
```typescript
interface Restaurant {
  // Không có isFavorite, phải join với favorites table
}
```

---

### ✅ Testing Checklist

Sau khi update, test:

- [ ] App chạy không crash
- [ ] Login/signup hoạt động
- [ ] Hiển thị danh sách restaurants
- [ ] Thêm món vào giỏ hàng
- [ ] Tạo order thành công
- [ ] Favorite/unfavorite hoạt động
- [ ] Notifications hiển thị

---

### 🎯 Next Steps

1. **Setup Supabase project** (xem `SETUP.md`)
2. **Chạy database schema** (`database-schema.sql`)
3. **Thêm seed data** (optional)
4. **Test authentication flow**
5. **Implement screens với real data**

---

### 📞 Support

Nếu gặp vấn đề:

1. Check `SETUP.md` - Hướng dẫn setup
2. Check `docs/SUPABASE_GUIDE.md` - Giải thích chi tiết
3. Check Supabase dashboard - Xem logs/errors
4. Open GitHub issue

---

**Version:** 1.0.0  
**Date:** October 19, 2025  
**Author:** @iamnguyenvu
