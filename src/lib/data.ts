
export const restaurants = [
    {
        id: "r1",
        name: "Burger & Co.",
        slug: "burger-co",
        description: "Best burgers in town",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
        category: "Fast Food",
        tables: 12,
    },
    {
        id: "r2",
        name: "Sushi Zen",
        slug: "sushi-zen",
        description: "Authentic Japanese cuisine",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        category: "Japanese",
        tables: 8,
    },
]

export const partners = [
    {
        id: "p1",
        name: "Al Falamanki",
        type: "image",
        src: "/al-falamanki.png",
        description: "Where the charm of the past partners with the innovation of the future.",
        theme: {
            primary: "amber",
            gradient: "from-amber-200 to-amber-600",
            glow: "from-amber-500 via-red-600 to-amber-500",
            border: "border-amber-500/30"
        }
    },
    {
        id: "p2",
        name: "Kempinski",
        type: "text",
        description: "Redefining luxury hospitality with timeless elegance and modern sophistication.",
        theme: {
            primary: "white",
            gradient: "from-white via-yellow-100 to-white", // White/Gold feel
            glow: "from-white via-yellow-200 to-white",
            border: "border-white/30"
        }
    }
]

export const categories = [
    { id: "c1", name: "Popular", icon: "Star" },
    { id: "c2", name: "Burgers", icon: "Beef" },
    { id: "c3", name: "Drinks", icon: "Coffee" },
    { id: "c4", name: "Sides", icon: "Fries" },
]

export const products = [
    {
        id: "p1",
        name: "Double Cheese Smash",
        description: "Two smashed beef patties, cheddar, pickles, house sauce.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        categoryId: "c2",
        popular: true,
    },
    {
        id: "p2",
        name: "Crispy Chicken",
        description: "Fried chicken breast, coleslaw, spicy mayo.",
        price: 10.50,
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&q=80",
        categoryId: "c2",
        popular: false,
    },
    {
        id: "p3",
        name: "Truffle Fries",
        description: "Crispy fries with parmesan and truffle oil.",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80",
        categoryId: "c4",
        popular: true,
    },
    {
        id: "p4",
        name: "Vanilla Shake",
        description: "Real vanilla bean ice cream shake.",
        price: 5.50,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
        categoryId: "c3",
        popular: false,
    },
]

export const stats = {
    totalOrders: 124,
    revenue: 3450.50,
    activeTables: 5,
}

export const orders = [
    { id: "o1", table: 4, items: ["Double Cheese Smash", "Coke"], status: "preparing", total: 15.99, time: "10 mins ago" },
    { id: "o2", table: 2, items: ["Sushi Platter"], status: "served", total: 24.50, time: "35 mins ago" },
    { id: "o3", table: 7, items: ["Truffle Fries", "Vanilla Shake"], status: "pending", total: 11.50, time: "2 mins ago" },
]
