import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable, Text, TextInput } from "react-native";

type HeaderProps = {
  location: string;
  placeholder?: string;
  value?: string;
  onSearchChange?: (text: string) => void;
  onSearchPress?: () => void;
  onPressLocation?: () => void;
  scrollY?: Animated.Value;
};

export default function Header({
  location,
  placeholder = "Tìm kiếm món ăn, quán...",
  value,
  onSearchChange,
  onSearchPress,
  onPressLocation,
  scrollY,
}: HeaderProps) {
  // Smooth interpolation that matches scroll speed (1:1 ratio)
  const locationOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  const locationHeight = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [48, 0],
        extrapolate: "clamp",
      })
    : 48;

  const paddingTop = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [48, 48],
        extrapolate: "clamp",
      })
    : 48;

  return (
    <Animated.View
      style={{ paddingTop, zIndex: 1000, elevation: 1000 }}
      className="bg-primary-400 px-2 pb-3"
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

      <Pressable 
        onPress={onSearchPress}
        className="flex-row items-center bg-white rounded-md px-2 h-11"
      >
        <Ionicons name="search" size={24} color="#26C6DA" />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onSearchChange}
          onFocus={onSearchPress}
          returnKeyType="search"
          multiline={false}
          scrollEnabled={false}
          textAlignVertical="center"
          numberOfLines={1}
          className="flex-1 font-medium rounded-lg p-2 text-primary-400"
          placeholderTextColor="#26C6DA"
          underlineColorAndroid="transparent"
          editable={!onSearchPress}
        />
      </Pressable>
    </Animated.View>
  );
}
