import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

type HeaderProps = {
    location: string;

}

export default function Header() {
    return (
        <View className="flex-1 bg-primary-300 h-6 p-4">
            <View>
                <Ionicons name="location-outline" size={24} />
                <Text></Text>
            </View>
            <TextInput placeholder="Search" className="rounded-lg bg-white p-2" />
        </View>
    )
}