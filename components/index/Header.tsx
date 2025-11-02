import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, Text, TextInput, View } from "react-native";

type HeaderProps = {
  location: string;
  placeholder?: string;
  value?: string;
  onSearchChange?: (text: string) => void;
  onPressLocation?: () => void;
  scrollY?: Animated.Value;
};

export default function Header({
  location,
  placeholder = "Tìm kiếm món ăn, quán...",
  value,
  onSearchChange,
  onPressLocation,
  scrollY,
}: HeaderProps) {
  // Smooth, slower interpolation tied to scrollY (more gradual)
  const locationOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  const locationHeight = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [48, 0],
        extrapolate: "clamp",
      })
    : 48;

  const paddingTop = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [48, 12],
        extrapolate: "clamp",
      })
    : 48;

  return (
    <Animated.View
      style={{ paddingTop, zIndex: 1000, elevation: 1000 }}
      className="bg-primary-400 px-2 pb-2"
    >
      <Animated.View
        style={{
          opacity: locationOpacity,
          height: locationHeight,
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <Text className="text-white mb-1">Giao đến:</Text>

        <Pressable
          onPress={onPressLocation}
          className="flex-row items-center gap-2 mb-3"
          hitSlop={10}
        >
          <Ionicons name="location" size={18} color="white" />
          <Text
            className="text-sm font-semibold text-white flex-1"
            numberOfLines={1}
          >
            {location}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="white" />
        </Pressable>
      </Animated.View>

      <View className="flex-row items-center bg-white rounded-md px-2 h-11">
        <Ionicons name="search" size={24} color="#26C6DA" />
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
          placeholderTextColor="#26C6DA"
          underlineColorAndroid="transparent"
        />
      </View>
    </Animated.View>
  );
}
