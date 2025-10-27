import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Linking,
    Modal,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function LocationDeniedModal({ visible, onDismiss }: Props) {
  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable 
        className="flex-1 bg-black/60 justify-center items-center px-6"
        onPress={onDismiss}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-lg p-6 w-full max-w-sm">
            {/* Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center">
                <Ionicons name="location-outline" size={32} color="#FB923C" />
              </View>
            </View>

            {/* Title */}
            <Text className="text-lg font-bold text-gray-800 text-center mb-3">
              Quyền truy cập vị trí bị từ chối
            </Text>

            {/* Description */}
            <Text className="text-sm text-gray-600 text-center mb-6 leading-5">
              Khi được cấp quyền truy cập vị trí, ứng dụng có thể gợi ý bạn đa dạng món ăn từ các nhà hàng gần bạn, tính toán thời gian giao hàng chính xác và mang đến trải nghiệm tốt nhất.
            </Text>

            {/* Benefits List */}
            <View className="mb-6 space-y-2">
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color="#26C6DA" />
                <Text className="text-sm text-gray-700 ml-2 flex-1">
                  Gợi ý nhà hàng gần bạn
                </Text>
              </View>
              <View className="flex-row items-start mt-2">
                <Ionicons name="checkmark-circle" size={20} color="#26C6DA" />
                <Text className="text-sm text-gray-700 ml-2 flex-1">
                  Tính thời gian giao hàng chính xác
                </Text>
              </View>
              <View className="flex-row items-start mt-2">
                <Ionicons name="checkmark-circle" size={20} color="#26C6DA" />
                <Text className="text-sm text-gray-700 ml-2 flex-1">
                  Trải nghiệm đặt hàng nhanh chóng
                </Text>
              </View>
            </View>

            {/* Open Settings Button */}
            <Pressable
              onPress={openSettings}
              className="bg-primary-400 py-3.5 rounded-md mb-3 active:bg-primary-500"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Mở cài đặt
                </Text>
              </View>
            </Pressable>

            {/* Dismiss Button */}
            <Pressable
              onPress={onDismiss}
              className="py-3 rounded-md active:bg-gray-50"
            >
              <Text className="text-gray-600 font-medium text-base text-center">
                Để sau
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
