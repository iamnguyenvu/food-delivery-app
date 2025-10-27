import { useAuth } from "@/src/contexts/AuthContext";
import { useAddresses } from "@/src/hooks/useAddresses";
import { LocationStorage } from "@/src/lib/locationStorage";
import { useLocationStore } from "@/src/store/locationStore";
import type { Location, SavedLocation } from "@/src/types/location";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoLocation from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchResult = {
  id: string;
  location: Location;
  streetAddress: string;
  fullAddress: string;
};

// Helper to format timestamp as relative time
function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return then.toLocaleDateString("vi-VN");
}

export default function AddressInputScreen() {
  const { setAll, savedAddresses: localAddresses } = useLocationStore();

  // Get current user
  const { user } = useAuth();
  const userId = user?.id;

  // Always call hook, but it won't fetch if userId is undefined
  const { addresses: dbAddresses = [], loading: dbLoading = false, saveAddress: saveToDatabase } =
    useAddresses(userId);

  // Convert SavedAddress to SavedLocation format for compatibility
  const dbAddressesConverted: SavedLocation[] = dbAddresses.map((addr) => ({
    location: addr.location,
    address: addr.address,
    timestamp: new Date().toISOString(), // Not stored in DB, use current time
  }));

  // Use database addresses if user logged in, otherwise use local storage
  const displayAddresses: SavedLocation[] = userId
    ? dbAddressesConverted
    : localAddresses;

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);

      // Check and request permission for geocoding
      const { status: existingStatus } = await ExpoLocation.getForegroundPermissionsAsync();
      
      if (existingStatus !== 'granted') {
        const { status: newStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        
        if (newStatus !== 'granted') {
          Alert.alert(
            'Cần quyền truy cập',
            'Ứng dụng cần quyền truy cập vị trí để tìm kiếm địa chỉ. Vui lòng cấp quyền trong Cài đặt.'
          );
          setSearching(false);
          return;
        }
      }

      // Forward geocode with Vietnam region preference
      const searchQuery = text.trim();
      const geocodeResults = await ExpoLocation.geocodeAsync(
        searchQuery.includes("Vietnam") || searchQuery.includes("Việt Nam")
          ? searchQuery
          : `${searchQuery}, Vietnam`
      );

      if (!geocodeResults || geocodeResults.length === 0) {
        setResults([]);
        setSearching(false);
        return;
      }

      const formatted: SearchResult[] = await Promise.all(
        geocodeResults.slice(0, 5).map(async (item, index) => {
          const { latitude, longitude } = item;

          try {
            // Reverse geocode to get full details
            const reverseResults = await ExpoLocation.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            const details = reverseResults[0];

            // Street address: number + street name
            let streetAddr = "";
            if (details?.streetNumber && details?.street) {
              streetAddr = `${details.streetNumber} ${details.street}`;
            } else if (details?.name || details?.street) {
              streetAddr = details?.name || details?.street || "";
            }

            // Full address: ward, district, city, province
            const parts = [
              details?.subregion, // Ward
              details?.district, // District
              details?.city || details?.region, // City
            ].filter(Boolean);

            return {
              id: `result-${index}`,
              location: { latitude, longitude },
              streetAddress: streetAddr || "Địa chỉ không xác định",
              fullAddress: parts.join(", ") || "Chi tiết không có",
            };
          } catch (e) {
            return {
              id: `result-${index}`,
              location: { latitude, longitude },
              streetAddress: "Vị trí không xác định",
              fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            };
          }
        })
      );

      setResults(formatted);
    } catch (e: any) {
      console.error("Search error:", e);
      Alert.alert(
        "Lỗi tìm kiếm",
        "Không thể tìm kiếm địa chỉ. Vui lòng thử lại."
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectAddress = async (item: SearchResult) => {
    const locationData = {
      location: item.location,
      address: {
        formatted: `${item.streetAddress}, ${item.fullAddress}`,
        street: item.streetAddress,
      },
    }

    // Update current location
    setAll(locationData);

    // Save to appropriate storage
    if(userId) {
      // Logged in: Save to database
      try {
        await saveToDatabase(
          item.location,
          locationData.address,
          "other",
          false
        )
      }
      catch (error) {
        console.error("Failed to save to database", error);
        Alert.alert("Lỗi", "Không thể lưu địa chỉ vào tài khoản")
      }
    }
    else {
      // Guest: Save to Local Storage
      try {
        await LocationStorage.saveAddress({
          location: item.location,
          address: locationData.address,
          timestamp: new Date().toISOString()
        })
      }
      catch (error) {
        console.error("Failed to save locally:", error);
      }
    }

    router.back();
  };

  const openMapPicker = () => {
    router.push("/(screens)/location-map-picker" as any);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText) {
        handleSearch(searchText);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <SafeAreaView className="flex-1 bg-primary-400" edges={["top"]}>
      {/* Header */}
      <View className="bg-primary-400 p-2">
        {/* Title row with back and map icons */}
        <View className="flex-row items-center mb-3">
          <Pressable onPress={() => router.back()} className="mr-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white flex-1">Nhập địa chỉ giao hàng</Text>
          <Pressable onPress={openMapPicker} className="ml-2">
            <Ionicons name="map" size={24} color="white" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-md px-2 h-11 mb-1">
          <Ionicons name="search" size={24} color={"#26C6DA"} />
          <TextInput 
            placeholder="Tìm kiếm địa chỉ..."
            placeholderTextColor={"#26C6DA"}
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 font-medium rounded-lg p-2 text-primary-400"
            autoFocus
            returnKeyType="search"
            multiline={false}
            scrollEnabled={false}
            textAlignVertical="center"
            numberOfLines={1}
            underlineColorAndroid={"transparent"}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#26C6DA" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 bg-white">
        {searching && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#26C6DA" />
            <Text className="mt-2 text-gray-500">Đang tìm kiếm...</Text>
          </View>
        )}

        {!searching && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectAddress(item)}
                className="flex-row items-center px-4 py-4 border-b border-gray-100 active:bg-gray-50"
              >
                <View className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-3">
                  <Ionicons name="location" size={20} color="#26C6DA" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {item.streetAddress}
                  </Text>
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {item.fullAddress}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            )}
          />
        )}

        {!searching && searchText && results.length === 0 && (
          <View className="py-8 items-center">
            <Ionicons name="search-outline" size={48} color="#D1D5DB" />
            <Text className="mt-2 text-gray-500">Không tìm thấy địa chỉ</Text>
          </View>
        )}

        {!searching && !searchText && (
          <View className="flex-1">
            {/* Saved Addresses Section */}
            <View className="px-2 py-3 bg-gray-50">
              <Text className="text-sm font-semibold text-gray-700">
                Địa chỉ đã lưu
              </Text>
            </View>

            {displayAddresses.length === 0 ? (
              <View className="py-8 items-center">
                <Ionicons name="bookmark-outline" size={48} color="#D1D5DB" />
                <Text className="mt-2 text-gray-500">
                  Chưa có địa chỉ đã lưu
                </Text>
                {!userId && (
                  <Text className="mt-1 text-xs text-gray-400 px-8 text-center">
                    Đăng nhập để lưu không giới hạn địa chỉ
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                data={displayAddresses}
                keyExtractor={(item, index) => `saved-${index}`}
                ListHeaderComponent={
                  !userId && displayAddresses.length > 0 ? (
                    <View className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="information-circle"
                          size={16}
                          color="#F59E0B"
                        />
                        <Text className="text-xs text-amber-700 ml-2 flex-1">
                          Chế độ khách: Tối đa 5 địa chỉ. Đăng nhập để lưu không
                          giới hạn.
                        </Text>
                      </View>
                    </View>
                  ) : null
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setAll({
                        location: item.location,
                        address: item.address,
                      });
                      router.back();
                    }}
                    className="bg-white mx-3 my-2 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"
                  >
                    <View className="flex-row items-start p-4">
                      <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center">
                        <Ionicons
                          name={userId ? "cloud" : "phone-portrait"}
                          size={24}
                          color="#26C6DA"
                        />
                      </View>
                      <View className="flex-1 ml-3">
                        <View className="flex-row items-center mb-1">
                          <Ionicons
                            name="bookmark"
                            size={14}
                            color="#10B981"
                            style={{ marginRight: 4 }}
                          />
                          <Text className="text-sm font-semibold text-primary-500">
                            {userId ? "Đã lưu trên cloud" : "Lưu trên thiết bị"}
                          </Text>
                        </View>
                        <Text className="text-base font-bold text-gray-900 mb-1">
                          {item.address.street || "Địa chỉ"}
                        </Text>
                        <Text
                          className="text-sm text-gray-600"
                          numberOfLines={2}
                        >
                          {item.address.formatted}
                        </Text>
                        {item.timestamp && (
                          <Text className="text-xs text-gray-400 mt-2">
                            {getRelativeTime(item.timestamp)}
                          </Text>
                        )}
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
