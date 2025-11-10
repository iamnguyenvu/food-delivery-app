/**
 * Navigation Helper Functions
 * Handles mapping between different entity types for proper navigation
 */

// ==================== DISH TO RESTAURANT MAPPING ====================

/**
 * Maps dish ID to restaurant ID
 * In real app, this would be fetched from API/database
 */
export function getDishToRestaurantMapping(): Record<string, string> {
  return {
    // Sample dishes all belong to sample restaurant
    'dish-1': 'sample-restaurant-1',
    'dish-2': 'sample-restaurant-1',
    'dish-3': 'sample-restaurant-1',
    'dish-4': 'sample-restaurant-1',
    'dish-5': 'sample-restaurant-1',
    
    // Recently viewed items (can be mixed)
    '1': 'sample-restaurant-1',
    '2': 'sample-restaurant-1',
    '3': 'sample-restaurant-1',
    '4': 'sample-restaurant-1',
  };
}

/**
 * Get restaurant ID from dish ID
 */
export function getRestaurantIdFromDish(dishId: string): string {
  const mapping = getDishToRestaurantMapping();
  return mapping[dishId] || 'sample-restaurant-1'; // fallback
}

// ==================== FLASH SALE TO DISH MAPPING ====================

/**
 * Maps flash sale ID to dish ID
 */
export function getFlashSaleToDishMapping(): Record<string, string> {
  return {
    'sample-fs-1': 'dish-1',
    'sample-fs-2': 'dish-2', 
    'sample-fs-3': 'dish-3',
  };
}

/**
 * Get dish ID from flash sale ID
 */
export function getDishIdFromFlashSale(flashSaleId: string): string {
  const mapping = getFlashSaleToDishMapping();
  return mapping[flashSaleId] || 'dish-1'; // fallback
}

// ==================== DEAL TO DISH MAPPING ====================

/**
 * Maps deal ID to dish ID
 */
export function getDealToDishMapping(): Record<string, string> {
  return {
    'sample-1': 'dish-1',
    'sample-2': 'dish-2',
    'sample-3': 'dish-3',
  };
}

/**
 * Get dish ID from deal ID
 */
export function getDishIdFromDeal(dealId: string): string {
  const mapping = getDealToDishMapping();
  return mapping[dealId] || 'dish-1'; // fallback
}

// ==================== NAVIGATION HELPERS ====================

export interface NavigationMappings {
  dishToRestaurant: (dishId: string) => string;
  flashSaleToDish: (flashSaleId: string) => string;
  dealToDish: (dealId: string) => string;
}

/**
 * Get all navigation mappings in one object
 */
export function getNavigationMappings(): NavigationMappings {
  return {
    dishToRestaurant: getRestaurantIdFromDish,
    flashSaleToDish: getDishIdFromFlashSale,
    dealToDish: getDishIdFromDeal,
  };
}