import { Platform } from "react-native";

const CALLBACK_PATH = "auth/callback";

export const getAuthRedirectUrl = () => {
  // For web
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/${CALLBACK_PATH}`;
  }

  // For mobile - use custom scheme that works with Supabase
  // Must be registered in app.config.js scheme field
  return `fooddelivery://${CALLBACK_PATH}`;
};
