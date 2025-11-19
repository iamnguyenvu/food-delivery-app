import { supabase } from "@/src/lib/supabase";
import { useCartStore } from "@/src/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CartModal from "./CartModal";

export default function FloatingCartBar() {
  const { items, clearCart, getTotalPrice, getTotalDiscount, getRestaurantId } = useCartStore();
  const [showCartModal, setShowCartModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState<string>("Nhà hàng");
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  
  // Tab bar height: 56 (base) + bottom inset + 8 (padding)
  const tabBarHeight = 56 + insets.bottom + 8;
  // Position cart bar above tab bar
  const bottomOffset = tabBarHeight;

  // Check if we're on the homepage (index tab)
  // Homepage is when we're in (tabs) and the last segment is "index" or we're at the root
  const segmentsArray = segments as string[];
  const isOnHomepage = 
    segmentsArray.length === 0 || 
    (segmentsArray.length === 1 && segmentsArray[0] === "(tabs)") ||
    (segmentsArray.length === 2 && segmentsArray[0] === "(tabs)" && segmentsArray[1] === "index");
  
  // Check if we're on the checkout screen
  const isOnCheckoutScreen = segments.some((segment) => segment === "checkout");

  // Fetch restaurant name
  useEffect(() => {
    const restaurantId = getRestaurantId();
    if (restaurantId) {
      (async () => {
        const { data, error } = await supabase
          .from("restaurants")
          .select("name")
          .eq("id", restaurantId)
          .single();
        
        if (!error && data) {
          setRestaurantName(data.name);
        }
      })();
    } else {
      setRestaurantName("Nhà hàng");
    }
  }, [items, getRestaurantId]);

  // Only show if cart has items, on homepage, and not on checkout screen
  if (items.length === 0 || !isOnHomepage || isOnCheckoutScreen) {
    return null;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getTotalPrice();
  const discount = getTotalDiscount();
  const finalTotal = subtotal - discount;

  const handleCartPress = () => {
    setShowCartModal(true);
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    // Navigate to checkout
    router.push("/(screens)/checkout" as any);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <>
      <Pressable
        onPress={handleCartPress}
        className="absolute left-0 right-0 bg-white border-t border-gray-200 flex-row items-center px-4 py-3"
        style={{ 
          bottom: bottomOffset,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        {/* Left: Icon */}
        <View className="mr-3">
          <Ionicons name="receipt-outline" size={24} color="#26C6DA" />
        </View>

        {/* Center: Restaurant name and items info */}
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
            {restaurantName}
          </Text>
          <Text className="text-xs text-gray-600 mt-0.5">
            {totalItems} {totalItems === 1 ? "món" : "món"} - ₫{finalTotal.toLocaleString("vi-VN")}
          </Text>
        </View>

        {/* Right: Close button */}
        <Pressable
          onPress={handleClearCart}
          className="ml-2 p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color="#6B7280" />
        </Pressable>
      </Pressable>

      <CartModal
        visible={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}
