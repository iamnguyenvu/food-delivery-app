import { CartItem, useCartStore } from "@/src/store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CartModalProps {
    visible: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CART_HEIGHT = SCREEN_HEIGHT * 0.7;
const MAIN_COLOR = "#26C6DA"; // đổi thành màu app của bạn

export default function CartModal({
                                      visible,
                                      onClose,
                                      onCheckout,
                                  }: CartModalProps) {
    const items = useCartStore((s) => s.items);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const clearCart = useCartStore((s) => s.clearCart);
    const getTotalPrice = useCartStore((s) => s.getTotalPrice);

    const insets = useSafeAreaInsets();
    const total = getTotalPrice();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                {/* Background dim clickable */}
                <Pressable style={styles.overlay} onPress={onClose} />

                {/* Bottom Sheet */}
                <View
                    style={[
                        styles.sheet,
                        { paddingBottom: Math.max(16, insets.bottom + 10) },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={clearCart}>
                            <Text style={[styles.clearAll, { color: MAIN_COLOR }]}>Xóa tất cả</Text>
                        </Pressable>

                        <Text style={styles.title}>Giỏ hàng</Text>

                        <Pressable style={styles.closeBtn} onPress={onClose}>
                            <Ionicons name="close" size={20} color="#444" />
                        </Pressable>
                    </View>

                    {/* Items */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 18,
                            paddingBottom: 20,
                        }}
                    >
                        {items.map((item: CartItem) => (
                            <View key={item.id} style={styles.itemRow}>
                                {/* Image */}
                                <Image
                                    source={{ uri: item.dish.image }}
                                    style={styles.image}
                                />

                                {/* Info */}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.dishName}>{item.dish.name}</Text>

                                    {item.options.size && (
                                        <Text style={styles.optionText}>• Size: {item.options.size}</Text>
                                    )}

                                    {!!item.options.toppings?.length && (
                                        <Text style={styles.optionText}>
                                            • Topping: {item.options.toppings.join(", ")}
                                        </Text>
                                    )}

                                    {item.notes ? (
                                        <Text style={styles.notes}>“{item.notes}”</Text>
                                    ) : (
                                        <View style={styles.noteRow}>
                                            <Ionicons
                                                name="document-text-outline"
                                                size={14}
                                                color="#999"
                                            />
                                            <Text style={styles.noteHint}>Thêm ghi chú…</Text>
                                        </View>
                                    )}

                                    <Text style={[styles.price, { color: MAIN_COLOR }]}>
                                        {item.price.toLocaleString("vi-VN")}₫
                                    </Text>
                                </View>

                                {/* Quantity */}
                                <View style={styles.qtyGroup}>
                                    <Pressable
                                        style={styles.qtyBtn}
                                        onPress={() =>
                                            updateQuantity(item.id, item.quantity - 1)
                                        }
                                    >
                                        <Ionicons name="remove" size={16} color={MAIN_COLOR} />
                                    </Pressable>

                                    <Text style={styles.qty}>{item.quantity}</Text>

                                    <Pressable
                                        style={styles.qtyBtn}
                                        onPress={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                    >
                                        <Ionicons name="add" size={16} color={MAIN_COLOR} />
                                    </Pressable>
                                </View>
                            </View>
                        ))}

                        {items.length > 0 && (
                            <Text style={styles.disclaimer}>
                                Giá món đã bao gồm thuế, chưa gồm phí giao hàng.
                            </Text>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    {items.length > 0 && (
                        <View style={styles.footer}>
                            <Text style={[styles.total, { color: MAIN_COLOR }]}>
                                {total.toLocaleString("vi-VN")}₫
                            </Text>

                            <Pressable
                                onPress={onCheckout}
                                style={[styles.checkoutBtn, { backgroundColor: MAIN_COLOR }]}
                            >
                                <Text style={styles.checkoutText}>Giao hàng</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        height: CART_HEIGHT,
    },
    header: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    clearAll: { fontSize: 15, fontWeight: "500" },
    title: { fontSize: 18, fontWeight: "bold", color: "#333" },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 32,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
    },

    itemRow: {
        flexDirection: "row",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#f3f3f3",
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#eee",
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    dishName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    optionText: {
        fontSize: 13,
        color: "#666",
        marginTop: 3,
    },
    notes: {
        fontStyle: "italic",
        fontSize: 13,
        color: "#777",
        marginTop: 4,
    },
    noteRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    noteHint: {
        marginLeft: 4,
        fontSize: 12,
        color: "#bbb",
    },
    price: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 6,
    },

    qtyGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },
    qtyBtn: {
        width: 30,
        height: 30,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: MAIN_COLOR,
        justifyContent: "center",
        alignItems: "center",
    },
    qty: {
        marginHorizontal: 8,
        fontSize: 15,
        fontWeight: "700",
        width: 20,
        textAlign: "center",
    },

    disclaimer: {
        marginTop: 12,
        fontSize: 12,
        textAlign: "center",
        color: "#888",
    },

    footer: {
        paddingHorizontal: 18,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: "#eee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    total: { fontSize: 20, fontWeight: "900" },
    checkoutBtn: {
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 10,
    },
    checkoutText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});
