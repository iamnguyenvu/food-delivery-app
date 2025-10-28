# Architecture

## Overview

DearU Food follows a modern React Native architecture with clear separation of concerns.

## Tech Stack

### Frontend Layer
- **React Native** 0.81.4 - Cross-platform mobile framework
- **Expo SDK** 54 - Development platform
- **TypeScript** 5.9+ - Type safety
- **Expo Router** 6.0 - File-based navigation
- **NativeWind** 4.2 - Tailwind CSS for React Native

### State Management
- **Zustand** 5.0 - App state (cart, location)
- **TanStack Query** 5.90 - Server state & caching
- **React Context** - Auth state
- **AsyncStorage** - Local persistence

### Backend Services
- **Supabase** 2.75
  - PostgreSQL with Row Level Security (RLS)
  - Auth (Phone/Password, OAuth)
  - Real-time subscriptions
  - Storage for images

### UI & Interaction
- **React Native Maps** - Map components
- **Expo Location** - Geolocation
- **React Native Reanimated** - Native animations
- **Expo Linear Gradient** - Gradients
- **Expo Vector Icons** - Icons

## Project Structure

```
food-delivery/
├── app/                          # Expo Router screens
│   ├── (tabs)/                  # Bottom tab navigation
│   │   ├── _layout.tsx         # Tab navigator config
│   │   ├── index.tsx           # Home screen
│   │   ├── orders.tsx          # Orders screen
│   │   ├── favorites.tsx       # Favorites screen
│   │   ├── notifications.tsx   # Notifications screen
│   │   └── profile.tsx         # Profile screen
│   ├── (screens)/              # Stack screens
│   │   ├── _layout.tsx         # Stack navigator config
│   │   ├── login.tsx           # Login screen
│   │   ├── verify-otp.tsx      # OTP verification
│   │   ├── address-input.tsx   # Address search
│   │   ├── location-picker.tsx # Map picker
│   │   └── help-center.tsx     # Help center
│   ├── _layout.tsx             # Root layout
│   ├── +html.tsx               # Web HTML wrapper
│   └── +not-found.tsx          # 404 page
│
├── components/                  # Reusable components
│   ├── common/                 # Shared UI components
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── index/                  # Home screen components
│   │   ├── Header.tsx
│   │   ├── BannerCarousel.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── RestaurantList.tsx
│   │   └── TrumDealNgon.tsx
│   ├── location/               # Location features
│   │   ├── LocationPermissionModal.tsx
│   │   ├── LocationDeniedModal.tsx
│   │   ├── AddressInputScreen.tsx
│   │   ├── MapPicker.tsx
│   │   └── picker.tsx
│   └── profile/                # Profile components
│       ├── ProfileHeader.tsx
│       ├── MenuSection.tsx
│       └── MenuItem.tsx
│
├── src/
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/                  # Custom hooks
│   │   ├── index.ts           # Exports
│   │   ├── useAuth.ts         # Auth hook
│   │   ├── useAddresses.ts    # Address management
│   │   ├── useBanners.ts      # Banner data
│   │   ├── useCategories.ts   # Category data
│   │   └── useReverseGeocode.ts # Geocoding
│   ├── lib/                    # Utils & services
│   │   ├── supabase.ts        # Supabase client
│   │   └── locationStorage.ts # Local storage
│   ├── store/                  # Zustand stores
│   │   ├── cartStore.ts       # Shopping cart
│   │   ├── locationStore.ts   # Location state
│   │   └── storage.ts         # Storage config
│   └── types/                  # TypeScript types
│       ├── index.ts           # Common types
│       └── location.ts        # Location types
│
├── assets/                     # Static assets
│   ├── images/                # Images
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   └── favicon.png
│   └── fonts/                 # Custom fonts
│
├── docs/                       # Documentation
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   ├── CHANGELOG.md
│   └── database-schema.sql
│
├── .env                        # Environment variables
├── .env.example               # Env template
├── .gitignore                 # Git ignore rules
├── app.json                   # Expo config (static)
├── app.config.js              # Expo config (dynamic)
├── babel.config.js            # Babel config
├── metro.config.js            # Metro bundler config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # Main documentation
```

## Data Flow

### Authentication Flow
```
User Action → AuthContext → Supabase Auth → Update Context → Navigate
```

### Location Flow
```
User Location → LocationStore → AsyncStorage → Components
                     ↓
                Supabase DB (if logged in)
```

### Data Fetching Flow
```
Component → TanStack Query → Supabase → Cache → Component
```

## Database Schema

### Core Tables
- `users` - User profiles
- `restaurants` - Restaurant data
- `dishes` - Menu items
- `orders` - Order records
- `addresses` - Saved addresses
- `favorites` - User favorites
- `banners` - Promotional banners
- `categories` - Food categories

See [database-schema.sql](database-schema.sql) for complete schema.

## Security

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only access their own data
- Public data is read-only
- Admin operations require service role

### Environment Variables
- Never commit `.env` file
- Use `.env.example` as template
- Store secrets in Supabase Dashboard

### OAuth Security
- OAuth tokens managed by Supabase
- PKCE flow for mobile apps
- Secure callback handling

## Performance

### Optimizations
- **Code Splitting**: Expo Router lazy loads screens
- **Image Optimization**: Expo Image for caching
- **Query Caching**: TanStack Query caches API responses
- **Debouncing**: Input debouncing for search
- **Memoization**: React.memo for expensive components

### State Management
- **Zustand**: Lightweight, no boilerplate
- **Persist**: Auto-save to AsyncStorage
- **Selectors**: Prevent unnecessary re-renders

## Testing Strategy

### Unit Tests
- Business logic in `src/lib/`
- Custom hooks
- Utility functions

### Integration Tests
- API calls with mock Supabase
- Navigation flows
- Form submissions

### E2E Tests
- Critical user flows
- Authentication
- Order placement

## Deployment

### Development
```bash
npm start           # Expo Go
```

### Preview
```bash
npx expo export     # Production build
```

### Production
```bash
eas build --platform all    # EAS Build
eas submit --platform all   # Submit to stores
```

## Best Practices

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Enforce code quality
- **Prettier**: Auto-formatting
- **Naming**: PascalCase for components, camelCase for functions

### Component Structure
```tsx
// 1. Imports
import { ... } from 'react'

// 2. Types
type Props = { ... }

// 3. Component
export default function MyComponent({ ...props }: Props) {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleAction = () => { ... }
  
  // 6. Effects
  useEffect(() => { ... }, [])
  
  // 7. Render
  return <View>...</View>
}
```

### Git Workflow
- **Branch naming**: `feature/name`, `fix/name`, `chore/name`
- **Commits**: Conventional commits format
- **PR**: Template with checklist
- **Review**: Require approval before merge

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
