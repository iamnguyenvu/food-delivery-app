import type { Location } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude ?? 10.8231,
    longitude: initialLocation?.longitude ?? 106.6297,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [ready, setReady] = useState(false);

  // If initialLocation changes -> animate
  useEffect(() => {
    if (!initialLocation || !mapRef) return;
    const next: Region = {
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion((prev) => ({ ...prev, ...next }));
    mapRef.current?.animateToRegion(next, 400);
  }, [initialLocation]);

  const onRegionChangeComplete = (r: Region) => {
    setRegion(r);
    onLocationChange({ latitude: r.latitude, longitude: r.longitude });
  };

  return (
    <View className="flex-1">
        <MapView 
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation
            onMapReady={() => setReady(true)}
        />

        {/* Pin on center  */}
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
            <View className="mb-10">
                <Ionicons name="location" size={48} color={"#EF4444"} />
            </View>
        </View>

        {!ready && (
            <View className="absolute inset-0 bg-white items-center justify-center">
                <ActivityIndicator size={"large"} color={"#26C6DA"} />
            </View>
        )}
    </View>
  )
}
