import { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
}

export default function Card({
  children,
  backgroundColor = "bg-white",
  borderRadius = 12,
  className = "",
  style,
  ...props
}: CardProps) {
  return (
    <View
      className={`${backgroundColor} ${className}`.trim()}
      style={[{ borderRadius }, style]}
      {...props}
    >
      {children}
    </View>
  );
}
