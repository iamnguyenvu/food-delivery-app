import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-primary-500 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-sm opacity-80">Deliver to</Text>
            <Text className="text-white text-lg font-bold">Your Location</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4">
        {/* Search Bar */}
        <View className="bg-white rounded-lg p-4 mb-4 flex-row items-center shadow-sm">
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <Text className="text-slate-400 ml-2">Search for restaurants or dishes</Text>
        </View>

        {/* Categories */}
        <Text className="text-lg font-bold text-slate-900 mb-3">Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <TouchableOpacity className="bg-primary-500 px-4 py-2 rounded-full mr-2">
            <Text className="text-white font-semibold">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-slate-200">
            <Text className="text-slate-700 font-semibold">Pizza</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-slate-200">
            <Text className="text-slate-700 font-semibold">Burger</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white px-4 py-2 rounded-full mr-2 border border-slate-200">
            <Text className="text-slate-700 font-semibold">Sushi</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Featured Restaurants */}
        <Text className="text-lg font-bold text-slate-900 mb-3">Popular Restaurants</Text>
        
        {/* Restaurant Card */}
        <TouchableOpacity className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden">
          <View className="bg-slate-200 h-40 items-center justify-center">
            <Ionicons name="restaurant-outline" size={48} color="#94a3b8" />
          </View>
          <View className="p-4">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-bold text-slate-900 flex-1">Delicious Restaurant</Text>
              <View className="bg-green-500 px-2 py-1 rounded">
                <Text className="text-white text-xs font-semibold">OPEN</Text>
              </View>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="star" size={16} color="#ff9800" />
              <Text className="text-slate-600 ml-1 text-sm">4.8 (250 reviews)</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text className="text-slate-600 ml-1 text-sm">20-30 min</Text>
              <Text className="text-slate-400 mx-2">•</Text>
              <Text className="text-slate-600 text-sm">Free delivery</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

