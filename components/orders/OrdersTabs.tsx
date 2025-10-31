import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import EmptyTabView from "./EmptyTabView";
import OrderCard from "./OrderCard";
import { Dish, Order, ordersMockData } from "./OrderTypeAndMock";
import SuggestionSection from "./SuggestionSection";
import { supabase } from "@/src/lib/supabase";

export default function OrdersTabs({ activeTab }: { activeTab: string }) {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);

    const fetchData = async (tab: string) => {
        setLoading(true);

        let statusList: string[] = [];

        if (tab === "Đang đến") {
            statusList = [
                "pending",
                "preparing",
                "ready_for_pickup",
                "delivering"
            ];
        }

        if (tab === "Deal đã mua") {
            statusList = ["delivered"];
        }

        if (tab === "Lịch sử") {
            statusList = ["delivered", "cancelled"];
        }

        if (tab === "Đánh giá") {
            statusList = ["delivered"];
        }

        if (tab === "Đơn nháp") {
            statusList = ["draft"];
        }

        //    mock order data
        setTimeout(() => {
            setOrders(
                ordersMockData.filter(o =>
                    statusList.includes(o.status)
                )
            );
            setLoading(false);
        }, 350);

           // get data for supabase
        /*
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .in("status", statusList)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setOrders(
                data.map(o => ({
                    ...o,
                    created_at: new Date(o.created_at),
                    estimated_delivery: new Date(o.estimated_delivery),
                    delivered_at: o.delivered_at ? new Date(o.delivered_at) : undefined,
                    cancelled_at: o.cancelled_at ? new Date(o.cancelled_at) : undefined,
                    reviewed_at: o.reviewed_at ? new Date(o.reviewed_at) : undefined,
                }))
            );
        } else {
            setOrders([]);
        }

        setLoading(false);
        */
    };

    const fetchSuggestedDishes = async () => {
        const { data, error } = await supabase
            .from("dishes")
            .select("*")
            .eq("is_available", true)
            .order("created_at", { ascending: false });

        if (!error && data) {
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setDishes(shuffled.slice(0, 5));
        }
    };

    useEffect(() => {
        fetchData(activeTab);
        if (activeTab === "Đang đến") fetchSuggestedDishes();
    }, [activeTab]);

    return (
        <ScrollView className="flex-1 px-4 mt-0">
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    {orders.length > 0
                        ? orders.map(item => <OrderCard key={item.id} order={item} />)
                        : <EmptyTabView />}

                    {activeTab === "Đang đến" && dishes.length > 0 && (
                        <SuggestionSection dishes={dishes} />
                    )}
                </>
            )}
        </ScrollView>
    );
}
