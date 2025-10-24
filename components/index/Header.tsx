import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

type HeaderProps = {
  location: string;
  placeholder?: string;
  value?: string;
  onSearchChange?: (text: string) => void;
  onPressLocation?: () => void;
  mode?: "full" | "searchOnly";
};

export default function Header({
  location,
  placeholder = "Tìm kiếm món ăn, quán...",
  value,
  onSearchChange,
  onPressLocation,
  mode = "full",
}: HeaderProps) {
  const containerClasses =
    mode === "full"
      ? "bg-primary-400 px-2 pt-12 pb-1"
      : "bg-primary-400 px-2 pb-1";

  return (
    <View className={containerClasses}>
      {mode === "full" && (
        <>
          <Text className="text-white mb-1">Giao đến:</Text>

          <Pressable
            onPress={onPressLocation}
            className="flex-row items-center gap-2 mb-3"
            hitSlop={10}
          >
            <Ionicons name="location" size={18} color={"white"} />
            <Text
              className="text-base font-medium text-white flex-1"
              numberOfLines={1}
            >
              {location}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={"white"} />
          </Pressable>

          <View className="flex-row items-center bg-white rounded-md px-2 h-11">
            <Ionicons name="search" size={24} color={"#26C6DA"} />
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onSearchChange}
              returnKeyType="search"
              multiline={false}
              scrollEnabled={false}
              textAlignVertical="center"
              numberOfLines={1}
              className="flex-1 font-medium rounded-lg p-2 text-primary-400"
              placeholderTextColor={"#26C6DA"}
              underlineColorAndroid={"transparent"}
            />
          </View>
        </>
      )}
    </View>
  );
}
