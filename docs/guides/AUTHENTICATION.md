# 🔐 Authentication Guide - Food Delivery App

Hướng dẫn chi tiết về hệ thống xác thực trong ứng dụng Food Delivery.

---

## 📋 Mục Lục

1. [Tổng Quan](#-tổng-quan)
2. [Các Phương Thức Đăng Nhập](#-các-phương-thức-đăng-nhập)
3. [OAuth (Google/Github)](#-oauth-googlegithub)
4. [Phone + Password Authentication](#-phone--password-authentication)
5. [Email + Password Authentication](#-email--password-authentication)
6. [Database Schema](#-database-schema)
7. [Setup Supabase](#-setup-supabase)
8. [Troubleshooting](#-troubleshooting)
9. [Best Practices](#-best-practices)

---

## 🎯 Tổng Quan

### Phương Thức Được Hỗ Trợ

App hỗ trợ **3 phương thức đăng nhập chính**:

| Phương Thức | Trạng Thái | Khuyến Nghị | Use Case |
|------------|-----------|-------------|----------|
| **OAuth (Google/Github)** | ✅ Hoạt động | ⭐ Khuyến nghị | User muốn đăng nhập nhanh, không nhớ password |
| **Phone + Password** | ✅ Hoạt động | ⭐⭐ Khuyến nghị cao | User Việt Nam, số điện thoại là identifier chính |
| **Email + Password** | ✅ Hoạt động | ✓ Backup | User không muốn dùng OAuth |
| **Phone OTP (SMS)** | ❌ Không khả dụng | ⛔ Bị loại bỏ | Twilio chặn số VN |

### Tại Sao Không Dùng Phone OTP?

**Vấn đề với Twilio:**
- Twilio (SMS provider của Supabase) đã **chặn số điện thoại Việt Nam (+84)**
- Chi phí SMS rất cao cho thị trường VN (~$0.05/SMS)
- Cần verify business với Twilio để gửi SMS VN
- Alternatives (Vonage, AWS SNS) cũng tốn kém và phức tạp

**Giải pháp thay thế:**
- ✅ **Phone + Password**: Đăng nhập bằng SĐT nhưng dùng password thay vì OTP
- ✅ **OAuth**: Google/Github sign-in, không cần SMS
- ✅ **Email + Password**: Traditional authentication

---

## 🚀 Các Phương Thức Đăng Nhập

### 1. OAuth (Google/Github) ⭐

**Ưu điểm:**
- Không cần nhớ password
- Bảo mật cao (OAuth 2.0 standard)
- UX tốt, đăng nhập nhanh
- Không phụ thuộc SMS provider

**Nhược điểm:**
- Cần Internet để xác thực
- User phải có tài khoản Google/Github
- Deep linking phức tạp trên Expo Go (đã giải quyết bằng session polling)

**Khi nào dùng:**
- User lần đầu sử dụng app
- User muốn đăng nhập nhanh
- Target audience có tài khoản Google/Github

---

### 2. Phone + Password ⭐⭐

**Ưu điểm:**
- Phù hợp với thị trường VN (SĐT là identifier chính)
- Không phụ thuộc SMS provider
- Hoạt động offline sau khi setup
- Chi phí $0

**Nhược điểm:**
- User cần nhớ password
- Cần validation SĐT cẩn thận

**Khi nào dùng:**
- App food delivery (SĐT để liên hệ giao hàng)
- User không muốn dùng OAuth
- Offline-first app

---

### 3. Email + Password

**Ưu điểm:**
- Standard authentication method
- Không phụ thuộc third-party
- Hoạt động mọi nơi

**Nhược điểm:**
- User cần nhớ password
- Email ít được dùng trong food delivery (SĐT phổ biến hơn)

**Khi nào dùng:**
- Backup cho Phone + Password
- Admin/Staff accounts
- Testing

---

## 🔑 OAuth (Google/Github)

### Setup OAuth Providers

#### Google OAuth

**Bước 1: Tạo Google OAuth Credentials**

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
7. Copy **Client ID** và **Client Secret**

**Bước 2: Cấu Hình Supabase**

1. Vào **Supabase Dashboard** > **Authentication** > **Providers**
2. Bật **Google**
3. Paste **Client ID** và **Client Secret**
4. Save changes

**Bước 3: Test OAuth**

```typescript
import { useAuth } from '@/src/contexts/AuthContext';

const { signInWithGoogle } = useAuth();

const handleGoogleLogin = async () => {
  try {
    const { url } = await signInWithGoogle();
    
    // Open OAuth URL in browser
    const result = await WebBrowser.openAuthSessionAsync(url, "https://example.com");
    
    if (result.type === "dismiss") {
      // User closed browser, start session polling
      // App will automatically detect session in 30 seconds
      console.log("OAuth flow initiated, polling for session...");
    }
  } catch (error) {
    console.error("Google login failed:", error);
  }
};
```

#### Github OAuth

**Bước 1: Tạo Github OAuth App**

1. Vào [Github Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Điền thông tin:
   - **Application name**: Food Delivery App
   - **Homepage URL**: https://your-app.com
   - **Authorization callback URL**: 
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID**
6. Generate và copy **Client Secret**

**Bước 2: Cấu Hình Supabase**

1. Vào **Supabase Dashboard** > **Authentication** > **Providers**
2. Bật **Github**
3. Paste **Client ID** và **Client Secret**
4. Save changes

### OAuth Flow với Expo Go

**Vấn đề:** Deep linking không hoạt động tốt trên Expo Go

**Giải pháp:** Session Polling

```typescript
// AuthContext.tsx - Session polling helper
const pollSession = async (maxAttempts = 30) => {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log("✅ Session detected!");
      return session;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
  }
  
  throw new Error("OAuth timeout - session not detected");
};

// Login screen usage
const handleOAuthLogin = async (provider: 'google' | 'github') => {
  const authFunc = provider === 'google' ? signInWithGoogle : signInWithGithub;
  const { url } = await authFunc();
  
  const result = await WebBrowser.openAuthSessionAsync(url, "https://example.com");
  
  if (result.type === "dismiss") {
    setLoadingMessage("Đang xác thực...");
    
    try {
      await pollSession(30); // Poll for 30 seconds
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác thực. Vui lòng thử lại.");
    }
  }
};
```

**Lưu ý quan trọng:**
- User phải **đóng browser** sau khi xác thực thành công
- App sẽ tự động detect session trong 30 giây
- Không cần setup deep linking cho Expo Go
- Production app có thể dùng proper deep linking

---

## 📱 Phone + Password Authentication

### Tổng Quan

Phone + Password là phương thức **khuyến nghị cao nhất** cho app food delivery ở Việt Nam vì:
- Số điện thoại là identifier chính (cần cho giao hàng)
- Không phụ thuộc SMS provider
- Chi phí $0
- UX phù hợp với user VN

### Database Schema

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT UNIQUE,  -- Số điện thoại unique
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast phone lookup
CREATE INDEX idx_profiles_phone ON profiles(phone);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Đăng Ký với Phone + Password

**Flow:**

1. User nhập số điện thoại + password
2. App tạo account với email dummy (phone-based)
3. Update profile với số điện thoại thật
4. User login với phone + password

**Implementation:**

```typescript
// AuthContext.tsx - Thêm method mới
const signUpWithPhone = async (phone: string, password: string, fullName?: string) => {
  // Validate phone number (VN format)
  const phoneRegex = /^0[35789]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Số điện thoại không hợp lệ. Vui lòng nhập số VN (10 số, bắt đầu 0)");
  }

  // Check if phone already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('phone')
    .eq('phone', phone)
    .single();

  if (existingProfile) {
    throw new Error("Số điện thoại đã được đăng ký");
  }

  // Create dummy email from phone
  const email = `${phone}@fooddelivery.local`;

  // Sign up with Supabase
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        phone,
        full_name: fullName,
      }
    }
  });

  if (signUpError) throw signUpError;

  // Update profile with actual phone
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        phone,
        full_name: fullName,
        email, // Optional: keep dummy email
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error("Failed to update profile:", profileError);
    }
  }

  return authData;
};

// Export in context
export function AuthProvider({ children }: { children: ReactNode }) {
  // ... existing code ...

  return (
    <AuthContext.Provider
      value={{
        // ... existing methods ...
        signUpWithPhone, // ✅ Add new method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**UI Component:**

```typescript
// SignUpScreen.tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUpWithPhone } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!phone || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await signUpWithPhone(phone, password, fullName);
      Alert.alert("Thành công", "Đăng ký thành công!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Số điện thoại (VD: 0912345678)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />
      
      <TextInput
        placeholder="Họ tên"
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput
        placeholder="Mật khẩu (tối thiểu 6 ký tự)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity onPress={handleSignUp} disabled={loading}>
        <Text>{loading ? "Đang đăng ký..." : "Đăng ký"}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Đăng Nhập với Phone + Password

**Implementation:**

```typescript
// AuthContext.tsx - Cập nhật method hiện tại
const signInWithPhone = async (phone: string, password: string) => {
  // Validate phone number
  const phoneRegex = /^0[35789]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Số điện thoại không hợp lệ");
  }

  // Find user by phone
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('phone', phone)
    .single();

  if (profileError || !profile) {
    throw new Error("Số điện thoại chưa được đăng ký");
  }

  // Sign in with dummy email
  const email = profile.email || `${phone}@fooddelivery.local`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};
```

**UI Component:**

```typescript
// LoginScreen.tsx
const handlePhoneLogin = async () => {
  if (!phone || !password) {
    Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
    return;
  }

  setLoading(true);
  try {
    await signInWithPhone(phone, password);
    router.replace("/(tabs)");
  } catch (error) {
    Alert.alert("Lỗi đăng nhập", error.message);
  } finally {
    setLoading(false);
  }
};
```

### Password Reset với Phone

**Flow:**

1. User quên mật khẩu
2. Nhập số điện thoại
3. App gửi password reset link qua email (dummy email)
4. User reset password qua link

**Alternative Flow (Khuyến nghị):**

1. User liên hệ support để verify identity
2. Support reset password manually
3. User đăng nhập với password mới

```typescript
// AuthContext.tsx
const resetPasswordByPhone = async (phone: string) => {
  // Find user email by phone
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('phone', phone)
    .single();

  if (!profile) {
    throw new Error("Số điện thoại không tồn tại");
  }

  // Send reset email
  const { error } = await supabase.auth.resetPasswordForEmail(
    profile.email,
    {
      redirectTo: 'fooddelivery://reset-password',
    }
  );

  if (error) throw error;
  
  return "Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.";
};
```

---

## ✉️ Email + Password Authentication

### Đăng Ký

```typescript
// AuthContext.tsx - Đã có sẵn
const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
};
```

### Đăng Nhập

```typescript
// AuthContext.tsx - Đã có sẵn
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
};
```

---

## 🗄️ Database Schema

### Complete Schema

```sql
-- ============================================
-- AUTHENTICATION & PROFILES
-- ============================================

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- "Home", "Office", "Other"
  address_line TEXT NOT NULL,
  district TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);
```

### Migration Script

Nếu database đã tồn tại và cần thêm phone authentication:

```sql
-- Add phone column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE;

-- Create index for phone
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- Update trigger to handle phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone, -- ✅ Add phone from auth.users
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## ⚙️ Setup Supabase

### 1. Cấu Hình Site URL

**Supabase Dashboard** > **Authentication** > **URL Configuration**

```
Site URL: https://example.com
Redirect URLs:
  - https://example.com
  - fooddelivery://auth/callback (for production app)
```

**Lưu ý:**
- Expo Go dùng session polling nên redirect URL có thể là dummy
- Production app nên setup proper deep linking

### 2. Email Templates (Tùy chọn)

**Supabase Dashboard** > **Authentication** > **Email Templates**

Customize email templates cho:
- Confirmation email
- Password reset
- Magic link

### 3. Rate Limiting

**Supabase Dashboard** > **Authentication** > **Rate Limits**

Recommended settings:
```
Email Signups: 10 per hour
Password Attempts: 5 per hour
OTP Requests: 3 per hour (disabled vì không dùng OTP)
```

---

## 🐛 Troubleshooting

### 1. "Phone number already registered"

**Nguyên nhân:** Phone đã tồn tại trong database

**Giải pháp:**
```typescript
// Check trước khi sign up
const { data: existingProfile } = await supabase
  .from('profiles')
  .select('phone')
  .eq('phone', phone)
  .single();

if (existingProfile) {
  throw new Error("Số điện thoại đã được đăng ký. Vui lòng đăng nhập.");
}
```

### 2. "Invalid phone format"

**Nguyên nhân:** Phone không match validation regex

**Giải pháp:**
```typescript
// Validate VN phone format
const phoneRegex = /^0[35789]\d{8}$/;
if (!phoneRegex.test(phone)) {
  throw new Error("Số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 0");
}
```

### 3. "OAuth timeout"

**Nguyên nhân:** Session polling không detect được session

**Giải pháp:**
- Kiểm tra user đã complete OAuth flow chưa
- Đảm bảo user đóng browser sau khi xác thực
- Tăng timeout từ 30s lên 60s nếu cần

```typescript
await pollSession(60); // Increase timeout to 60s
```

### 4. "Profile not found"

**Nguyên nhân:** Auto-create trigger không chạy

**Giải pháp:**
```typescript
// Manual profile creation
const ensureProfile = async (user: User) => {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!data) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      phone: user.phone,
    });
  }
};
```

---

## ✅ Best Practices

### 1. Phone Validation

```typescript
// Strict Vietnam phone validation
const validatePhone = (phone: string): boolean => {
  // Format: 0[35789]XXXXXXXX (10 digits)
  const phoneRegex = /^0[35789]\d{8}$/;
  return phoneRegex.test(phone);
};

// Show helpful error messages
if (!validatePhone(phone)) {
  Alert.alert(
    "Số điện thoại không hợp lệ",
    "Vui lòng nhập số điện thoại Việt Nam hợp lệ:\n" +
    "- Bắt đầu bằng 0\n" +
    "- Theo sau là 3, 5, 7, 8, hoặc 9\n" +
    "- Tổng 10 số\n" +
    "Ví dụ: 0912345678"
  );
}
```

### 2. Password Security

```typescript
// Strong password validation
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  
  if (!/[A-Z]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ hoa";
  }
  
  if (!/[a-z]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ thường";
  }
  
  if (!/[0-9]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 số";
  }
  
  return null; // Valid
};
```

### 3. Error Handling

```typescript
// Comprehensive error handling
const handleAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return "Số điện thoại hoặc mật khẩu không đúng";
    }
    
    if (message.includes('user already registered')) {
      return "Số điện thoại đã được đăng ký";
    }
    
    if (message.includes('email not confirmed')) {
      return "Vui lòng xác nhận email trước khi đăng nhập";
    }
    
    return error.message;
  }
  
  return "Đã xảy ra lỗi. Vui lòng thử lại.";
};

// Usage
try {
  await signInWithPhone(phone, password);
} catch (error) {
  const message = handleAuthError(error);
  Alert.alert("Lỗi đăng nhập", message);
}
```

### 4. Loading States

```typescript
// Show appropriate loading messages
const [loadingMessage, setLoadingMessage] = useState('');

const handleLogin = async () => {
  setLoadingMessage("Đang đăng nhập...");
  
  try {
    await signInWithPhone(phone, password);
    setLoadingMessage("Đăng nhập thành công!");
    router.replace("/(tabs)");
  } catch (error) {
    setLoadingMessage('');
    Alert.alert("Lỗi", handleAuthError(error));
  }
};
```

### 5. Session Management

```typescript
// Check session on app start
useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User logged in, redirect to home
      router.replace("/(tabs)");
    }
  };
  
  checkSession();
}, []);

// Auto-refresh session
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  
  if (event === 'SIGNED_OUT') {
    router.replace("/login");
  }
});
```

---

## 🎯 Recommendations

### Cho MVP (Minimum Viable Product)

1. **Primary**: Phone + Password ⭐⭐
   - Phù hợp với VN market
   - Chi phí $0
   - UX tốt

2. **Secondary**: OAuth (Google) ⭐
   - Quick sign-up
   - High conversion rate

3. **Backup**: Email + Password
   - For edge cases

### Cho Production

1. **Add**: Apple Sign In (bắt buộc cho iOS)
2. **Add**: Facebook Login (phổ biến ở VN)
3. **Consider**: Zalo Login (VN-specific)
4. **Implement**: Proper deep linking (thay session polling)
5. **Add**: Biometric authentication (Face ID, Touch ID)

---

## 📚 Tài Liệu Liên Quan

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [React Native Security Best Practices](https://reactnative.dev/docs/security)

---

## 🆘 Support

Nếu gặp vấn đề:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [Supabase Dashboard Logs](https://supabase.com/dashboard)
3. Check app console logs
4. Open issue on GitHub

---

**Happy Coding! 🚀**
