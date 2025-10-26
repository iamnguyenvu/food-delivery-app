import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const isPhoneValid = phone.length === 10 && /^\d+$/.test(phone);
  const canContinue = showPasswordInput
    ? isPhoneValid && password.length >= 6
    : isPhoneValid;

  const handleContinue = () => {
    if (!canContinue) return;

    if (showPasswordInput) {
      // Login with password
      handleLoginWithPassword();
    } else {
      // Send OTP
      router.push({
        pathname: "/verify-otp",
        params: { phone },
      } as any);
    }
  };

  const handleLoginWithPassword = async () => {
    // Implement later password login
    console.log("Login with password:", { phone, password });
  };

  const handleGoogleLogin = async () => {
    // Implement later Google OAuth
    console.log("Login with Google");
  };

  const handleGithubLogin = async () => {
    // Implement later Github OAuth
    console.log("Login with Github");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-2 pt-3 pb-2 border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#26C6DA" />
          </Pressable>

          <Text className="text-lg font-semibold">Đăng nhập / Đăng ký</Text>
        </View>

        <Pressable
          onPress={() => router.push("/(screens)/help-center" as any)}
          className="p-2"
        >
          <Ionicons name="help-circle-outline" size={24} color="#26C6DA" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* App Icon */}
          <View className="items-center mt-12 mb-8">
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              className="w-24 h-24 rounded-3xl"
              style={{ width: 96, height: 96 }}
            />
          </View>

          {/* Form */}
          <View className="px-6">
            {/* Phone Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Số điện thoại
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-4 py-1 bg-gray-50">
                <Ionicons
                  name={showPasswordInput ? "person-outline" : "call-outline"}
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  className="flex-1 ml-3 text-sm"
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
                {phone.length > 0 && (
                  <Pressable onPress={() => setPhone("")}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Password Input (conditional) */}
            {showPasswordInput && (
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Mật khẩu</Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-4 py-1 bg-gray-50">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-sm"
                    placeholder="Nhập mật khẩu"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>
            )}

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!canContinue}
              className={`py-4 rounded-md items-center mb-3 ${
                canContinue ? "bg-primary-400" : "bg-gray-300"
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  canContinue ? "text-white" : "text-gray-500"
                }`}
              >
                Tiếp tục
              </Text>
            </Pressable>

            {/* Toggle Password Login */}
            <Pressable
              onPress={() => setShowPasswordInput(!showPasswordInput)}
              className="items-center py-2"
            >
              <Text className="text-primary-400 font-medium">
                {showPasswordInput ? "Dùng mã OTP" : "Dùng mật khẩu"}
              </Text>
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">hoặc</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="gap-3">
              {/* Google */}
              <Pressable
                onPress={handleGoogleLogin}
                className="flex-row items-center justify-center border border-gray-300 rounded-md py-3 bg-white active:bg-gray-50"
              >
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text className="ml-3 font-medium text-gray-700 text-base">
                  Đăng nhập bằng Google
                </Text>
              </Pressable>

              {/* Github */}
              <Pressable
                onPress={handleGithubLogin}
                className="flex-row items-center justify-center border border-gray-300 rounded-md py-3 bg-white active:bg-gray-50"
              >
                <Ionicons name="logo-github" size={20} color="black" />
                <Text className="ml-3 font-medium text-gray-700 text-base">
                  Đăng nhập bằng Github
                </Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text className="text-xs text-gray-500 text-center mt-8 px-4">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <Text className="text-primary-400">Điều khoản sử dụng</Text> và{" "}
              <Text className="text-primary-400">Chính sách bảo mật</Text> của
              chúng tôi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
