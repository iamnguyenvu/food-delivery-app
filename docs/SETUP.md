# Setup Guide

Complete guide to set up DearU Food development environment.

## Prerequisites

### Required

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Optional

- **VS Code** with [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)
- **Xcode** (macOS only, for iOS development)
- **Android Studio** (for Android development)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/iamnguyenvu/food-delivery-app.git
cd food-delivery-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo SDK
- Supabase client
- UI libraries
- Development tools

### 3. Setup Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Click "New Project"
4. Choose organization
5. Fill project details:
   - **Name**: `food-delivery` (or any name)
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait ~2 minutes for database setup

#### Get API Credentials

1. Go to Project Settings (⚙️ icon)
2. Navigate to **API** section
3. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: Long JWT token

### 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` file:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
APP_ENV=development
API_BASE_URL=https://your-project-id.supabase.co
```

**Important:** Never commit `.env` file to Git!

### 5. Setup Database

#### Run Migrations

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Copy content from `docs/database-schema.sql`
5. Paste and click **Run**
6. Wait for completion

#### (Optional) Add Sample Data

```sql
-- Copy from docs/sample-data.sql
-- Run in SQL Editor
```

#### Verify Tables

1. Go to **Table Editor**
2. Check these tables exist:
   - users
   - restaurants
   - dishes
   - orders
   - addresses
   - favorites
   - banners
   - categories

### 6. Setup OAuth (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Create credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
7. Copy **Client ID** and **Client Secret**
8. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste Client ID and Secret
   - Save

#### Github OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill details:
   - **Application name**: DearU Food
   - **Homepage URL**: `https://your-app.com`
   - **Authorization callback URL**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID**
6. Generate **Client Secret**
7. In Supabase Dashboard:
   - Go to **Authentication** → **Providers**
   - Enable **Github**
   - Paste Client ID and Secret
   - Save

### 7. Start Development Server

```bash
npm start
```

This will:
- Start Metro bundler
- Show QR code
- Open Expo DevTools in browser

### 8. Run on Device

#### Using Expo Go

1. Install Expo Go on your phone
2. Scan QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. Wait for app to load

#### Using Emulator/Simulator

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

## Troubleshooting

### "Metro bundler failed to start"

```bash
# Clear cache
npm start -- --clear
```

### "Cannot connect to Supabase"

1. Check `.env` file has correct credentials
2. Verify network connection
3. Check Supabase project is active

### "Location permission denied"

1. Check app permissions in device settings
2. Restart app
3. Grant location permission when prompted

### "Build failed" on Android

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npm run android
```

### "Pod install failed" on iOS

```bash
# Clean iOS build
cd ios
rm -rf Pods
pod install
cd ..
npm run ios
```

### "Module not found"

```bash
# Clear node_modules
rm -rf node_modules
npm install

# Clear cache
npm start -- --clear
```

## Development Tips

### Hot Reload

- **Fast Refresh**: Automatically reloads on save
- **Disable**: Shake device → Disable Fast Refresh

### Debugging

- **React DevTools**: `npm run devtools`
- **Debug Menu**: Shake device or `Ctrl+M` (Android) / `Cmd+D` (iOS)
- **Logs**: Check Metro bundler terminal

### VS Code Extensions

Recommended extensions:
- Expo Tools
- ESLint
- Prettier
- TypeScript

### Environment Variables

- Development: `.env`
- Production: Configure in EAS Secrets

### Database Changes

1. Update schema in Supabase Dashboard
2. Update `docs/database-schema.sql`
3. Update TypeScript types in `src/types/`

## Next Steps

- [Architecture Overview](ARCHITECTURE.md)
- [API Reference](API.md)
- [Contributing Guide](CONTRIBUTING.md)

## Need Help?

- 📖 [Documentation](../docs/)
- 💬 [Discussions](https://github.com/iamnguyenvu/food-delivery-app/discussions)
- 🐛 [Issues](https://github.com/iamnguyenvu/food-delivery-app/issues)
