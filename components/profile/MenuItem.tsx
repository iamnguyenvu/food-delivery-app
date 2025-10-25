import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: string | number;
  iconColor?: string;
};

export default function MenuItem({
  icon,
  label,
  onPress,
  badge,
  iconColor = "#26C6DA",
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-4 px-4 active:bg-gray-50"
    >
      {/* Icon */}
      <View className="w-10 items-center">
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      {/* Label */}
      <Text className="flex-1 text-gray-800 text-sm font-medium ml-3">
        {label}
      </Text>

      {/* Badge (optional) */}
      {badge !== undefined && (
        <View className="bg-red-500 rounded-full px-2 py-0.5 mr-2 min-w-[20px] items-center">
          <Text className="text-white text-xs font-semibold">{badge}</Text>
        </View>
      )}

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}
