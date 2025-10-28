import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  onViewAllPress?: () => void;
  viewAllText?: string;
}

interface CardProps extends ViewProps {
  children: ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
  header?: CardHeaderProps;
}

export default function Card({
  children,
  backgroundColor = "bg-white",
  borderRadius = 12,
  className = "mx-2 mb-3",
  style,
  header,
  ...props
}: CardProps) {
  return (
    <View
      className={`${backgroundColor} ${className}`.trim()}
      style={[{ borderRadius }, style]}
      {...props}
    >
      {header && (
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-primary-400">
              {header.title}
            </Text>
            {header.subtitle && (
              <Text className="text-sm text-gray-500 mt-0.5">
                {header.subtitle}
              </Text>
            )}
          </View>
          {header.onViewAllPress && (
            <Pressable
              onPress={header.onViewAllPress}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Text className="text-[8px] text-gray-500">
                {header.viewAllText || "Xem tất cả"}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#f97316" />
            </Pressable>
          )}
        </View>
      )}
      {children}
    </View>
  );
}
