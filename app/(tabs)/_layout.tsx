import { Ionicons } from '@expo/vector-icons';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; title: string }> = {
  index: { on: "home", off: "home-outline", title: "Home" },
  orders: { on: "receipt", off: "receipt-outline", title: "My Order" },
  favorites: { on: "heart", off: "heart-outline", title: "Favorites" },
  notifications: { on: "mail", off: "mail-outline", title: "Inbox", },
  profile: { on: "person", off: "person-outline", title: "Account" },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({route}) => {
        const cfg = ICONS[route.name] ?? {on: "eclipse", off: "eclipse-outline", title: route.name}
        return {
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
          tabBarIcon: ({color, size, focused}) => {
            return <Ionicons name={(focused ? cfg.on : cfg.off) as any} size={size} color={color} />
          },
          tabBarLabel: cfg.title
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle-outline"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen name="orders" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" options={{headerShown: false}}/>
    </Tabs>
  );
}
