import { useCartStore } from "@/src/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import CartModal from "./CartModal";

export default function FloatingCartBar() {
  const { items, getTotalPrice, getTotalDiscount } = useCartStore();
  const [showCartModal, setShowCartModal] = useState(false);

  // Only show if cart has items
  if (items.length === 0) {
    return null;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const originalTotal = getTotalPrice();
  const discount = getTotalDiscount();
  const finalTotal = originalTotal - discount;

  const handleCartPress = () => {
    setShowCartModal(true);
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    // Navigate to checkout
    router.push("/(screens)/checkout" as any);
  };

  return (
    <>
      <Pressable
        onPress={handleCartPress}
        className="absolute bottom-4 left-4 right-4 bg-primary-400 rounded-full shadow-lg active:opacity-90"
        style={{ elevation: 8 }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* Left: Cart icon + badge */}
          <View className="flex-row items-center">
            <View className="relative">
              <Ionicons name="cart" size={28} color="white" />
              {totalItems > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                  <Text className="text-white text-xs font-bold">
                    {totalItems}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Center: Price info */}
          <View className="flex-1 mx-3">
            {discount > 0 && (
              <Text className="text-white/70 text-xs line-through">
                ₫{originalTotal.toLocaleString()}
              </Text>
            )}
            <Text className="text-white text-lg font-bold">
              ₫{finalTotal.toLocaleString()}
            </Text>
          </View>

          {/* Right: Checkout button */}
          <Pressable
            onPress={handleCheckout}
            className="bg-white rounded-full px-4 py-2 active:opacity-80"
          >
            <Text className="text-primary-400 font-bold">Giao hàng</Text>
          </Pressable>
        </View>
      </Pressable>

      <CartModal
        visible={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}
