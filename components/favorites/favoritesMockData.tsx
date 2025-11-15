export interface FavoriteItem {
    id: string;
    user_id: string;
    restaurant_id: string;
    dish_id: string;
    dish_name: string;
    restaurant_name: string;
    dish_image: string;
    distance: string;
    rating: number;
    created_at: Date;
}

export const favoritesMockData: FavoriteItem[] = [
    {
        id: "F-111",
        user_id: "U001",
        restaurant_id: "R001",
        dish_id: "D001",
        dish_name: "Cơm Tấm Sườn Bì Chả",
        restaurant_name: "Cơm Tấm Sườn Que",
        dish_image: "https://bing.com/th?id=OSK.62a35a2328f0db14aafc5aba477e4319",
        distance: "1.2 km",
        rating: 4.6,
        created_at: new Date(Date.now() - 10 * 60000),
    },
    {
        id: "F-222",
        user_id: "U001",
        restaurant_id: "R002",
        dish_id: "D010",
        dish_name: "Trà Sữa Trân Châu",
        restaurant_name: "Tocotoco",
        dish_image: "https://bing.com/th?id=OSK.725cb9ba1646b656a37a85737c0904bf",
        distance: "0.8 km",
        rating: 4.8,
        created_at: new Date(Date.now() - 50 * 60000),
    },
    {
        id: "F-333",
        user_id: "U001",
        restaurant_id: "R003",
        dish_id: "D020",
        dish_name: "Bún Chả Đặc Biệt",
        restaurant_name: "Bún Chả Hà Nội",
        dish_image: "https://marcwiner.com/wp-content/uploads/2024/05/Bun-Cha-en-tete.webp",
        distance: "1.0 km",
        rating: 4.5,
        created_at: new Date(Date.now() - 90 * 60000),
    },
];
