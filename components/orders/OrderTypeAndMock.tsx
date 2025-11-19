// Type: Item in the order
export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    thumbnail: string;
    note?: string;
}

// Type: Order
export interface Order {
    id: string;
    order_number: string;

    restaurant_id: string;
    restaurant_name: string;
    restaurant_thumbnail: string;

    items: OrderItem[];

    subtotal: number;
    delivery_fee: number;
    service_fee: number;
    discount: number;
    total: number;

    delivery_address: {
        street: string;
        ward: string;
        district: string;
        city: string;
    };

    delivery_phone: string;
    delivery_notes?: string;

    status:
        | "pending"
        | "preparing"
        | "ready_for_pickup"
        | "delivering"
        | "delivered"
        | "cancelled";

    estimated_delivery: Date;
    created_at: Date;
    delivered_at?: Date;
    cancelled_at?: Date;
    cancellation_reason?: string;

    payment_method: "cash" | "momo" | "vnpay" | "zalopay";
    payment_status: "paid" | "unpaid" | "refunded";

    rating?: number;
    review?: string;
    reviewed_at?: Date;
}

// Type: Dish
export interface Dish {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    review_count: number;
    sold_count: number;
    is_available: boolean;
    restaurant_id: string;
    restaurant_name: string;
    created_at: string;
}


// Mock Data for Orders
export const ordersMockData: Order[] = [
    {
        id: "O-439821",
        order_number: "GF-439821",
        restaurant_id: "R001",
        restaurant_name: "Cơm Tấm Sườn Que",
        restaurant_thumbnail: "https://tse3.mm.bing.net/th/id/OIP.83SNN0Lr0Peq5dxziAfHfgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
        items: [
            {
                name: "Cơm tấm sườn bì chả",
                quantity: 1,
                price: 45000,
                thumbnail: "https://i.imgur.com/ZyA9Nho.jpeg",
                note: "Ít mỡ"
            },
            {
                name: "Trứng ốp la",
                quantity: 1,
                price: 7000,
                thumbnail: "https://i.imgur.com/ZyA9Nho.jpeg"
            }
        ],
        subtotal: 52000,
        delivery_fee: 12000,
        service_fee: 2000,
        discount: 5000,
        total: 61000,

        delivery_address: {
            street: "22 Nguyễn Văn Bảo",
            ward: "P.4",
            district: "Gò Vấp",
            city: "TPHCM"
        },

        delivery_phone: "0911223344",
        delivery_notes: "Gọi trước khi tới",

        status: "delivering",

        estimated_delivery: new Date(Date.now() + 25 * 60000),
        created_at: new Date(Date.now() - 5 * 60000),

        payment_method: "momo",
        payment_status: "paid"
    },

    {
        id: "O-439710",
        order_number: "GF-439710",
        restaurant_id: "R002",
        restaurant_name: "Trà Sữa Tocotoco",
        restaurant_thumbnail: "https://neohouse.vn/wp-content/uploads/2018/05/tocotoco-1.jpg",
        items: [
            {
                name: "Trà sữa trân châu đường đen",
                quantity: 1,
                price: 32000,
                thumbnail: "https://i.imgur.com/H1vjE2V.jpeg"
            }
        ],

        subtotal: 32000,
        delivery_fee: 10000,
        service_fee: 2000,
        discount: 0,
        total: 44000,

        delivery_address: {
            street: "15 Lê Đức Thọ",
            ward: "P.7",
            district: "Gò Vấp",
            city: "TPHCM"
        },

        delivery_phone: "0911223344",

        status: "delivered",

        estimated_delivery: new Date(Date.now() - 20 * 60000),
        created_at: new Date(Date.now() - 60 * 60000),
        delivered_at: new Date(Date.now() - 20 * 60000),

        payment_method: "cash",
        payment_status: "unpaid",

        rating: 5,
        review: "Rất vừa miệng!",
        reviewed_at: new Date(Date.now() - 15 * 60000)
    },

    {
        id: "O-438210",
        order_number: "GF-438210",
        restaurant_id: "R003",
        restaurant_name: "Bún Chả Hà Nội",
        restaurant_thumbnail: "https://i.etsystatic.com/31467946/r/il/79277e/4568857628/il_1080xN.4568857628_9m42.jpg",
        items: [
            {
                name: "Bún chả phần đặc biệt",
                quantity: 1,
                price: 40000,
                thumbnail: "https://i.imgur.com/gtBqoNL.jpeg"
            }
        ],

        subtotal: 40000,
        delivery_fee: 12000,
        service_fee: 2000,
        discount: 0,
        total: 54000,

        delivery_address: {
            street: "10 Nguyễn Kiệm",
            ward: "P.3",
            district: "Gò Vấp",
            city: "TPHCM"
        },

        delivery_phone: "0911223344",

        status: "cancelled",

        estimated_delivery: new Date(Date.now() - 60 * 60000),
        created_at: new Date(Date.now() - 90 * 60000),
        cancelled_at: new Date(Date.now() - 85 * 60000),
        cancellation_reason: "Nhà hàng quá tải",

        payment_method: "vnpay",
        payment_status: "refunded"
    },
    {
        id: "O-437500",
        order_number: "GF-437500",
        restaurant_id: "R004",
        restaurant_name: "Pizza Hut",
        restaurant_thumbnail: "https://th.bing.com/th/id/R.f72283f2350081b235657f8f4438439c?rik=RK59iYE3azXY0Q&pid=ImgRaw&r=0",
        items: [
            {
                name: "Pizza Hải Sản Phô Mai",
                quantity: 1,
                price: 89000,
                thumbnail: "https://th.bing.com/th/id/R.f72283f2350081b235657f8f4438439c?rik=RK59iYE3azXY0Q&pid=ImgRaw&r=0"
            }
        ],

        subtotal: 89000,
        delivery_fee: 15000,
        service_fee: 3000,
        discount: 10000,
        total: 97000,

        delivery_address: {
            street: "50 Nguyễn Văn Lượng",
            ward: "P.6",
            district: "Gò Vấp",
            city: "TPHCM"
        },

        delivery_phone: "0911223344",
        delivery_notes: "Thêm sốt cà",

        status: "delivered",

        estimated_delivery: new Date(Date.now() - 40 * 60000),
        created_at: new Date(Date.now() - 120 * 60000),
        delivered_at: new Date(Date.now() - 40 * 60000),

        payment_method: "momo",
        payment_status: "paid"
    }

];