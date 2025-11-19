import type { Location } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  initialLocation?: Location;
  onLocationChange: (loc: Location) => void;
};

export default function MapPickerWeb({
  initialLocation,
  onLocationChange,
}: Props) {
  const [location, setLocation] = useState<Location>(
    initialLocation || { latitude: 10.8231, longitude: 106.6297 }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      onLocationChange(initialLocation);
    }
    setLoading(false);
  }, [initialLocation, onLocationChange]);

  return (
    <View style={StyleSheet.absoluteFillObject} className="bg-gray-100 items-center justify-center">
      {loading ? (
        <ActivityIndicator size="large" color="#26C6DA" />
      ) : (
        <View className="items-center">
          <Ionicons name="map-outline" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-gray-600 text-center px-8">
            Map view not available on web.{"\n"}
            Use search or &quot;Use My Location&quot; button.
          </Text>
          <View className="mt-6 p-4 bg-white rounded-lg shadow">
            <Text className="text-sm text-gray-700">
              Selected coordinates:
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
