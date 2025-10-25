import { useReverseGeocode } from "@/src/hooks/useReverseGeocode";
import { useLocationStore } from "@/src/store/locationStore";
import type { Location } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapPicker from "./MapPicker";

export default function LocationPickerScreen() {
  // Get saved location and address from global store
  const { location, address, setAll } = useLocationStore();
  
  // Local state for current selected location
  const [loc, setLoc] = useState<Location | null>(location);
  
  // Auto reverse-geocode whenever location changes
  const { address: revAddr, loading: addrLoading } = useReverseGeocode(
    loc?.latitude,
    loc?.longitude
  );
  
  const [searchText, setSearchText] = useState("");
  const [locating, setLocating] = useState(false);

  // Initialize with saved location or default to HCM center
  useEffect(() => {
    if (loc) return;
    
    setLoc({
      latitude: 10.8231,
      longitude: 106.6297,
    });
  }, [loc]);

  // Debounce map movements to avoid too many geocode requests
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMapChange = (l: Location) => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setLoc(l), 350);
  };

  const onConfirm = () => {
    if (!loc) return;
    
    // Wait for address loading to finish
    if (addrLoading) {
      Alert.alert("Đang tải", "Vui lòng đợi địa chỉ được xác định.");
      return;
    }
    
    // Use reverse-geocoded address if available and valid
    const finalAddr = revAddr.formatted && revAddr.formatted.trim()
      ? revAddr
      : { formatted: `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}` };
    
    setAll({ location: loc, address: finalAddr });
    router.push("/");
  };

  const onSearch = async () => {
    if (!searchText.trim()) return;
    
    try {
      // Forward geocode: convert text address to coordinates
      const results = await ExpoLocation.geocodeAsync(searchText.trim());
      
      if (results?.length) {
        const { latitude, longitude } = results[0];
        setLoc({ latitude, longitude });
      } else {
        Alert.alert("Không tìm thấy", "Không tìm thấy địa chỉ này.");
      }
    } catch (e) {
      Alert.alert("Lỗi tìm kiếm", "Không thể tìm kiếm địa chỉ.");
    }
  };

  const onUseMyLocation = async () => {
    try {
      setLocating(true);
      
      // Check if location services are enabled
      const enabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Dịch vụ vị trí", 
          "Vui lòng bật dịch vụ định vị trong cài đặt thiết bị."
        );
        return;
      }
      
      // Request permission if not granted
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối", 
          "Cần cấp quyền truy cập vị trí để sử dụng tính năng này."
        );
        return;
      }
      
      // Get current position
      const cur = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
      
      setLoc({
        latitude: cur.coords.latitude,
        longitude: cur.coords.longitude,
      });
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể lấy vị trí hiện tại");
    } finally {
      setLocating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-400 pb-2" edges={["top"]}>
      {/* Header with back button */}
      <View className="bg-primary-400 px-4 py-3 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">
            Chọn vị trí giao hàng
          </Text>
          <Text className="text-xs text-white/80 mt-0.5">
            Di chuyển bản đồ để chọn địa chỉ chính xác
          </Text>
        </View>
      </View>

      {/* Map with center pin marker */}
      <View className="flex-1">
        {loc ? (
          <MapPicker initialLocation={loc} onLocationChange={onMapChange} />
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-50">
            <ActivityIndicator size="large" color="#26C6DA" />
            <Text className="mt-4 text-gray-600">Đang tải bản đồ...</Text>
          </View>
        )}
      </View>

      {/* Bottom card with actions */}
      <View className="bg-white px-4 py-3 border-t border-gray-100 shadow-lg">
        {/* Use My Location Button */}
        <Pressable
          onPress={onUseMyLocation}
          disabled={locating}
          className="flex-row items-center justify-center py-3 mb-3 bg-blue-50 rounded-md active:bg-blue-100"
        >
          {locating ? (
            <ActivityIndicator size="small" color="#26C6DA" />
          ) : (
            <>
              <Ionicons name="navigate" size={20} color="#26C6DA" />
              <Text className="ml-2 text-primary-400 font-semibold">
                Dùng vị trí hiện tại của tôi
              </Text>
            </>
          )}
        </Pressable>

        {/* Search bar */}
        {/* <View className="flex-row items-center mb-3 bg-gray-50 rounded-md px-3 border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm địa chỉ..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            className="flex-1 py-3 px-2 text-base"
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </Pressable>
          )}
        </View> */}

        {/* Current address display */}
        <View className="flex-row items-start mb-3 p-3 bg-gray-50 rounded-md">
          <Ionicons name="location-sharp" size={22} color="#26C6DA" />
          <View className="flex-1 ml-3">
            <Text className="text-xs text-gray-500 mb-1">Địa chỉ đã chọn</Text>
            <Text
              className="text-sm font-medium text-gray-800"
              numberOfLines={2}
            >
              {addrLoading
                ? "Đang tải địa chỉ..."
                : revAddr.formatted || "Chưa xác định"}
            </Text>
          </View>
        </View>

        {/* Confirm button */}
        <Pressable
          onPress={onConfirm}
          disabled={!loc || addrLoading}
          className={`py-4 rounded-md items-center ${
            !loc || addrLoading ? "bg-gray-300" : "bg-primary-400 active:bg-primary-500"
          }`}
        >
          <Text className="text-white font-semibold text-base">
            Xác nhận vị trí
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
