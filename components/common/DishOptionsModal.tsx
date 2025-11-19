import { useCartStore } from "@/src/store/cartStore";
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
    onAddToCart?: (
        dish: Dish,
        quantity: number,
        selectedOptions: Record<string, string[]>,
        notes: string,
        pricePerUnit: number
    ) => void;
}

export default function DishOptionsModal({
                                             visible,
                                             dish,
                                             onClose,
                                             onAddToCart,
                                         }: DishOptionsModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string[]>
    >({});
    const [notes, setNotes] = useState("");

    const addItem = useCartStore((s) => s.addItem);


    // Options mock – sau này bạn lấy từ API
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

    const handleToggleOption = (
        optionId: string,
        choiceId: string,
        multiSelect: boolean
    ) => {
        setSelectedOptions((prev) => {
            const current = prev[optionId] || [];

            if (multiSelect) {
                if (current.includes(choiceId)) {
                    return { ...prev, [optionId]: current.filter((id) => id !== choiceId) };
                } else {
                    if (optionId === "toppings" && current.length >= 3) return prev;
                    return { ...prev, [optionId]: [...current, choiceId] };
                }
            } else {
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
                if (choice) optionsPrice += choice.price;
            });
        });

        return (dish.price + optionsPrice) * quantity;
    };

    const handleAddToCart = () => {
        if (!dish) return;

        // Check missing required options
        const missingRequired = options.some(
            (opt) =>
                opt.required &&
                (!selectedOptions[opt.id] || selectedOptions[opt.id].length === 0)
        );

        if (missingRequired) {
            alert("Vui lòng chọn đầy đủ các tùy chọn bắt buộc");
            return;
        }

        const totalPrice = calculateTotalPrice();
        const pricePerOne = totalPrice / quantity;

        if (onAddToCart) {
            onAddToCart(dish, quantity, selectedOptions, notes, pricePerOne);
        } else {
            // Gọi addItem từ store nếu component cha không override
            addItem(
                dish,
                quantity,
                notes,
                {
                    size: selectedOptions.size?.[0],
                    toppings: selectedOptions.toppings || [],
                },
                pricePerOne
            );
        }

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
            transparent
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl max-h-[85%]">

                    {/* HEADER IMAGE */}
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

                    {/* CONTENT */}
                    <ScrollView className="flex-1 px-4 py-4">
                        <Text className="text-xl font-bold text-gray-800 mb-2">{dish.name}</Text>
                        <Text className="text-base text-gray-600 mb-4">{dish.description}</Text>

                        {/* OPTIONS */}
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
                                            onPress={() =>
                                                handleToggleOption(option.id, choice.id, option.multiSelect)
                                            }
                                            className={`flex-row items-center justify-between p-3 mb-2 rounded-lg border ${
                                                isSelected
                                                    ? "border-primary-400 bg-primary-50"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <View className="flex-row items-center flex-1">
                                                <View
                                                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                                                        isSelected
                                                            ? "border-primary-400 bg-primary-400"
                                                            : "border-gray-300"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <Ionicons name="checkmark" size={14} color="white" />
                                                    )}
                                                </View>
                                                <Text
                                                    className={`text-sm ${
                                                        isSelected ? "font-semibold text-gray-800" : "text-gray-700"
                                                    }`}
                                                >
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

                        {/* NOTES */}
                        <View className="mb-4">
                            <Text className="text-base font-bold text-gray-800 mb-3">Ghi chú (tuỳ chọn)</Text>

                            <TextInput
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Ví dụ: không hành, ít cay..."
                                multiline
                                numberOfLines={3}
                                className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700"
                                style={{ textAlignVertical: "top" }}
                            />
                        </View>
                    </ScrollView>

                    {/* FOOTER */}
                    <View className="px-4 py-4 border-t border-gray-200">
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

                        {/* ADD BUTTON */}
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
