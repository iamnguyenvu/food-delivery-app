import type { Location } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";
import MapView, { Region } from "react-native-maps";

type Props = {
  initialLocation?: Location;
  onLocationChange: (loc: Location) => void;
};

export default function MapPicker({
  initialLocation,
  onLocationChange,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [region] = useState<Region>({
    latitude: initialLocation?.latitude ?? 10.8231,
    longitude: initialLocation?.longitude ?? 106.6297,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [ready, setReady] = useState(false);
  const [locating, setLocating] = useState(false);

  // Handle region change - only call callback, no state update
  const onRegionChangeComplete = (r: Region) => {
    onLocationChange({ latitude: r.latitude, longitude: r.longitude });
  };

  // Move map to user's current location
  const goToMyLocation = async () => {
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
      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      // Animate to user's location
      const userRegion: Region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(userRegion, 500);
      onLocationChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Không thể lấy vị trí hiện tại");
    } finally {
      setLocating(false);
    }
  };

  return (
    <View className="flex-1">
        <MapView 
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton={false}
            onMapReady={() => setReady(true)}
            moveOnMarkerPress={false}
            toolbarEnabled={false}
            loadingEnabled
            loadingIndicatorColor="#26C6DA"
            loadingBackgroundColor="#ffffff"
        />

        {/* Pin on center  */}
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
            <View className="mb-10">
                <Ionicons name="location" size={48} color={"#EF4444"} />
            </View>
        </View>

        {/* My Location Button */}
        <View className="absolute bottom-4 right-4">
          <Pressable
            onPress={goToMyLocation}
            disabled={locating}
            className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center active:bg-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {locating ? (
              <ActivityIndicator size="small" color="#26C6DA" />
            ) : (
              <Ionicons name="navigate" size={24} color="#26C6DA" />
            )}
          </Pressable>
        </View>

        {!ready && (
            <View className="absolute inset-0 bg-white items-center justify-center">
                <ActivityIndicator size={"large"} color={"#26C6DA"} />
            </View>
        )}
    </View>
  )
}
