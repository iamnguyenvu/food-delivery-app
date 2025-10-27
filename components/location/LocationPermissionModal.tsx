import { useAuth } from "@/src/contexts/AuthContext";
import { useAddresses } from "@/src/hooks";
import { formatAddress } from "@/src/hooks/useReverseGeocode";
import { LocationStorage } from "@/src/lib/locationStorage";
import type { Location } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onLocationGranted: (
    location: { latitude: number; longitude: number },
    address: string
  ) => void;
  onManualInput: () => void;
};

export default function LocationPermissionModal({
  visible,
  onLocationGranted,
  onManualInput,
}: Props) {
  const [loading, setLoading] = useState(false);
  
  // Hooks MUST be called at top level
  const { user } = useAuth();
  const { saveAddress: saveToDatabase } = useAddresses(user?.id || "");

  const handleAllowLocation = async () => {
    try {
      setLoading(true);

      const enabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Dịch vụ vị trí",
          "Vui lòng bật dịch vụ định vị trong cài đặt thiết bị."
        );
        setLoading(false);
        return;
      }

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền bị từ chối",
          "Ứng dụng cần quyền truy cập vị trí để giao hàng."
        );
        setLoading(false);
        return;
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
      const coords: Location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Reverse geocode to get address text
      const results = await ExpoLocation.reverseGeocodeAsync(coords);
      const addressData = formatAddress(results[0]);

      // Save address to storage
      if (user?.id) {
        await saveToDatabase(coords, addressData, "other", false);
      } else {
        await LocationStorage.saveAddress({
          location: coords,
          address: addressData,
          timestamp: new Date().toISOString(),
        });
      }

      // Call callback to update UI
      onLocationGranted(coords, addressData.formatted);
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể lấy vị trí hiện tại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        // Prevent dismissing with back button - location is required
        return;
      }}
    >
      <Pressable 
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={() => {
          // Prevent dismissing by tapping outside - location is required
          return;
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-lg p-4 w-full max-w-sm">
            {/* Icon */}
            <View className="items-center my-4">
              <View className="w-20 h-20 bg-primary-50 rounded-full items-center justify-center">
                <Ionicons name="location" size={40} color="#26C6DA" />
              </View>
            </View>

            {/* Title */}
            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
              Cho phép truy cập vị trí
            </Text>

            {/* Description */}
            <Text className="text-sm text-gray-600 text-center mb-6">
              Để giao hàng chính xác, chúng tôi cần biết vị trí của bạn
            </Text>

            {/* Allow Location Button */}
            <Pressable
              onPress={handleAllowLocation}
              disabled={loading}
              className="bg-primary-400 py-4 rounded-md mb-3 active:bg-primary-500"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Ionicons name="navigate" size={20} color="white" />
                  <Text className="text-white font-semibold text-base ml-2">
                    Cho phép truy cập vị trí
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Manual Input Button */}
            <Pressable
              onPress={onManualInput}
              disabled={loading}
              className="bg-gray-100 py-4 rounded-md active:bg-gray-200"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="create-outline" size={20} color="#26C6DA" />
                <Text className="text-primary-400 font-semibold text-base ml-2">
                  Nhập địa chỉ thủ công
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
