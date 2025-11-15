import { useCartStore } from "@/src/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartModal({
  visible,
  onClose,
  onCheckout,
}: CartModalProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalDiscount } = useCartStore();

  const originalTotal = getTotalPrice();
  const discount = getTotalDiscount();
  const finalTotal = originalTotal - discount;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[80%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Giỏ hàng</Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1 px-4 py-2">
            {items.map((item) => (
              <View
                key={item.dish.id}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                {/* Image */}
                <Image
                  source={{ uri: item.dish.image || "https://via.placeholder.com/80" }}
                  className="w-20 h-20 rounded-md"
                  resizeMode="cover"
                />

                {/* Info */}
                <View className="flex-1 mx-3">
                  <Text className="text-sm font-semibold text-gray-800" numberOfLines={2}>
                    {item.dish.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    {item.dish.originalPrice && item.dish.discountPercent ? (
                      <>
                        <Text className="text-sm font-bold text-primary-400">
                          ₫{item.dish.price.toLocaleString()}
                        </Text>
                        <Text className="text-xs text-gray-400 line-through ml-2">
                          ₫{item.dish.originalPrice.toLocaleString()}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-sm font-bold text-gray-800">
                        ₫{item.dish.price.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Quantity Controls */}
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center active:opacity-70"
                  >
                    <Ionicons name="remove" size={16} color="#6B7280" />
                  </Pressable>
                  <Text className="text-sm font-bold w-6 text-center">
                    {item.quantity}
                  </Text>
                  <Pressable
                    onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
                    className="w-8 h-8 bg-primary-400 rounded-full items-center justify-center active:opacity-70"
                  >
                    <Ionicons name="add" size={16} color="white" />
                  </Pressable>
                </View>

                {/* Delete Button */}
                <Pressable
                  onPress={() => removeItem(item.dish.id)}
                  className="ml-2 p-2 active:opacity-70"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            {/* Price Summary */}
            <View className="mb-3">
              {discount > 0 && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-600">Tạm tính</Text>
                  <Text className="text-sm text-gray-400 line-through">
                    ₫{originalTotal.toLocaleString()}
                  </Text>
                </View>
              )}
              {discount > 0 && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-600">Giảm giá</Text>
                  <Text className="text-sm text-red-500">
                    -₫{discount.toLocaleString()}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold">Tổng cộng</Text>
                <Text className="text-lg font-bold text-primary-400">
                  ₫{finalTotal.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <Pressable
              onPress={onCheckout}
              className="bg-primary-400 rounded-full py-3 items-center active:opacity-90"
            >
              <Text className="text-white font-bold text-base">
                Tiến hành đặt hàng
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
