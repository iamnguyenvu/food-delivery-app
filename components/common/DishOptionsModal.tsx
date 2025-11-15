import { Dish } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface DishOption {
  id: string;
  name: string;
  type: "size" | "topping" | "addon";
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiSelect: boolean;
}

interface DishOptionsModalProps {
  visible: boolean;
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number, selectedOptions: any, notes: string) => void;
}

export default function DishOptionsModal({
  visible,
  dish,
  onClose,
  onAddToCart,
}: DishOptionsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState("");

  // Mock options - in production, this would come from dish data
  const options: DishOption[] = [
    {
      id: "size",
      name: "Chọn kích cỡ",
      type: "size",
      required: true,
      multiSelect: false,
      choices: [
        { id: "small", name: "Nhỏ", price: 0 },
        { id: "medium", name: "Vừa", price: 10000 },
        { id: "large", name: "Lớn", price: 20000 },
      ],
    },
    {
      id: "toppings",
      name: "Topping (Chọn tối đa 3)",
      type: "topping",
      required: false,
      multiSelect: true,
      choices: [
        { id: "cheese", name: "Phô mai", price: 5000 },
        { id: "egg", name: "Trứng", price: 8000 },
        { id: "bacon", name: "Thịt xông khói", price: 15000 },
        { id: "mushroom", name: "Nấm", price: 10000 },
      ],
    },
  ];

  const handleToggleOption = (optionId: string, choiceId: string, multiSelect: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[optionId] || [];
      
      if (multiSelect) {
        // For multi-select, toggle the choice
        if (current.includes(choiceId)) {
          return { ...prev, [optionId]: current.filter((id) => id !== choiceId) };
        } else {
          // Limit to 3 toppings
          if (optionId === "toppings" && current.length >= 3) {
            return prev;
          }
          return { ...prev, [optionId]: [...current, choiceId] };
        }
      } else {
        // For single-select, replace the selection
        return { ...prev, [optionId]: [choiceId] };
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!dish) return 0;
    
    let optionsPrice = 0;
    options.forEach((option) => {
      const selected = selectedOptions[option.id] || [];
      selected.forEach((choiceId) => {
        const choice = option.choices.find((c) => c.id === choiceId);
        if (choice) {
          optionsPrice += choice.price;
        }
      });
    });

    return (dish.price + optionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!dish) return;

    // Validate required options
    const missingRequired = options.some(
      (option) => option.required && (!selectedOptions[option.id] || selectedOptions[option.id].length === 0)
    );

    if (missingRequired) {
      alert("Vui lòng chọn đầy đủ các tùy chọn bắt buộc");
      return;
    }

    onAddToCart(dish, quantity, selectedOptions, notes);
    handleClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setSelectedOptions({});
    setNotes("");
    onClose();
  };

  if (!dish) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header with Image */}
          <View className="relative">
            <Image
              source={{ uri: dish.image || "https://via.placeholder.com/400x200" }}
              className="w-full h-48 rounded-t-3xl"
              resizeMode="cover"
            />
            <Pressable
              onPress={handleClose}
              className="absolute top-4 right-4 bg-white/90 rounded-full p-2"
            >
              <Ionicons name="close" size={24} color="#1F2937" />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-4 py-4">
            {/* Dish Info */}
            <Text className="text-xl font-bold text-gray-800 mb-2">{dish.name}</Text>
            <Text className="text-base text-gray-600 mb-4">{dish.description}</Text>

            {/* Options */}
            {options.map((option) => (
              <View key={option.id} className="mb-6">
                <Text className="text-base font-bold text-gray-800 mb-3">
                  {option.name}
                  {option.required && <Text className="text-red-500"> *</Text>}
                </Text>

                {option.choices.map((choice) => {
                  const isSelected = selectedOptions[option.id]?.includes(choice.id);
                  return (
                    <Pressable
                      key={choice.id}
                      onPress={() => handleToggleOption(option.id, choice.id, option.multiSelect)}
                      className={`flex-row items-center justify-between p-3 mb-2 rounded-lg border ${
                        isSelected ? "border-primary-400 bg-primary-50" : "border-gray-200"
                      }`}
                    >
                      <View className="flex-row items-center flex-1">
                        <View
                          className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                            isSelected ? "border-primary-400 bg-primary-400" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                        </View>
                        <Text className={`text-sm ${isSelected ? "font-semibold text-gray-800" : "text-gray-700"}`}>
                          {choice.name}
                        </Text>
                      </View>
                      {choice.price > 0 && (
                        <Text className="text-sm font-semibold text-primary-400">
                          +₫{choice.price.toLocaleString()}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}

            {/* Notes */}
            <View className="mb-4">
              <Text className="text-base font-bold text-gray-800 mb-3">
                Ghi chú (tuỳ chọn)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Ví dụ: Không hành, ít cay..."
                multiline
                numberOfLines={3}
                className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700"
                style={{ textAlignVertical: "top" }}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            {/* Quantity */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold text-gray-800">Số lượng</Text>
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="remove" size={18} color="#6B7280" />
                </Pressable>
                <Text className="text-base font-bold w-8 text-center">{quantity}</Text>
                <Pressable
                  onPress={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 bg-primary-400 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="add" size={18} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Add to Cart Button */}
            <Pressable
              onPress={handleAddToCart}
              className="bg-primary-400 rounded-full py-3 flex-row items-center justify-center active:opacity-90"
            >
              <Ionicons name="cart" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">
                Thêm vào giỏ - ₫{calculateTotalPrice().toLocaleString()}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
