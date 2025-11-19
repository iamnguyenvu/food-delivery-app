import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { Platform } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from '@/constants/Colors';
import { useLanguage } from '@/src/hooks/useLanguage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; title: {vi: string, en: string} }> = {
  index: { on: "home", off: "home-outline", title: {vi: "Trang chủ", en: "Home"} },
  orders: { on: "receipt", off: "receipt-outline", title: {vi: "Đơn hàng", en: "My Order"} },
  favorites: { on: "heart", off: "heart-outline", title: { vi: "Yêu thích",   en: "Favorites" }},
  notifications: { on: "mail", off: "mail-outline", title: { vi: "Thông báo",   en: "Notifications" }},
  profile: { on: "person", off: "person-outline", title: { vi: "Tài khoản",   en: "Account" }},
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {lang} = useLanguage();
  const insets = useSafeAreaInsets();

  const baseHeight = useMemo(
    () => Platform.select({ ios: 56, android: 56, default: 56 })!,
    []
  );

  return (
    <Tabs
      screenOptions={({route}) => {
        const cfg = ICONS[route.name] ?? {on: "ellipse", off: "ellipse-outline", title: {vi: route.name, en: route.name}}
        return {
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarIcon: ({color, size, focused}) => {
            return <Ionicons name={(focused ? cfg.on : cfg.off) as any} size={size} color={color} />
          },
          tabBarLabel: cfg.title[lang],
          tabBarStyle: {
            height: baseHeight + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 6,
            backgroundColor: Colors.light.background ?? "#FFFFFF",
            borderWidth: 0,
            borderColor: "transparent",
            elevation: 12
          },
          tabBarHideOnKeyboard: true,
        }
      }}
    >
      <Tabs.Screen
        name="index"   
        options={{
          title: ICONS.index.title[lang],
          headerShown: false,
        }}
      />

      <Tabs.Screen name="orders" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
