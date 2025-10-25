import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const CATEGORIES: Category[] = [
  { id: "1", name: "Tất cả", icon: "grid-outline" },
  { id: "2", name: "Món ăn", icon: "fast-food-outline" },
  { id: "3", name: "Thức uống", icon: "cafe-outline" },
  { id: "4", name: "Đồ chay", icon: "leaf-outline" },
  { id: "5", name: "Món Á", icon: "restaurant-outline" },
  { id: "6", name: "Món Âu", icon: "pizza-outline" },
  { id: "7", name: "Tráng miệng", icon: "ice-cream-outline" },
];

type CategoryListProps = {
  selectedId?: string;
  onSelectCategory?: (id: string) => void;
};

export default function CategoryList({
  selectedId = "1",
  onSelectCategory,
}: CategoryListProps) {
  return (
    <View className="mt-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 gap-2"
      >
        {CATEGORIES.map((category) => {
          const isSelected = category.id === selectedId;
          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory?.(category.id)}
              className={`px-4 py-2.5 rounded-full flex-row items-center gap-2 ${
                isSelected
                  ? "bg-primary-400"
                  : "bg-white border border-gray-200"
              }`}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={isSelected ? "#FFFFFF" : "#26C6DA"}
              />
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
