import {
    useClearSearchHistory,
    useSearch,
    useSearchHistory,
    useSearchSuggestions,
    type SearchHistory,
    type SearchSuggestion,
} from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: searchHistory = [] } = useSearchHistory(8);
  const { data: suggestions = [] } = useSearchSuggestions();
  const clearHistory = useClearSearchHistory();
  const search = useSearch();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      await search.mutateAsync({ query: searchQuery });
      // Navigate to search results page
      router.push(`/search-results?q=${encodeURIComponent(searchQuery)}` as any);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHistoryItemPress = (item: SearchHistory) => {
    setSearchQuery(item.search_query);
    handleSearch();
  };

  const handleSuggestionPress = (item: SearchSuggestion) => {
    setSearchQuery(item.title);
    handleSearch();
  };

  const handleClearHistory = () => {
    clearHistory.mutate();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-primary-300">
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          className="mr-3 p-2 -ml-2 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>

        {/* Search Input */}
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-1 py-0.5">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm món ăn, quán ăn..."
            className="flex-1 text-sm text-gray-900 ml-2"
            placeholderTextColor="#9CA3AF"
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Search Button */}
        <Pressable
          onPress={handleSearch}
          className="ml-3 p-2 bg-primary-500 rounded-md active:opacity-80"
          disabled={isSearching || !searchQuery.trim()}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color="white" 
          />
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-gray-50">
        {/* Search History */}
        {searchHistory.length > 0 && (
          <View className="bg-white mb-2">
            <View className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-lg font-bold text-gray-900">
                Lịch sử tìm kiếm
              </Text>
              <Pressable
                onPress={handleClearHistory}
                className="active:opacity-70"
              >
                <Text className="text-sm text-primary-500 font-medium">
                  Xóa tất cả
                </Text>
              </Pressable>
            </View>

            <View className="px-4 pb-4">
              {searchHistory.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleHistoryItemPress(item)}
                  className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-50"
                >
                  <Ionicons 
                    name="time-outline" 
                    size={20} 
                    color="#9CA3AF" 
                  />
                  <Text className="flex-1 ml-3 text-base text-gray-700">
                    {item.search_query}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {item.result_count} kết quả
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Search Suggestions */}
        <View className="bg-white">
          <View className="px-4 py-3">
            <Text className="text-lg font-bold text-gray-900">
              Gợi ý tìm kiếm
            </Text>
          </View>

          <SearchSuggestionGrid
            suggestions={suggestions}
            onSuggestionPress={handleSuggestionPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Search Suggestion Grid Component
function SearchSuggestionGrid({
  suggestions,
  onSuggestionPress,
}: {
  suggestions: SearchSuggestion[];
  onSuggestionPress: (suggestion: SearchSuggestion) => void;
}) {
  const renderSuggestionCard = ({ item }: { item: SearchSuggestion }) => (
    <Pressable
      onPress={() => onSuggestionPress(item)}
      className="flex-1 mx-1 mb-3 active:opacity-80"
    >
      <View className="bg-white rounded-md overflow-hidden border border-gray-200">
        {/* Image */}
        <View className="aspect-square bg-gray-100">
          <Image
            source={{ uri: item.image_url || "https://via.placeholder.com/200" }}
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Trending Badge */}
          {item.is_trending && (
            <View className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">
                Trending
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <View className="p-3">
          <Text
            className="text-sm font-semibold text-gray-900 text-center"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text
              className="text-xs text-gray-500 text-center mt-1"
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="px-4 pb-4">
      <FlatList
        data={suggestions}
        renderItem={renderSuggestionCard}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}