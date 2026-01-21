"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, ArrowRight, Sparkles, X, ChevronRight, Info, ShoppingBag, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type MenuItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category_id?: string;
};

type CartItem = MenuItem & { quantity: number; notes?: string };

export function RestaurantApp({
    restaurant,
    menuItems: initialMenuItems,
    categories: initialCategories
}: {
    restaurant: any,
    menuItems: MenuItem[],
    categories: any[]
}) {
    const supabase = createClient();
    const [currentRestaurant] = useState(restaurant);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");

    // --- DATA PREP ---
    const menuItemsByCategory = useMemo(() => {
        const filtered = searchQuery.trim()
            ? initialMenuItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            : initialMenuItems;

        type MenuItemGroup = {
            id: string;
            name: string;
            items: MenuItem[];
            sort_order?: number;
        }

        const groups: MenuItemGroup[] = initialCategories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order,
            items: filtered.filter(item => item.category_id === cat.id)
        })).filter((group: MenuItemGroup) => group.items.length > 0);

        // Handle Uncategorized
        const uncategorizedItems = filtered.filter(item => !item.category_id || !initialCategories.find(c => c.id === item.category_id));
        if (uncategorizedItems.length > 0) {
            groups.unshift({
                id: 'general',
                name: 'Featured',
                sort_order: -1,
                items: uncategorizedItems
            });
        }
        return groups;
    }, [initialMenuItems, initialCategories, searchQuery]);

    // Initialize active category
    useEffect(() => {
        if (!activeCategory && menuItemsByCategory.length > 0) {
            setActiveCategory(menuItemsByCategory[0].id);
        }
    }, [menuItemsByCategory, activeCategory]);

    const currencyCode = currentRestaurant.currency || 'USD';
    const currencySymbol = currencyCode === 'QAR' ? 'QR' : currencyCode === 'MAD' ? 'DH' : '$';

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [orderNotes, setOrderNotes] = useState("");

    const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

    useEffect(() => {
        const primaryHex = currentRestaurant.primary_color || '#ea580c';
        document.documentElement.style.setProperty('--primary', primaryHex);
        // Force light mode colors for themes
        const root = document.documentElement;
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '240 10% 3.9%');
    }, [currentRestaurant]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = 280;
            let current = activeCategory;
            for (const group of menuItemsByCategory) {
                const el = categoryRefs.current[group.id];
                if (el && el.getBoundingClientRect().top <= offset) {
                    current = group.id;
                }
            }
            setActiveCategory(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuItemsByCategory, activeCategory]);

    const scrollToCategory = (id: string) => {
        setActiveCategory(id);
        const el = categoryRefs.current[id];
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 220;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const addToCart = (item: MenuItem, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            return [...prev, { ...item, quantity }];
        });
        toast.custom((t) => (
            <div className="bg-zinc-900 text-white border border-zinc-800 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[300px]">
                <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce-short"><ShoppingCart className="w-4 h-4" /></div>
                <div className="flex-1">
                    <p className="font-bold text-sm">Added to Order</p>
                    <p className="text-zinc-400 text-xs">{item.name}</p>
                </div>
            </div>
        ), { duration: 1500 });
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
    };

    const placeOrder = async () => {
        if (!customerName.trim()) { toast.error("👋 Tell us your name!"); return; }
        setLoading(true);
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        try {
            const { data: order, error } = await supabase.from('orders').insert({
                restaurant_id: currentRestaurant.id, status: 'pending', total_amount: total,
                customer_name: customerName, table_number: tableNumber, notes: orderNotes,
            }).select().single();
            if (error) throw error;
            await supabase.from('order_items').insert(cart.map(item => ({
                restaurant_id: currentRestaurant.id, order_id: order.id, menu_item_id: item.id,
                quantity: item.quantity, price_at_time: item.price
            })));
            setCart([]); setIsCartOpen(false); setCustomerName(""); setTableNumber(""); setOrderNotes("");
            toast.success("Order Placed! Enjoy your meal.");
        } catch (e) { toast.error("Error placing order."); } finally { setLoading(false); }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-zinc-900 font-sans selection:bg-primary/20 pb-40">

            {/* --- HERO HEADER (BASED ON SCREENSHOT) --- */}
            <div className="relative h-[35vh] w-full overflow-hidden bg-zinc-200">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
                    {currentRestaurant.banner_url ? (
                        <img src={currentRestaurant.banner_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400" />
                    )}
                </motion.div>

                {/* Overlapping Info Card */}
                <div className="absolute -bottom-1 left-0 right-0 z-20">
                    <div className="max-w-lg mx-auto relative px-4">
                        <div className="bg-white rounded-t-[2.5rem] pt-6 pb-4 px-6 flex items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-b border-zinc-100">
                            {/* Overlapping Circular Logo */}
                            <div className="relative -mt-20 sm:-mt-24">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1 shadow-xl ring-8 ring-white overflow-hidden border border-zinc-200">
                                    {currentRestaurant.logo_url ? (
                                        <img src={currentRestaurant.logo_url} className="w-full h-full object-cover rounded-full" alt="Logo" />
                                    ) : (
                                        <div className="w-full h-full bg-primary flex items-center justify-center text-4xl font-black text-white rounded-full">
                                            {currentRestaurant.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 mt-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none truncate">
                                        {currentRestaurant.name}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2 mt-2 bg-zinc-50 self-start px-3 py-1.5 rounded-2xl w-fit cursor-pointer hover:bg-zinc-100 transition-colors">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-500 truncate uppercase tracking-wider">
                                        {currentRestaurant.address?.split(',')[0] || "Select Branch"}
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NAVIGATION & SEARCH --- */}
            <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-zinc-50">
                <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
                    {/* Search Bar matching screenshot */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un produit..."
                            className="bg-[#F3F4F6] border-zinc-200 h-12 rounded-2xl pl-11 text-sm font-medium focus:ring-primary/20 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Horizontal Rounded Categories */}
                    <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 snap-x">
                        {menuItemsByCategory.map(group => (
                            <button
                                key={group.id}
                                onClick={() => scrollToCategory(group.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shrink-0 border-2 snap-start",
                                    activeCategory === group.id
                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                                        : "bg-white border-zinc-300 text-zinc-500 hover:border-zinc-400"
                                )}
                            >
                                {group.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- PRIMARY CONTENT FEED --- */}
            <main className="max-w-lg mx-auto px-4 py-8 space-y-12 min-h-[60vh]">
                {menuItemsByCategory.length > 0 ? menuItemsByCategory.map((group) => (
                    <section key={group.id} ref={el => { categoryRefs.current[group.id] = el }} className="scroll-mt-40">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1.5 w-10 bg-primary rounded-full" />
                            <h2 className="text-lg font-black tracking-tight text-zinc-900 uppercase">{group.name}</h2>
                            <div className="flex-1 h-px bg-zinc-100" />
                            <span className="text-[10px] font-bold text-zinc-300 bg-zinc-100/50 px-2 py-1 rounded-md">
                                {group.items.length} {group.items.length > 1 ? 'PLATS' : 'PLAT'}
                            </span>
                        </div>

                        {/* 2-Column Grid (From Screenshot) */}
                        <div className="grid grid-cols-2 gap-4">
                            {group.items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    onClick={() => setSelectedItem(item)}
                                    className="group bg-white rounded-[2rem] border border-zinc-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-zinc-300/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                                >
                                    {/* Product Image Square */}
                                    <div className="aspect-square w-full relative overflow-hidden bg-zinc-100">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-10 h-10 text-zinc-300" /></div>
                                        )}

                                        {/* Promo Tag (Simulated like screenshot) */}
                                        {i % 3 === 0 && (
                                            <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                                                -15%
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <div>
                                            <h3 className="font-black text-[13px] text-zinc-900 leading-tight uppercase line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                                                {item.description || "The original taste you love, freshly prepared and delivered hot."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-primary font-mono tracking-tighter">
                                                    {currencySymbol}{item.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Signature Plus Button (Orange Circle from screenshot) */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Plus className="w-5 h-5 stroke-[3px]" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )) : (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                            <Search className="w-9 h-9" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-800">No results found</h3>
                        <p className="text-sm text-zinc-500 mt-1 max-w-[200px] mx-auto">We couldn't find what you're looking for.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary font-bold">Clear search</Button>
                    </div>
                )}
            </main>

            {/* --- FLOATING CART (Refined Floating Island) --- */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
                        <button onClick={() => setIsCartOpen(true)} className="pointer-events-auto w-full max-w-sm bg-zinc-900 text-white p-3 rounded-[3rem] shadow-2xl flex items-center gap-4 transition-transform active:scale-95 ring-4 ring-white">
                            <div className="bg-white text-black font-black w-12 h-12 rounded-full flex items-center justify-center shadow-inner shrink-0 scale-105">
                                <motion.span key={cartCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>{cartCount}</motion.span>
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Total Order</p>
                                <p className="text-xl font-bold font-mono tracking-tighter truncate">{currencySymbol}{cartTotal.toFixed(2)}</p>
                            </div>
                            <div className="bg-primary text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <span>Check</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CART SHEET --- */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="bottom" className="h-[92vh] rounded-t-[3rem] p-0 border-t-0 bg-white outline-none overflow-hidden [&>button]:hidden">
                    <div className="h-full flex flex-col relative w-full max-w-lg mx-auto">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-200 rounded-full z-20" />

                        <div className="p-8 pb-6 bg-white border-b border-zinc-100 flex items-end justify-between">
                            <div>
                                <SheetTitle className="text-4xl font-black text-zinc-900 tracking-tighter">Your Basket</SheetTitle>
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ready for checkout</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full h-10 w-10 bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm hover:bg-zinc-200 transition-all"><X className="w-5 h-5" /></Button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 space-y-4 py-8 bg-[#FBFBFC]">
                            {cart.map(item => (
                                <motion.div layout key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                                    <div className="w-20 h-20 bg-zinc-100 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                                        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-zinc-900 text-sm truncate uppercase pr-4">{item.name}</h4>
                                            <span className="font-bold text-zinc-900 text-sm whitespace-nowrap">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-2xl px-2 py-1.5">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl text-lg shadow-sm hover:translate-y-px transition-all">-</button>
                                                <span className="font-black w-5 text-center text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-zinc-900 text-white rounded-xl text-lg shadow-sm hover:-translate-y-px transition-all">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-8 bg-white border-t border-zinc-100 space-y-5 shadow-[0_-20px_60px_rgba(0,0,0,0.02)]">
                            <div className="space-y-3">
                                <Input placeholder="Delivery Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-16 rounded-[2rem] bg-zinc-50 border-transparent px-8 text-lg placeholder:text-zinc-400 font-medium" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="Table/Pos" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="h-14 rounded-[1.5rem] bg-zinc-50 border-transparent px-6" />
                                    <Input placeholder="Instructions" value={orderNotes} onChange={e => setOrderNotes(e.target.value)} className="h-14 rounded-[1.5rem] bg-zinc-50 border-transparent px-6" />
                                </div>
                            </div>
                            <Button onClick={placeOrder} disabled={loading || cart.length === 0} className="w-full h-20 rounded-[2.5rem] text-xl font-black bg-primary text-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between px-10 shadow-2xl shadow-primary/30">
                                <span className="uppercase tracking-tighter">Confirm Order</span>
                                <div className="border-l border-white/20 pl-8 font-mono">{currencySymbol}{cartTotal.toFixed(2)}</div>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* --- DETAIL SCREEN --- */}
            <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-[3.5rem] p-0 border-t-0 bg-white shadow-none outline-none overflow-hidden [&>button]:hidden">
                    {selectedItem && (
                        <div className="h-full flex flex-col bg-white w-full max-w-2xl mx-auto rounded-t-[3.5rem] shadow-2xl overflow-hidden">
                            <div className="relative h-[48vh] shrink-0">
                                {selectedItem.image_url ? (
                                    <img src={selectedItem.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                                <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-zinc-900 border border-zinc-200 transition-transform active:scale-90 shadow-lg z-50"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 pb-40 pt-10 relative z-10">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-100 rounded-full" />

                                <div className="flex justify-between items-start gap-6 mb-8">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none">{selectedItem.name}</h2>
                                    <span className="text-3xl font-black font-mono text-primary">{currencySymbol}{selectedItem.price.toFixed(2)}</span>
                                </div>

                                <p className="text-xl text-zinc-400 font-semibold leading-relaxed mb-12">
                                    {selectedItem.description || "The original taste you love, meticulously prepared using the finest artisanal ingredients and served fresh for your ultimate satisfaction."}
                                </p>

                                <div className="p-8 rounded-[3rem] bg-zinc-50 border border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-100 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"><Info className="w-7 h-7" /></div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-zinc-900 uppercase tracking-tighter text-lg leading-none">Custom Info</span>
                                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Add special notes</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-zinc-300" />
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-0 right-0 px-10 z-20">
                                <Button onClick={() => { addToCart(selectedItem); setSelectedItem(null); }} className="w-full h-22 rounded-[3rem] text-2xl font-black bg-zinc-900 text-white hover:scale-[1.02] shadow-2xl active:scale-95 transition-all flex items-center justify-between px-12">
                                    <span className="uppercase tracking-tighter">Add to Basket</span>
                                    <Plus className="w-8 h-8 ml-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Simple Footer */}
            <footer className="py-24 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto mb-6 flex items-center justify-center text-zinc-300">
                    <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Restau+ Ultimate Experience</p>
                <p className="text-[9px] font-bold text-zinc-200 mt-3 italic">Powered by high performance technology.</p>
            </footer>
        </div>
    );
}

