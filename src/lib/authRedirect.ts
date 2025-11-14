import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

const CALLBACK_PATH = "/auth/callback";

const buildExpoGoRedirectUrl = () => {
  const linkingUri = Constants.linkingUri;
  if (linkingUri?.startsWith("exp://")) {
    const [base] = linkingUri.split("/--");
    if (base) {
      return `${base}/--${CALLBACK_PATH}`;
    }
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest2?.extra?.expoGo?.hostUri ??
    undefined;

  if (hostUri) {
    const normalized = hostUri.replace(/^exp:\/\//, "");
    return `exp://${normalized}/--${CALLBACK_PATH}`;
  }

  return null;
};

export const getAuthRedirectUrl = () => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}${CALLBACK_PATH}`;
  }

  if (Constants.appOwnership === "expo") {
    const expoGoUrl = buildExpoGoRedirectUrl();
    if (expoGoUrl) return expoGoUrl;
  }

  return Linking.createURL(CALLBACK_PATH);
};
