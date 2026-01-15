
"use client";

import { useState, use } from "react";
import { restaurants, products, categories } from "@/lib/data";
import { RestaurantHeader } from "@/components/menu/RestaurantHeader";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { ProductCard } from "@/components/menu/ProductCard";
import { TableInput } from "@/components/menu/TableInput";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

export default function MenuPage({ params }: { params: Promise<{ restaurantId: string }> }) {
    const { restaurantId } = use(params);
    const restaurant = restaurants.find((r) => r.slug === restaurantId);
    const [activeCategory, setActiveCategory] = useState("all");

    if (!restaurant) {
        // In a real app we'd fetch data. For prototype, we default to the first one if slug matches, 
        // or if not found we show 404. Let's act like we found it if slug is 'burger-co' or 'sushi-zen'.
        if (!['burger-co', 'sushi-zen'].includes(restaurantId)) return notFound();
    }

    // Fallback if not mapped correctly in mock data
    const currentRestaurant = restaurant || restaurants[0];

    const filteredProducts = activeCategory === "all"
        ? products
        : products.filter(p => p.categoryId === activeCategory);

    return (
        <>
            <TableInput />
            <RestaurantHeader restaurant={currentRestaurant} />

            {/* Hero Banner for Restaurant */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <img
                    src={currentRestaurant.image}
                    alt={currentRestaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                    <h1 className="text-3xl font-bold text-foreground drop-shadow-md">{currentRestaurant.name}</h1>
                    <p className="text-muted-foreground text-sm font-medium">{currentRestaurant.category} • {currentRestaurant.description}</p>
                </div>
            </div>

            <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No items found in this category.</p>
                    </div>
                )}
            </main>
        </>
    );
}
