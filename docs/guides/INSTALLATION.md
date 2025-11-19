# 📱 Food Delivery App - Hướng Dẫn Cài Đặt Chi Tiết

Hướng dẫn đầy đủ để cài đặt và chạy dự án Food Delivery App trên máy local.

---

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
2. [Cài Đặt Nhanh với Docker](#-cài-đặt-nhanh-với-docker-khuyến-nghị)
3. [Cài Đặt Thủ Công](#-cài-đặt-thủ-công)
4. [Cấu Hình Supabase](#-cấu-hình-supabase)
5. [Chạy Ứng Dụng](#-chạy-ứng-dụng)
6. [Xử Lý Lỗi Thường Gặp](#-xử-lý-lỗi-thường-gặp)
7. [Authentication Setup](#-authentication-setup)
8. [Testing](#-testing)

---

## 📦 Yêu Cầu Hệ Thống

### Bắt Buộc

- **Node.js**: 18.x hoặc 20.x (khuyến nghị 20.x)
  - Download: https://nodejs.org/
  - Kiểm tra: `node --version`
  
- **npm**: 8.x trở lên (đi kèm với Node.js)
  - Kiểm tra: `npm --version`
  
- **Git**: 2.x trở lên
  - Download: https://git-scm.com/
  - Kiểm tra: `git --version`

### Tùy Chọn (Khuyến Nghị)

- **Docker Desktop**: Để chạy database local dễ dàng
  - Download: https://www.docker.com/products/docker-desktop/
  - Kiểm tra: `docker --version`

- **Expo Go App**: Để test trên điện thoại thật
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### Công Cụ Hỗ Trợ

- **VS Code**: Editor khuyến nghị
  - Extensions:
    - ESLint
    - Prettier
    - React Native Tools
    - TypeScript and JavaScript Language Features

---

## 🐳 Cài Đặt Nhanh với Docker (Khuyến Nghị)

Docker giúp bạn chạy database local mà không cần cài đặt PostgreSQL hay chạy migrations thủ công.

### Bước 1: Cài Đặt Docker Desktop

1. Download và cài đặt Docker Desktop từ https://www.docker.com/products/docker-desktop/
2. Khởi động Docker Desktop
3. Đợi Docker chạy hoàn tất (icon Docker màu xanh)

### Bước 2: Clone và Cài Đặt Dependencies

```bash
# Clone repository
git clone https://github.com/iamnguyenvu/food-delivery-app.git
cd food-delivery-app

# Cài đặt dependencies
npm install
```

### Bước 3: Khởi Động Database

**Windows:**
```bash
# Sử dụng script tự động
docker-start.bat

# Hoặc thủ công
docker-compose up postgres -d
```

**Mac/Linux:**
```bash
# Cấp quyền thực thi cho script
chmod +x docker-start.sh

# Chạy script
./docker-start.sh

# Hoặc thủ công
docker-compose up postgres -d
```

### Bước 4: Tạo File `.env`

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Chỉnh sửa `.env` để sử dụng local Docker database hoặc Supabase cloud:

```env
# Option 1: Local Docker Database (Khuyến nghị cho development)
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs

# Option 2: Supabase Cloud (Production)
# PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Bước 5: Chạy App

```bash
npm start
```

Mở Expo Go trên điện thoại và scan QR code!

### Kiểm Tra Database

Database đã được tự động khởi tạo với:
- ✅ Complete schema (tables, enums, indexes)
- ✅ Sample data (restaurants, dishes, users)
- ✅ Sample deals (flash sales, promotions)
- ✅ Auto-profile trigger

**Kết nối database:**
- Host: `localhost`
- Port: `5432`
- Database: `food_delivery`
- User: `postgres`
- Password: `postgres`

**Xem database bằng Supabase Studio:**
```bash
docker-compose up supabase-studio -d
```
Mở: http://localhost:3000

---

## 🔧 Cài Đặt Thủ Công

Nếu không dùng Docker, bạn có thể cài đặt thủ công với Supabase cloud.

### Bước 1: Clone Repository

```bash
git clone https://github.com/iamnguyenvu/food-delivery-app.git
cd food-delivery-app
npm install
```

### Bước 2: Tạo Supabase Project

1. Truy cập https://supabase.com
2. Đăng nhập hoặc tạo tài khoản miễn phí
3. Click **"New Project"**
4. Điền thông tin:
   - **Name**: `food-delivery` (hoặc tên bất kỳ)
   - **Database Password**: Lưu lại password này!
   - **Region**: Chọn gần bạn nhất (Singapore cho Việt Nam)
5. Click **"Create new project"**
6. Đợi 2-3 phút để project được khởi tạo

### Bước 3: Lấy API Keys

1. Trong Supabase Dashboard, vào **Settings** > **API**
2. Copy các thông tin sau:
   - **Project URL** (VD: `https://xxxxx.supabase.co`)
   - **anon public** key (rất dài, bắt đầu bằng `eyJ...`)

### Bước 4: Tạo Database Schema

1. Trong Supabase Dashboard, vào **SQL Editor**
2. Click **"New query"**
3. Copy nội dung file `docs/database-schema-complete-v5.sql`
4. Paste vào SQL Editor và click **Run**
5. Đợi query chạy xong (khoảng 30-60 giây)

### Bước 5: Import Sample Data

1. Vào **SQL Editor** > **"New query"**
2. Copy nội dung file `docs/sample-data.sql`
3. Paste và click **Run**
4. Lặp lại với `docs/sample-deals.sql`

### Bước 6: Tạo File `.env`

```bash
# Windows
copy .env.example .env

# Mac/Linux  
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Thay `xxxxx` bằng Project URL và anon key của bạn.

### Bước 7: Chạy App

```bash
npm start
```

---

## 🔐 Cấu Hình Supabase

### Authentication Providers

#### 1. Email/Password (Mặc định - Đã bật)

Email authentication đã được bật sẵn, không cần cấu hình thêm.

#### 2. Phone Authentication (KHÔNG khuyến nghị - Twilio đã chặn VN)

⚠️ **LƯU Ý**: Twilio hiện đã chặn số điện thoại Việt Nam. Phone OTP không hoạt động!

**Thay vào đó, sử dụng:**
- Magic Link qua Email
- Password-based authentication với Phone
- OAuth (Google, Github)

#### 3. OAuth Providers (Khuyến nghị)

##### Google OAuth

1. Vào **Supabase Dashboard** > **Authentication** > **Providers**
2. Bật **Google**
3. Làm theo hướng dẫn để lấy OAuth credentials từ Google Cloud Console
4. Nhập **Client ID** và **Client Secret**
5. **Redirect URL**: Copy URL được cung cấp bởi Supabase

##### Github OAuth

1. Vào **Supabase Dashboard** > **Authentication** > **Providers**
2. Bật **Github**
3. Tạo OAuth App tại https://github.com/settings/developers
4. **Authorization callback URL**: Copy từ Supabase
5. Nhập **Client ID** và **Client Secret**

### Row Level Security (RLS)

RLS policies đã được tự động tạo trong schema. Kiểm tra:

```sql
-- View existing policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## 🚀 Chạy Ứng Dụng

### Development Mode

```bash
# Start Expo development server
npm start

# Hoặc các options khác:
npm run android   # Android emulator
npm run ios       # iOS simulator (chỉ macOS)
npm run web       # Web browser
```

### Scan QR Code với Expo Go

1. Cài **Expo Go** app trên điện thoại
2. **Android**: Scan QR code bằng Expo Go app
3. **iOS**: Scan QR code bằng Camera app, sẽ mở Expo Go

### Chạy trên Emulator

**Android:**
1. Cài Android Studio
2. Tạo Android Virtual Device (AVD)
3. Khởi động emulator
4. Chạy `npm run android`

**iOS (chỉ macOS):**
1. Cài Xcode từ App Store
2. Cài Xcode Command Line Tools
3. Chạy `npm run ios`

### Metro Bundler Commands

Khi Metro đang chạy, bạn có thể:
- **r** - Reload app
- **m** - Toggle menu
- **d** - Open developer menu
- **shift+d** - Toggle remote debugging (deprecated)
- **j** - Open debugger

---

## 🐛 Xử Lý Lỗi Thường Gặp

### 1. "Cannot connect to Metro bundler"

**Nguyên nhân**: Firewall hoặc network issues

**Giải pháp**:
```bash
# Xóa cache
npx expo start -c

# Cho phép qua firewall
# Windows: Settings > Firewall > Allow an app
# Mac: System Preferences > Security & Privacy > Firewall Options
```

### 2. "Module not found" errors

**Giải pháp**:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install

# Xóa cache
npx expo start -c
```

### 3. "Supabase connection error"

**Kiểm tra**:
- URL và API key trong `.env` đúng không?
- Project Supabase đã khởi tạo xong chưa?
- Database schema đã chạy chưa?

**Test connection**:
```typescript
// Test trong app
const { data, error } = await supabase.from('profiles').select('*').limit(1);
console.log('Connection test:', { data, error });
```

### 4. "Docker container not starting"

**Giải pháp**:
```bash
# Xem logs
docker-compose logs postgres

# Reset và restart
docker-compose down -v
docker-compose up postgres -d

# Kiểm tra port conflicts
netstat -ano | findstr :5432
```

### 5. OAuth Redirect Issues (Expo Go)

**Vấn đề**: OAuth redirect về localhost hoặc không redirect

**Giải pháp**: App đang dùng **session polling** thay vì deep linking

1. Đăng nhập sẽ mở browser
2. Hoàn thành đăng nhập trên browser
3. **Đóng browser** hoặc đợi auto-close
4. App sẽ tự động detect session (trong 30 giây)

**Không cần thiết lập deep linking cho Expo Go!**

### 6. "Phone OTP not working"

**Nguyên nhân**: Twilio đã chặn số Việt Nam

**Giải pháp**:
- Dùng **Password authentication** với phone thay vì OTP
- Hoặc dùng **Magic Link** qua email
- Hoặc dùng **OAuth** (Google, Github)

Xem [Authentication Setup](#-authentication-setup) để biết chi tiết.

---

## 🔑 Authentication Setup

### Cấu Hình Hiện Tại

App hỗ trợ 3 phương thức đăng nhập:

#### 1. OAuth (Google/Github) - Khuyến nghị ⭐

**Ưu điểm**:
- Không cần nhớ password
- Bảo mật cao
- UX tốt

**Cách hoạt động**:
1. User click "Đăng nhập bằng Google/Github"
2. Mở browser để xác thực
3. Sau khi xác thực, **đóng browser**
4. App tự động detect session trong 30 giây (session polling)

**Lưu ý**: Không cần deep linking khi dùng Expo Go!

#### 2. Password Authentication với Phone

**Ưu điểm**:
- Không phụ thuộc bên thứ 3
- Hoạt động ngay cả khi offline

**Cách dùng**:
1. Nhập số điện thoại
2. Click "Đăng nhập bằng mật khẩu"
3. Nhập password (tối thiểu 6 ký tự)

**Đăng ký mới**:
```typescript
// User cần đăng ký qua email trước, sau đó update phone
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Update profile với phone
await supabase.from('profiles').update({
  phone: '0912345678'
}).eq('id', user.id);
```

#### 3. Magic Link qua Email (Tùy chọn)

Có thể thêm magic link authentication:

```typescript
// Gửi magic link
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'fooddelivery://auth/callback',
  }
});
```

### Tắt Phone OTP (Không hoạt động)

Phone OTP bị lỗi do Twilio chặn VN. Đã được disable trong code:

```typescript
// ❌ KHÔNG dùng - Twilio chặn VN
// await supabase.auth.signInWithOtp({ phone: '+84...' })

// ✅ Dùng thay thế
await supabase.auth.signInWithPassword({
  email: phoneToEmail(phone), // Convert phone to email format
  password: password
});
```

---

## ✅ Testing

### Manual Testing

1. **Authentication Flow**:
   ```
   - Launch app
   - Click "Đăng nhập bằng Google"
   - Complete Google login
   - Đóng browser
   - Verify session được detect
   - Verify redirect to home screen
   ```

2. **Database Connection**:
   ```bash
   # Test với Docker
   docker-compose exec postgres psql -U postgres -d food_delivery -c "SELECT COUNT(*) FROM restaurants;"
   ```

3. **API Endpoints**:
   ```typescript
   // Test trong app console
   const { data } = await supabase.from('restaurants').select('*').limit(5);
   console.log('Restaurants:', data);
   ```

### Unit Tests (Tùy chọn)

```bash
# Cài đặt Jest
npm install --save-dev jest @types/jest

# Chạy tests
npm test
```

---

## 📚 Tài Liệu Bổ Sung

- [DOCKER.md](./DOCKER.md) - Chi tiết về Docker setup
- [docs/SETUP.md](./docs/SETUP.md) - Setup guide gốc
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Kiến trúc ứng dụng
- [docs/API.md](./docs/API.md) - API documentation
- [docs/SUPABASE_GUIDE.md](./docs/SUPABASE_GUIDE.md) - Supabase setup

---

## 🆘 Cần Trợ Giúp?

### Debug Steps

1. **Kiểm tra logs**:
   ```bash
   # Metro bundler logs
   # Xem trong terminal khi chạy npm start
   
   # Docker logs
   docker-compose logs -f postgres
   
   # Supabase logs
   # Vào Dashboard > Logs
   ```

2. **Reset môi trường**:
   ```bash
   # Xóa cache Metro
   npx expo start -c
   
   # Reset Docker
   docker-compose down -v
   docker-compose up postgres -d
   
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

3. **Kiểm tra network**:
   ```bash
   # Test kết nối Supabase
   curl https://your-project.supabase.co/rest/v1/
   
   # Test local database
   docker-compose exec postgres pg_isready
   ```

### Common Issues

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| "Network request failed" | Supabase URL sai hoặc network | Kiểm tra `.env`, test internet |
| "Invalid API key" | API key sai hoặc hết hạn | Lấy lại từ Supabase Dashboard |
| "Phone OTP failed" | Twilio chặn VN | Dùng OAuth hoặc password auth |
| "Cannot connect to Docker" | Docker chưa chạy | Khởi động Docker Desktop |
| "Port already in use" | Conflict với service khác | Đổi port trong docker-compose.yml |

### Resources

- **Expo Docs**: https://docs.expo.dev/
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **GitHub Issues**: https://github.com/iamnguyenvu/food-delivery-app/issues

---

## 📝 Checklist Cài Đặt

- [ ] Node.js 20.x đã cài đặt
- [ ] Git đã cài đặt
- [ ] Docker Desktop đã cài đặt và chạy (nếu dùng Docker)
- [ ] Repository đã clone
- [ ] Dependencies đã cài (`npm install`)
- [ ] File `.env` đã tạo và cấu hình
- [ ] Database đã khởi tạo (Docker hoặc Supabase cloud)
- [ ] App chạy thành công (`npm start`)
- [ ] Có thể đăng nhập bằng OAuth
- [ ] Data hiển thị đúng trên home screen

---

## 🎉 Hoàn Thành!

Nếu mọi thứ hoạt động:
- ✅ Metro bundler đang chạy
- ✅ QR code hiển thị
- ✅ Scan QR code mở được app
- ✅ Home screen hiển thị restaurants
- ✅ Đăng nhập Google/Github hoạt động

**Chúc mừng! Bạn đã setup thành công Food Delivery App! 🚀**

Bây giờ bạn có thể:
- Explore code trong `app/` và `components/`
- Tạo features mới
- Customize UI/UX
- Deploy lên production

Happy coding! 💻
