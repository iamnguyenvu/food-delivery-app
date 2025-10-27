import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const isOtpComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) return;

    const otpCode = otp.join("");
    console.log("Verify OTP:", { phone, otpCode });

    // TODO: Implement OTP verification
    // Navigate to home or complete registration
    router.replace("/(tabs)");
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;

    console.log("Resend OTP to:", phone);
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>

        <Text className="text-lg font-semibold">Xác minh OTP</Text>

        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Icon */}
          <View className="items-center mt-12 mb-8">
            <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center">
              <Ionicons name="mail-outline" size={40} color="#26C6DA" />
            </View>
          </View>

          {/* Title & Description */}
          <Text className="text-2xl font-bold text-center mb-3">
            Nhập mã xác minh
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Mã OTP đã được gửi đến số điện thoại{"\n"}
            <Text className="font-semibold text-gray-900">{phone}</Text>
          </Text>

          {/* OTP Input */}
          <View className="flex-row justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg ${
                  digit
                    ? "border-primary-400 bg-primary-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          {/* Countdown & Resend */}
          <View className="items-center mb-8">
            {countdown > 0 ? (
              <Text className="text-gray-600">
                Gửi lại mã sau{" "}
                <Text className="font-semibold text-primary-400">
                  {countdown}s
                </Text>
              </Text>
            ) : (
              <Pressable onPress={handleResendOTP}>
                <Text className="font-semibold text-primary-400">
                  Gửi lại mã OTP
                </Text>
              </Pressable>
            )}
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={!isOtpComplete}
            className={`py-4 rounded-lg items-center ${
              isOtpComplete ? "bg-primary-400" : "bg-gray-300"
            }`}
          >
            <Text
              className={`font-semibold text-base ${
                isOtpComplete ? "text-white" : "text-gray-500"
              }`}
            >
              Xác nhận
            </Text>
          </Pressable>

          {/* Help Text */}
          <Text className="text-sm text-gray-500 text-center mt-6">
            Không nhận được mã?{" "}
            <Text
              className="text-primary-400 font-medium"
              onPress={() => router.push("/(screens)/help-center" as any)}
            >
              Trung tâm trợ giúp
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
