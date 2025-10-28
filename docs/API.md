# API Reference

API documentation for DearU Food backend services.

## Base URL

```
https://your-project-id.supabase.co
```

## Authentication

All authenticated requests require a Bearer token:

```typescript
const { data, error } = await supabase
  .from('table')
  .select()
  .headers({
    Authorization: `Bearer ${session.access_token}`
  })
```

## Endpoints

### Authentication

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  phone: '+84901234567',
  password: 'password123'
})
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+84901234567',
  password: 'password123'
})
```

#### OAuth Sign In
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google' // or 'github'
})
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut()
```

### Users

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

#### Update Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .update({
    full_name: 'John Doe',
    avatar_url: 'https://...'
  })
  .eq('id', userId)
```

### Restaurants

#### List Restaurants
```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('*')
  .eq('is_active', true)
  .order('rating', { ascending: false })
```

#### Get Restaurant
```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('*, dishes(*)')
  .eq('id', restaurantId)
  .single()
```

#### Search Restaurants
```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('*')
  .ilike('name', `%${query}%`)
```

### Dishes

#### List Dishes
```typescript
const { data, error } = await supabase
  .from('dishes')
  .select('*, restaurant:restaurants(*)')
  .eq('restaurant_id', restaurantId)
```

#### Get Dish
```typescript
const { data, error } = await supabase
  .from('dishes')
  .select('*')
  .eq('id', dishId)
  .single()
```

### Categories

#### List Categories
```typescript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('sort_order')
```

### Banners

#### List Active Banners
```typescript
const { data, error } = await supabase
  .from('banners')
  .select('*')
  .eq('is_active', true)
  .order('sort_order')
```

#### Track Banner Click
```typescript
const { error } = await supabase.rpc('track_banner_click', {
  banner_id: bannerId
})
```

### Addresses

#### List User Addresses
```typescript
const { data, error } = await supabase
  .from('addresses')
  .select('*')
  .eq('user_id', userId)
  .order('is_default', { ascending: false })
```

#### Create Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .insert({
    user_id: userId,
    address_line: '123 Main St',
    latitude: 10.823100,
    longitude: 106.629700,
    label: 'home',
    is_default: false
  })
```

#### Update Address
```typescript
const { data, error } = await supabase
  .from('addresses')
  .update({ is_default: true })
  .eq('id', addressId)
```

#### Delete Address
```typescript
const { error } = await supabase
  .from('addresses')
  .delete()
  .eq('id', addressId)
```

### Orders

#### Create Order
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    restaurant_id: restaurantId,
    address_id: addressId,
    items: orderItems,
    subtotal: 100000,
    delivery_fee: 20000,
    total: 120000,
    status: 'pending'
  })
```

#### List User Orders
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, restaurant:restaurants(*)')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Get Order
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, restaurant:restaurants(*), address:addresses(*)')
  .eq('id', orderId)
  .single()
```

#### Update Order Status
```typescript
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'confirmed' })
  .eq('id', orderId)
```

### Favorites

#### List User Favorites
```typescript
const { data, error } = await supabase
  .from('favorites')
  .select('*, dish:dishes(*), restaurant:restaurants(*)')
  .eq('user_id', userId)
```

#### Add to Favorites
```typescript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    item_type: 'dish', // or 'restaurant'
    item_id: itemId
  })
```

#### Remove from Favorites
```typescript
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('user_id', userId)
  .eq('item_id', itemId)
```

## Real-time Subscriptions

### Subscribe to Order Updates
```typescript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Order updated:', payload.new)
  })
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

## Storage

### Upload Image
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file)
```

### Get Public URL
```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`)
```

### Delete Image
```typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove([`${userId}/avatar.jpg`])
```

## Error Handling

```typescript
const { data, error } = await supabase
  .from('table')
  .select()

if (error) {
  console.error('Error code:', error.code)
  console.error('Error message:', error.message)
  console.error('Error details:', error.details)
}
```

### Common Error Codes

- `PGRST301`: Row not found
- `23505`: Unique violation
- `23503`: Foreign key violation
- `42501`: Insufficient privileges
- `PGRST116`: Invalid range

## Rate Limiting

- **Anonymous requests**: 100 requests/minute
- **Authenticated requests**: 1000 requests/minute

## Best Practices

### Use TypeScript Types
```typescript
import type { Database } from '@/src/types/supabase'

const supabase = createClient<Database>(url, key)
```

### Handle Errors Gracefully
```typescript
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (error) {
  console.error('Failed to fetch:', error)
  return null
}
```

### Use TanStack Query for Caching
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['restaurants'],
  queryFn: async () => {
    const { data } = await supabase.from('restaurants').select()
    return data
  }
})
```

### Optimize Queries
```typescript
// Good: Select specific columns
.select('id, name, rating')

// Bad: Select all columns
.select('*')
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
