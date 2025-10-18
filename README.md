<div align="center">
  <h1>🍔 Food Delivery App</h1>
  <p>A production-ready food delivery application built with React Native, Expo, and Supabase</p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb.svg)](https://reactnative.dev/)
  [![Expo SDK](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.0-3ecf8e.svg)](https://supabase.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Documentation](#-documentation)
- [Architecture](#-architecture)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🏪 **Restaurant Discovery** - Browse restaurants with real-time data
- 🍽️ **Menu Browsing** - View dishes with images, descriptions, and prices
- 🛒 **Shopping Cart** - Add/remove items with quantity management
- ❤️ **Favorites** - Save favorite dishes and restaurants
- 📦 **Order Management** - Create and track orders
- 🔔 **Notifications** - Real-time order updates
- 👤 **Authentication** - Secure user authentication with Supabase Auth
- 🎨 **Theme Support** - Light and dark mode
- 📱 **Cross-Platform** - iOS, Android, and Web support

---

## 🛠️ Tech Stack

### Frontend
- **[React Native](https://reactnative.dev/)** - Cross-platform mobile framework
- **[Expo](https://expo.dev/)** - Development platform and tooling
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based navigation

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching

### Backend
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - Schema validation

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Expo Go** app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

**Optional but recommended:**
- **[Xcode](https://developer.apple.com/xcode/)** (for iOS development on macOS)
- **[Android Studio](https://developer.android.com/studio)** (for Android development)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/iamnguyenvu/food-delivery-app.git
cd food-delivery-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

Create a free account at [supabase.com](https://supabase.com) and create a new project.

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from: **Supabase Dashboard → Settings → API**

### 5. Setup database

1. Open **SQL Editor** in your Supabase dashboard
2. Copy the contents of `docs/database-schema.sql`
3. Paste and execute the SQL

### 6. Start the development server

```bash
npm start
```

Scan the QR code with **Expo Go** app to run on your device.

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

---

## 📂 Project Structure

```
food-delivery/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                  # Tab navigator
│   │   ├── _layout.tsx          # Tabs configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── orders.tsx           # Orders screen
│   │   ├── favorites.tsx        # Favorites screen
│   │   ├── notifications.tsx    # Notifications screen
│   │   └── profile.tsx          # Profile screen
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal screens
│
├── src/                         # Source code
│   ├── lib/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── hooks/
│   │   ├── index.ts            # Hooks barrel export
│   │   └── useAuth.ts          # Authentication hook
│   ├── store/
│   │   └── cartStore.ts        # Shopping cart state (Zustand)
│   └── types/
│       └── index.ts            # TypeScript type definitions
│
├── components/                  # Reusable UI components
│   ├── Themed.tsx              # Themed components
│   ├── StyledText.tsx          # Text components
│   └── ...
│
├── constants/                   # App constants
│   └── Colors.ts               # Color palette
│
├── assets/                      # Static assets
│   ├── images/                 # Images
│   └── fonts/                  # Custom fonts
│
├── docs/                        # Documentation (git-ignored)
│   ├── CHANGELOG.md            # Change history
│   ├── SUPABASE_GUIDE.md       # Supabase integration guide
│   ├── QUICK_REFERENCE.md      # Quick reference
│   └── database-schema.sql     # Database schema
│
├── .env.example                # Environment variables template
├── app.config.js               # Expo configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ Yes |

**Note:** These keys are safe to expose in the client app. Security is handled by Row Level Security (RLS) policies in Supabase.

---

## 📜 Available Scripts

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Type checking
npx tsc --noEmit

# Lint check
npx expo lint
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](SETUP.md) | Complete setup guide with troubleshooting |
| [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) | Production deployment guide |
| [docs/SUPABASE_GUIDE.md](docs/SUPABASE_GUIDE.md) | Supabase integration explained |
| [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | Quick reference cheat sheet |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Version history and changes |

---

## 🏗️ Architecture

### Authentication Flow
```
User Input → useAuth Hook → Supabase Auth → JWT Token → Stored Securely
```

### Data Flow
```
Component → React Query → Supabase Client → PostgreSQL → RLS Policies → Data Returned
```

### State Management
```
Global State (Zustand) ← → Components ← → Server State (React Query)
```

---

## 🔒 Security

- **Row Level Security (RLS)** - Database-level security policies
- **JWT Authentication** - Secure token-based auth
- **Environment Variables** - Sensitive data not in source code
- **API Key Protection** - Public keys only, service keys server-side

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nguyen Vu**
- GitHub: [@iamnguyenvu](https://github.com/iamnguyenvu)
- Repository: [food-delivery-app](https://github.com/iamnguyenvu/food-delivery-app)

---

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev/) for the amazing development platform
- [Supabase Team](https://supabase.com/) for the excellent BaaS solution
- [React Native Community](https://reactnative.dev/) for the framework
- Design inspiration from popular food delivery apps

---

<div align="center">
  <p>Made with ❤️ and ☕</p>
  <p>© 2025 Food Delivery App. All rights reserved.</p>
</div>
