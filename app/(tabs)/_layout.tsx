import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from '@/constants/Colors';
import { useTheme } from '@react-navigation/native';


const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; title: string }> = {
  index: { on: "home", off: "home-outline", title: "Home" },
  orders: { on: "receipt", off: "receipt-outline", title: "My Order" },
  favorites: { on: "heart", off: "heart-outline", title: "Favorites" },
  notifications: { on: "mail", off: "mail-outline", title: "Inbox", },
  profile: { on: "person", off: "person-outline", title: "Account" },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({route}) => {
        const cfg = ICONS[route.name] ?? {on: "ellipse", off: "ellipse-outline", title: route.name}
        return {
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tint,
          // tabBarBackground: Colors.light.background,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          tabBarIcon: ({color, size, focused}) => {
            return <Ionicons name={(focused ? cfg.on : cfg.off) as any} size={size} color={color} />
          },
          tabBarLabel: cfg.title,
          tabBarStyle: {
            height: Platform.select({ ios: 68, android: 64, default: 64 }),
            // paddingBottom: Platform.select({ ios: 18, android: 10, default: 12 }),
            // paddingTop: Platform.select({ ios: 8, android: 6, default: 6 }),
            marginBottom: Platform.select({ ios: 18, android: 10, default: 12 }),
            backgroundColor: Colors.light.background ?? "#FFFFFF",
            borderWidth: 0,
            borderColor: "transparent"
          },
          tabBarHideOnKeyboard: true,
        }
      }}
    >
      <Tabs.Screen
        name="index"   
        options={{
          title: ICONS.index.title,
          headerShown: false,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <Ionicons
          //           name="information-circle-outline"
          //           size={25}
          //           color={Colors[colorScheme ?? "light"].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />

      <Tabs.Screen name="orders" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" options={{headerShown: false}}/>
    </Tabs>
  );
}
