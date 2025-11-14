import * as Linking from "expo-linking";
import { Platform } from "react-native";

const CALLBACK_PATH = "/auth/callback";

export const getAuthRedirectUrl = () => {
  // For web
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${CALLBACK_PATH}`;
  }

  // For mobile - use custom scheme that works with Supabase
  // This will be: fooddelivery://auth/callback
  return Linking.createURL(CALLBACK_PATH, { scheme: "fooddelivery" });
};
