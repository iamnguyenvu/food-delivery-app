import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  onViewAllPress?: () => void;
  viewAllText?: string;
  titleColor?: string; // default: text-primary-400
  titleSize?: string; // default: text-base
  viewAllColor?: string; // default: text-gray-500
}

interface CardProps extends ViewProps {
  children: ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
  header?: CardHeaderProps; // Standard header
  customHeader?: ReactNode; // For special headers like Flash Sale
}

export default function Card({
  children,
  backgroundColor = "bg-white",
  borderRadius = 12,
  className = "mx-2 mb-3",
  style,
  header,
  customHeader,
  ...props
}: CardProps) {
  return (
    <View
      className={`${backgroundColor} ${className}`.trim()}
      style={[{ borderRadius }, style]}
      {...props}
    >
      {customHeader ? (
        customHeader
      ) : header ? (
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
          <View className="flex-1">
            <Text 
              className={`${header.titleSize || "text-base"} font-semibold ${header.titleColor || "text-primary-400"}`}
            >
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
              <Text className={`text-xs ${header.viewAllColor || "text-gray-500"}`}>
                {header.viewAllText || "Xem tất cả"}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color="#6B7280"
              />
            </Pressable>
          )}
        </View>
      ) : null}
      {children}
    </View>
  );
}
