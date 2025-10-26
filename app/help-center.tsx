import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ_ITEMS = [
  {
    id: "1",
    question: "Làm sao để đăng nhập?",
    answer:
      "Nhập số điện thoại và nhấn 'Tiếp tục'. Bạn sẽ nhận được mã OTP qua SMS để xác minh.",
  },
  {
    id: "2",
    question: "Không nhận được mã OTP?",
    answer:
      "Kiểm tra kết nối mạng và đảm bảo số điện thoại chính xác. Bạn có thể yêu cầu gửi lại mã sau 60 giây.",
  },
  {
    id: "3",
    question: "Làm sao để đặt hàng?",
    answer:
      "Chọn nhà hàng, thêm món ăn vào giỏ, nhập địa chỉ giao hàng và xác nhận đơn hàng.",
  },
  {
    id: "4",
    question: "Thời gian giao hàng là bao lâu?",
    answer:
      "Thời gian giao hàng tùy thuộc vào khoảng cách và nhà hàng, thường từ 20-45 phút.",
  },
  {
    id: "5",
    question: "Các phương thức thanh toán?",
    answer:
      "Chúng tôi chấp nhận thanh toán tiền mặt, thẻ tín dụng, MoMo, ZaloPay và chuyển khoản ngân hàng.",
  },
];

export default function HelpCenterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-lg font-semibold">Trung tâm trợ giúp</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Contact Section */}
        <View className="p-4 bg-primary-50 m-4 rounded-lg">
          <View className="flex-row items-center mb-2">
            <Ionicons name="headset" size={24} color="#26C6DA" />
            <Text className="ml-2 font-semibold text-lg">
              Cần hỗ trợ thêm?
            </Text>
          </View>
          <Text className="text-gray-600 mb-3">
            Liên hệ với chúng tôi qua hotline hoặc email
          </Text>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 bg-primary-400 py-3 rounded-lg items-center">
              <View className="flex-row items-center">
                <Ionicons name="call" size={16} color="white" />
                <Text className="ml-2 text-white font-medium">
                  1900 1234
                </Text>
              </View>
            </Pressable>

            <Pressable className="flex-1 bg-white border border-primary-400 py-3 rounded-lg items-center">
              <View className="flex-row items-center">
                <Ionicons name="mail" size={16} color="#26C6DA" />
                <Text className="ml-2 text-primary-400 font-medium">
                  Email
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-4 py-2">
          <Text className="text-lg font-bold mb-3">Câu hỏi thường gặp</Text>

          {FAQ_ITEMS.map((item) => (
            <View key={item.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Text className="font-semibold text-gray-900 mb-2">
                {item.question}
              </Text>
              <Text className="text-gray-600 text-sm">{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Additional Help */}
        <View className="px-4 py-6">
          <Text className="text-center text-gray-500 text-sm mb-4">
            Bạn không tìm thấy câu trả lời?
          </Text>

          <Pressable className="border border-primary-400 py-3 rounded-lg items-center">
            <Text className="text-primary-400 font-medium">
              Gửi yêu cầu hỗ trợ
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
