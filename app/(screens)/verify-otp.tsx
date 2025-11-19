import { router } from "expo-router";
import { useEffect } from "react";

export default function VerifyOTPScreen() {
  // Phone authentication has been removed - redirect to login
  useEffect(() => {
    router.replace("/(screens)/login" as any);
  }, []);

  return null;
}
