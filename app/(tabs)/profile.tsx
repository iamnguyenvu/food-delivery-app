import MenuSection, {
    type MenuSectionProps,
} from "@/components/profile/MenuSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useAuth } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { Alert, ScrollView, View } from "react-native";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  
  // Financial section
  const financialItems: MenuSectionProps["items"] = [
    {
      icon: "wallet-outline",
      label: "Ví voucher",
      onPress: () => router.push("/voucher/vouchers" as any),
      badge: 3,
    },
    {
      icon: "diamond-outline",
      label: "Xu tích lũy",
      onPress: () => router.push("/points" as any),
      badge: "250",
    },
  ];

  // Payment & Address section
  const paymentAddressItems: MenuSectionProps["items"] = [
    {
      icon: "card-outline",
      label: "Phương thức thanh toán",
      onPress: () => router.push("/payment-methods" as any),
    },
    {
      icon: "location-outline",
      label: "Địa chỉ của tôi",
      onPress: () => router.push("/my-addresses" as any),
    },
  ];

  // Referral section (commented for later)
  // const referralItems: MenuSectionProps["items"] = [
  //   {
  //     icon: "people-outline",
  //     label: "Mời bạn bè",
  //     onPress: () => router.push("/referral" as any),
  //   },
  //   {
  //     icon: "storefront-outline",
  //     label: "Ứng dụng cho chủ quán",
  //     onPress: () => router.push("/merchant-app" as any),
  //   },
  // ];

  // Help & Settings section
  const helpSettingsItems: MenuSectionProps["items"] = [
    {
      icon: "help-circle-outline",
      label: "Trung tâm trợ giúp",
      onPress: () => router.push("/(screens)/help-center" as any),
    },
    {
      icon: "settings-outline",
      label: "Cài đặt",
      onPress: () => router.push("/settings" as any),
    },
  ];

  const handleAvatarPress = () => {
    router.push("/edit-profile" as any);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/(screens)/login" as any);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  // Logout section (only show if user is logged in)
  const logoutItems: MenuSectionProps["items"] = user ? [
    {
      icon: "log-out-outline",
      label: "Đăng xuất",
      onPress: handleLogout,
      textColor: "#EF4444", // red color for logout
    },
  ] : [];

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header - extends to top */}
        <ProfileHeader onPressAvatar={handleAvatarPress} />

        {/* Content Sections - with top padding */}
        <View className="pt-3">
          <MenuSection items={financialItems} marginBottom={12} />
          <MenuSection items={paymentAddressItems} marginBottom={12} />
          {/* <MenuSection items={referralItems} marginBottom={12} /> */}
          <MenuSection items={helpSettingsItems} marginBottom={12} />
          {user && <MenuSection items={logoutItems} marginBottom={12} />}
        </View>
      </ScrollView>
    </View>
  );
}