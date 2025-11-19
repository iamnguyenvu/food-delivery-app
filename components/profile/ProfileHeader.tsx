import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type ProfileHeaderProps = {
  onPressAvatar?: () => void;
};

export default function ProfileHeader({ onPressAvatar }: ProfileHeaderProps) {
  const { user } = useAuth();

  // Guest user - show login/register buttons
  if (!user) {
    return (
      <View className="bg-primary-400 px-4 pt-12 pb-6">
        <View className="flex-row items-center gap-4 mt-12 pl-2">
          {/* Avatar */}
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
            <Ionicons name="person" size={38} color="#26C6DA" />
          </View>

          {/* Guest text and buttons */}
          <View className="flex-1 items-center justify-between flex-row">
            <View></View>
            {/* <Text className="text-white text-lg font-semibold mb-2">
            </Text> */}
            <Pressable
              onPress={() => router.push("/(screens)/login" as any)}
              className="bg-white rounded-sm py-2 px-4 active:bg-white/90"
            >
              <Text className="text-primary-400 font-semibold text-center">
                Đăng nhập / Đăng ký
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Logged in user
  const email = user.email || "User";
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
  const displayName = fullName || email.split("@")[0];
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <View className="bg-primary-400 px-4 pt-12 pb-6">
      <Pressable
        onPress={onPressAvatar}
        className="flex-row items-center gap-4 mt-12"
        hitSlop={10}
      >
        {/* Avatar */}
        <View className="w-20 h-20 rounded-full bg-white items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={38} color="#26C6DA" />
          )}
        </View>

        {/* User Info */}
        <View className="flex-1">
          <Text className="text-white text-lg font-semibold" numberOfLines={1}>
            {displayName}
          </Text>
          {fullName && (
            <Text className="text-white/80 text-sm mt-0.5" numberOfLines={1}>
              {email}
            </Text>
          )}
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={20} color="white" />
      </Pressable>
    </View>
  );
}
