"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

import { Plus, Search, MapPin, ArrowRight, ArrowLeft, Sparkles, X, ChevronRight, ChevronLeft, Info, ShoppingCart, Instagram, Facebook, Globe, Phone, Mail, Clock, ExternalLink, BadgeCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
    is_available: boolean;
    is_visible?: boolean;
};

type CartItem = MenuItem & {
    quantity: number;
    notes?: string;
    cartId?: string;
    selectedVariants?: { groupName: string; name: string; price: number }[];
};

export function RestaurantApp({
    restaurant,
    menuItems: initialMenuItems,
    categories: initialCategories
}: {
    restaurant: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    menuItems: MenuItem[],
    categories: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
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

        const groups: MenuItemGroup[] = initialCategories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            sort_order: cat.sort_order,
            items: filtered.filter(item => item.category_id === cat.id && item.is_visible !== false)
        })).filter((group: MenuItemGroup) => group.items.length > 0);

        // Handle Uncategorized
        const uncategorizedItems = filtered.filter(item =>
            (!item.category_id || !initialCategories.find(c => c.id === item.category_id)) &&
            item.is_visible !== false
        );
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

    // Variant State
    const [variants, setVariants] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
    const [variantsLoading, setVariantsLoading] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [orderNotes, setOrderNotes] = useState("");

    // Item Detail State
    const [detailQuantity, setDetailQuantity] = useState(1);
    const [detailNotes, setDetailNotes] = useState("");
    const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');

    // Language Selection State
    const [language, setLanguage] = useState<string | null>(null);
    const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [lastOrderDetails, setLastOrderDetails] = useState<{
        cart: CartItem[];
        customerName: string;
        tableNumber: string;
        total: number;
    } | null>(null);

    useEffect(() => {
        if (language && currentRestaurant.is_taking_orders === false) {
            setIsClosedModalOpen(true);
        }
    }, [language, currentRestaurant.is_taking_orders]);

    // --- VARIANT LOGIC ---
    const fetchItemVariants = async (itemId: string) => {
        setVariantsLoading(true);
        const { data } = await supabase
            .from('menu_item_variant_groups')
            .select(`*, variants:menu_item_variants(*)`)
            .eq('menu_item_id', itemId)
            .order('created_at', { ascending: true });

        if (data) {
            const sortedData = data.map(group => ({
                ...group,
                variants: group.variants.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // eslint-disable-line @typescript-eslint/no-explicit-any
            }));
            setVariants(sortedData);
            setSelectedVariants({});
        }
        setVariantsLoading(false);
    };

    const handleVariantChange = (groupId: string, variantId: string, type: 'single' | 'multiple', max: number) => {
        setSelectedVariants(prev => {
            const current = prev[groupId] || [];
            if (type === 'single') {
                // Toggle off if clicking same, or switch to new
                // For single required, usually allows switch. 
                // Let's just set it.
                return { ...prev, [groupId]: [variantId] };
            } else {
                if (current.includes(variantId)) {
                    return { ...prev, [groupId]: current.filter(id => id !== variantId) };
                } else {
                    if (current.length >= max) return prev;
                    return { ...prev, [groupId]: [...current, variantId] };
                }
            }
        });
    };

    const calculateItemTotal = (item: MenuItem | null, qty: number, selectedVars: Record<string, string[]>) => {
        if (!item) return 0;
        let total = item.price;
        Object.values(selectedVars).flat().forEach(varId => {
            const variant = variants.flatMap(g => g.variants).find((v: any) => v.id === varId); // eslint-disable-line @typescript-eslint/no-explicit-any
            if (variant) total += variant.price_adjustment;
        });
        return total * qty;
    };
    // ---------------------

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

    // Variant State
    useEffect(() => {
        if (selectedItem) {
            fetchItemVariants(selectedItem.id);
        } else {
            setVariants([]);
            setSelectedVariants({});
        }
    }, [selectedItem]); // eslint-disable-line react-hooks/exhaustive-deps

    const scrollToCategory = (id: string) => {
        setActiveCategory(id);
        const el = categoryRefs.current[id];
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 220;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const addToCart = (item: MenuItem | null, quantity = 1, notes = "") => {
        if (!item) return;

        // Validate Required Groups
        const missingGroups = variants.filter(g => g.is_required && (!selectedVariants[g.id] || selectedVariants[g.id].length < g.min_selection));
        if (missingGroups.length > 0) {
            toast.error(`Please select ${missingGroups[0].name}`);
            return;
        }

        const finalSelectedVariants = Object.entries(selectedVariants).flatMap(([groupId, varIds]) => {
            const group = variants.find(g => g.id === groupId);
            return varIds.map(vid => {
                const v = group?.variants.find((v: any) => v.id === vid);
                return { groupName: group?.name, name: v?.name, price: v?.price_adjustment };
            });
        });

        const unitPrice = item.price + finalSelectedVariants.reduce((sum, v) => sum + (v.price || 0), 0);

        // Generate a unique ID based on item + variants
        // This is a simple hash mechanism for local cart diffing
        // const variantKey = finalSelectedVariants.map(v => v.name).sort().join('|');

        setCart(prev => {
            const existingIndex = prev.findIndex(i =>
                i.id === item.id &&
                JSON.stringify(i.selectedVariants || []) === JSON.stringify(finalSelectedVariants) &&
                (i.notes || "") === (notes || "")
            );

            if (existingIndex >= 0) {
                const newCart = [...prev];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    quantity: newCart[existingIndex].quantity + quantity
                };
                return newCart;
            }

            return [...prev, {
                ...item,
                quantity,
                notes,
                price: unitPrice,
                selectedVariants: finalSelectedVariants,
                cartId: `${item.id}-${Date.now()}` // Helper for React key
            }];
        });

        // Sync item notes to order instructions (Global Note)
        if (notes && notes.trim().length > 0) {
            setOrderNotes(prev => {
                const cleanedNote = notes.trim();
                if (!prev || prev.trim().length === 0) return cleanedNote;
                // Avoid duplicating if it's already there (optional but good UX)
                if (prev.includes(cleanedNote)) return prev;
                return `${prev}, ${cleanedNote}`;
            });
        }

        toast.custom(() => (
            <div className="bg-zinc-900 text-white border border-zinc-800 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[300px]">
                <div className="bg-primary text-primary-foreground rounded-full p-2 animate-bounce-short"><ShoppingCart className="w-4 h-4" /></div>
                <div className="flex-1">
                    <p className="font-bold text-sm">Added to Order</p>
                    <p className="text-zinc-400 text-xs">{item.name}</p>
                </div>
            </div>
        ), { duration: 1500 });
    };

    const updateQuantity = (targetId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            const currentId = i.cartId || i.id;
            const isMatch = currentId === targetId;
            return isMatch ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i;
        }).filter(i => i.quantity > 0));
    };

    const placeOrder = async () => {
        if (!currentRestaurant.is_taking_orders) { toast.error("Sorry, the restaurant is currently closed."); return; }
        if (!customerName.trim()) { toast.error("👋 Tell us your name!"); return; }
        setLoading(true);
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        try {
            const { data: order, error } = await supabase.from('orders').insert({
                restaurant_id: currentRestaurant.id, status: 'pending', total_amount: total,
                customer_name: customerName, table_number: tableNumber, notes: orderNotes,
                order_type: orderType
            }).select().single();
            if (error) throw error;
            await supabase.from('order_items').insert(cart.map(item => ({
                restaurant_id: currentRestaurant.id, order_id: order.id, menu_item_id: item.id,
                quantity: item.quantity, price_at_time: item.price
            })));
            setLastOrderDetails({
                cart: [...cart],
                customerName,
                tableNumber,
                total
            });
            setCart([]); setIsCartOpen(false); setCustomerName(""); setTableNumber(""); setOrderNotes("");
            setIsOrderPlaced(true);
        } catch { toast.error("Error placing order."); } finally { setLoading(false); }
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

    if (!language) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-sm">
                    {/* Logo/Avatar */}
                    <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl shadow-primary/20">
                        {currentRestaurant.logo_url ? (
                            <img src={currentRestaurant.logo_url} className="w-full h-full object-cover rounded-[1.2rem]" alt="Logo" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 rounded-[1.2rem] flex items-center justify-center text-3xl font-bold text-zinc-300">
                                {currentRestaurant.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black text-white tracking-tight">{currentRestaurant.name}</h1>
                        <p className="text-zinc-400">Please select your preferred language</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 w-full">
                        <button
                            onClick={() => setLanguage('en')}
                            className="h-16 rounded-2xl bg-white hover:bg-zinc-50 flex items-center justify-between px-6 transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                            <span className="font-bold text-lg text-zinc-900">English</span>
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </button>
                        <button
                            onClick={() => setLanguage('ar')}
                            className="h-16 rounded-2xl bg-white hover:bg-zinc-50 flex items-center justify-between px-6 transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                            <span className="font-bold text-lg text-zinc-900 font-arabic">العربية</span>
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                        </button>
                    </div>


                </div>

                {/* Footer - Fixed to Screen Bottom */}
                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 z-50">
                    <span className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase opacity-80">Powered by Restau Plus</span>
                    <img src="/restau-plus-white.png" alt="Restau Plus" className="h-4 w-auto opacity-60" />
                </div>
            </div>
        );
    }

    const translations: Record<string, Record<string, string>> = {
        en: {
            // ... existing en keys
            searchPlaceholder: "Search for a product...",
            selectBranch: "Select Branch",
            poweredBy: "Powered by Restau Plus",
            experience: "RESTAU+ EXPERIENCE",
            workWithUs: "Click here to work with us",
            totalOrder: "Total Order",
            check: "Check",
            basket: "Your Basket",
            ready: "Ready for checkout",
            deliveryName: "Delivery Name",
            table: "Table/Pos",
            instructions: "Instructions",
            confirm: "Confirm Order",
            addToBasket: "Add to Basket",
            customInfo: "Custom Info",
            addNotes: "Add special notes",
            plats: "DISHES",
            plat: "DISH",
            noResults: "No results found",
            clearSearch: "Clear search",
            addedToOrder: "Added to Order",
            enterName: "👋 Tell us your name!",
            orderPlaced: "Order Placed! Enjoy your meal.",
            errorOrder: "Error placing order.",
            getInTouch: "Get in Touch",
            openForOrders: "Open for orders",
            closedForOrders: "Closed for orders",
            restaurant: "Restaurant",
            infos: "INFOS",
            open: "Open",
            close: "Close"
        },
        ar: {
            // ... existing ar keys
            searchPlaceholder: "بحث عن منتج...",
            selectBranch: "اختر الفرع",
            poweredBy: "مدعوم من Restau Plus",
            experience: "تجربة RESTAU+",
            workWithUs: "اضغط هنا للعمل معنا",
            totalOrder: "الطلب الكلي",
            check: "تأكيد",
            basket: "سلة الطلبات",
            ready: "جاهز للدفع",
            deliveryName: "الاسم",
            table: "رقم الطاولة",
            instructions: "ملاحظات",
            confirm: "تأكيد الطلب",
            addToBasket: "أضف للسلة",
            customInfo: "معلومات إضافية",
            addNotes: "أضف ملاحظات خاصة",
            plats: "أطباق",
            plat: "طبق",
            noResults: "لا توجد نتائج",
            clearSearch: "مسح البحث",
            addedToOrder: "تمت الإضافة للطلب",
            enterName: "👋 أخبرنا باسمك!",
            orderPlaced: "تم الطلب! استمتع بوجبتك.",
            errorOrder: "خطأ في الطلب.",
            getInTouch: "تواصل معنا",
            openForOrders: "مفتوح للطلبات",
            closedForOrders: "مغلق للطلبات",
            restaurant: "مطعم",
            infos: "معلومات",
            open: "يفتح",
            close: "يغلق"
        }
    };

    // Dynamic Category Translations (Client-side mapping for demo/MVP)
    const categoryTranslations: Record<string, string> = {
        "Burgers": "برغر",
        "Breakfast": "فطور",
        "Drinks": "مشروبات",
        "Desserts": "حلوى",
        "Salads": "سلطات",
        "Sandwiches": "سندويشات",
        "Main Course": "الطبق الرئيسي",
        "Appetizers": "مقبلات",
        "Sides": "جانبية",
        "Pizza": "بيتزا",
        "Pasta": "معكرونة",
        "Soup": "شوربة",
        "Featured": "مميز",
        "Offers": "عروض",
        "OFFERS": "عروض",
        "Sandwiches and Zingers": "سندويشات وزنجر",
        "SANDWICHES AND ZINGERS": "سندويشات وزنجر"
    };

    // Dynamic Item Translations (Client-side mapping for demo)
    const itemTranslations: Record<string, string> = {
        "Beef Burger": "برغر لحم",
        "Chicken Burger": "برغر دجاج",
        "Cheese Pancakes ...with Strawberry": "بان كيك بالجبن والفراولة",
        "Cheese Pancakes": "بان كيك بالجبن",
        "Full English Breakfast": "فطور إنجليزي",
        "Classic Burger": "برغر كلاسيك",
        "Mushroom Burger": "برغر بالمشروم",
        "Caesar Salad": "سلطة سيزر",
        "Greek Salad": "سلطة يونانية",
        "Orange Juice": "عصير برتقال",
        "Lemonade": "عصير ليمون",
        "Chocolate Cake": "كيكة الشوكولاتة",
        "Cheesecake": "تشيز كيك",
        "Coffee": "قهوة",
        "Tea": "شاي",
        // New Additions
        "Pancake": "بان كيك",
        "PANCAKE": "بان كيك",
        "Pancakes": "بان كيك",
        "PANCAKES": "بان كيك",
        "American Breakfast": "فطور أمريكي",
        "American breakfast": "فطور أمريكي",
        "Boom Offer": "عرض بوم",
        "BOOM OFFER": "عرض بوم",
        "Duo Menu": "قائمة ثنائية",
        "DUO MENU": "قائمة ثنائية",
        "Twister Offer": "عرض تويستر",
        "TWISTER OFFER": "عرض تويستر",
        "Family Offer": "عرض العائلة",
        "FAMILY OFFER": "عرض العائلة",
        "Solo Offer": "عرض فردي",
        "SOLO OFFER": "عرض فردي",
        "Family Offer Eco": "عرض عائلي اقتصادي",
        "FAMILY OFFER ECO": "عرض عائلي اقتصادي"
    };

    const itemDescriptionTranslations: Record<string, string> = {
        "great beef burger by al falamanki best one in qatar": "أفضل برغر لحم من الفلمنكي في قطر",
        "best chicken burger in doha": "أفضل برغر دجاج في الدوحة",
        "best Cheese pancakes with strawberry jam in doha qatar": "أفضل بان كيك بالجبن مع مربى الفراولة",
        "good for morning": "الخيار الأمثل للصباح",
        "The original taste you love, freshly prepared and delivered hot.": "الطعم الأصلي الذي تحبه، محضر طازجاً ويصلك ساخناً."
    };

    const t = translations[language || 'en'];

    const getCategoryName = (name: string) => {
        if (language !== 'ar') return name;

        // Try exact match
        if (categoryTranslations[name]) return categoryTranslations[name];

        // Try Title Case (e.g. "BURGERS" -> "Burgers")
        const titleCase = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        if (categoryTranslations[titleCase]) return categoryTranslations[titleCase];

        return name;
    };

    const getItemName = (name: string) => {
        if (language !== 'ar') return name;
        const normalized = name.replace(/\s+/g, ' ').trim(); // Handle extra spaces
        if (itemTranslations[normalized]) return itemTranslations[normalized];
        // Try title case as fallback
        const titleCase = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
        if (itemTranslations[titleCase]) return itemTranslations[titleCase];

        // Try exact matching for common capitalizations just in case
        if (itemTranslations[name]) return itemTranslations[name];

        // Try simple substring matches using smart translate
        if (normalized.toLowerCase().includes("beef burger")) return "برغر لحم";
        if (normalized.toLowerCase().includes("chicken burger")) return "برغر دجاج";

        // Final fallback: Smart Word-by-Word Translation
        return smartTranslate(name);
    };

    const defaultDescription = "The original taste you love, freshly prepared and delivered hot.";

    const getItemDescription = (desc: string | null) => {
        const textToTranslate = desc || defaultDescription;

        if (language !== 'ar') return textToTranslate;

        if (itemDescriptionTranslations[textToTranslate]) return itemDescriptionTranslations[textToTranslate];

        // If it matches the default description but perhaps with minor diffs or exact match check failed above
        if (textToTranslate.includes("original taste you love")) return itemDescriptionTranslations[defaultDescription];

        return textToTranslate;
    };

    // Smart Auto-Translate Fallback
    const commonTerms: { [key: string]: string } = {
        "burger": "برغر",
        "chicken": "دجاج",
        "beef": "لحم",
        "sandwich": "سندويش",
        "sandwiches": "سندويشات",
        "zinger": "زنجر",
        "combo": "كومبو",
        "meal": "وجبة",
        "box": "صندوق",
        "classic": "كلاسيك",
        "cheese": "جبن",
        "sauce": "صلصة",
        "spicy": "حار",
        "fries": "بطاطس",
        "drink": "مشروب",
        "pepsi": "بيبسي",
        "cola": "كولا",
        "water": "ماء",
        "juice": "عصير",
        "orange": "برتقال",
        "strawberry": "فراولة",
        "chocolate": "شوكولاتة",
        "offer": "عرض",
        "special": "خاص",
        "family": "عائلي",
        "kids": "أطفال",
        "plate": "طبق",
        "platter": "صحن",
        "mix": "مشكل",
        "grill": "مشوي",
        "fried": "مقلي",
        "solo": "فردي",
        "eco": "اقتصادي",
        "supreme": "سوبريم",
        "deluxe": "ديلوكس",
        "bowl": "وعاء",
        "salad": "سلطة",
        "soup": "شوربة",
        "breakfast": "فطور",
        "pancake": "بان كيك"
    };

    const smartTranslate = (text: string) => {
        if (!text) return text;

        // Split text into words, keeping numbers and special chars
        const words = text.split(/(\s+|[0-9]+|[^\w\s])/);

        const translatedParts = words.map(word => {
            const lower = word.toLowerCase().trim();
            // Check if word is in common terms (handle plurals blindly by trim 's' if needed, but exact map is safer)
            if (commonTerms[lower]) return commonTerms[lower];
            // Simple singularize check
            if (lower.endsWith('s') && commonTerms[lower.slice(0, -1)]) return commonTerms[lower.slice(0, -1)];

            return word; // Keep original if no match
        });

        return translatedParts.join('');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] text-zinc-900 font-sans selection:bg-primary/20 pb-40" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* --- PRO HERO HEADER --- */}
            <div className="relative h-[40vh] w-full overflow-hidden bg-zinc-900">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
                    {currentRestaurant.banner_url ? (
                        <div className="relative w-full h-full">
                            <img src={currentRestaurant.banner_url} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-800 to-zinc-900" />
                    )}
                </motion.div>

                {/* Overlapping Glass Card */}
                <div className="absolute -bottom-1 left-0 right-0 z-20 px-4">
                    <div className="max-w-lg mx-auto relative">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-white/80 backdrop-blur-2xl rounded-t-[3rem] pt-6 pb-6 px-4 sm:px-8 flex flex-col items-center text-center shadow-[0_-10px_60px_-15px_rgba(255,255,255,0.3)] border-t border-x border-white/60 ring-1 ring-white/40"
                        >
                            {/* Floating Logo */}
                            <motion.div
                                className="relative -mt-24 mb-4"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-white/40 backdrop-blur-md shadow-2xl ring-1 ring-white/60">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner relative z-10">
                                        {currentRestaurant.logo_url ? (
                                            <img src={currentRestaurant.logo_url} className="w-full h-full object-cover" alt="Logo" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-5xl font-black text-white">
                                                {currentRestaurant.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-sm" title="Open Now">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Restaurant Name & Verified */}
                            <div className="flex flex-col items-center gap-1 mb-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-900 leading-none drop-shadow-sm">
                                        {currentRestaurant.name}
                                    </h1>
                                    <div className="bg-blue-500/10 rounded-full p-1">
                                        <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/20" />
                                    </div>
                                </div>

                                {/* Operating Hours & Status */}
                                <div className="flex flex-col items-center gap-2 mt-1">
                                    {currentRestaurant.opening_time && currentRestaurant.closing_time && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                            <span>{t.open} {currentRestaurant.opening_time.slice(0, 5)}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                            <span>{t.close} {currentRestaurant.closing_time.slice(0, 5)}</span>
                                        </div>
                                    )}

                                    <p className={cn(
                                        "text-sm font-medium flex items-center gap-1.5 px-3 py-1 rounded-full border",
                                        currentRestaurant.is_taking_orders !== false
                                            ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                                            : "text-red-600 bg-red-50 border-red-200"
                                    )}>
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full animate-pulse",
                                            currentRestaurant.is_taking_orders !== false ? "bg-emerald-500" : "bg-red-500"
                                        )} />
                                        {currentRestaurant.is_taking_orders !== false ? t.openForOrders : t.closedForOrders}
                                    </p>
                                </div>
                            </div>

                            {/* X1000 PRO INFOS Button */}
                            <motion.div
                                onClick={() => setIsContactOpen(true)}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative mt-3 cursor-pointer overflow-hidden rounded-2xl w-auto inline-flex"
                            >
                                {/* Glassmorphic Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/80 backdrop-blur-2xl" />

                                {/* Animated Border Gradient */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zinc-200/50 via-zinc-300/50 to-zinc-200/50 p-[1.5px] opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                    <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-xl" />
                                </div>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 p-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x">
                                    <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-xl" />
                                </div>

                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative flex items-center gap-2.5 px-5 py-2.5 z-10">
                                    {/* Icon Container */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
                                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1 group-hover:text-zinc-500 transition-colors">{t.restaurant}</span>
                                        <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 uppercase tracking-wide group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
                                            {t.infos}
                                        </span>
                                    </div>

                                    {/* Arrow */}
                                    <div className="relative">
                                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-all group-hover:translate-x-1" />
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(147,51,234,0.15)]" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>


            {/* --- NAVIGATION & SEARCH --- */}
            <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-zinc-50">
                <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
                    {/* Search Bar matching screenshot */}
                    <div className="relative group">
                        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors ${language === 'ar' ? 'right-4' : 'left-4'}`} />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className={`bg-[#F3F4F6] border-zinc-200 h-12 rounded-2xl text-sm font-medium focus:ring-primary/20 focus:bg-white transition-all ${language === 'ar' ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
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
                                {getCategoryName(group.name)}
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
                            <h2 className="text-lg font-black tracking-tight text-zinc-900 uppercase">{getCategoryName(group.name)}</h2>
                            <div className="flex-1 h-px bg-zinc-100" />
                            <span className="text-[10px] font-bold text-zinc-300 bg-zinc-100/50 px-2 py-1 rounded-md">
                                {group.items.length} {group.items.length > 1 ? t.plats : t.plat}
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
                                            <img
                                                src={item.image_url}
                                                alt={getItemName(item.name)}
                                                className={cn(
                                                    "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                                                    !item.is_available && "grayscale opacity-60"
                                                )}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><Sparkles className="w-10 h-10 text-zinc-300" /></div>
                                        )}

                                        {/* Sold Out Overlay */}
                                        {!item.is_available && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <div className="bg-black/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
                                                    Sold Out
                                                </div>
                                            </div>
                                        )}

                                        {/* Promo Tag (Simulated like screenshot) */}
                                        {i % 3 === 0 && item.is_available && (
                                            <div className={`absolute top-3 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                                                -15%
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <div>
                                            <h3 className="font-black text-[13px] text-zinc-900 leading-tight uppercase line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                                {getItemName(item.name)}
                                            </h3>
                                            <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                                                {getItemDescription(item.description) || "The original taste you love, freshly prepared and delivered hot."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-primary font-mono tracking-tighter">
                                                    <span className="text-[10px] text-zinc-400 mr-0.5">{language === 'ar' && currencyCode === 'QAR' ? 'ر.ق' : currencySymbol}</span>
                                                    {item.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Signature Plus Button (Orange Circle from screenshot) */}
                                            {item.is_available && currentRestaurant.is_taking_orders !== false ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                                                    className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <Plus className="w-5 h-5 stroke-[3px]" />
                                                </button>
                                            ) : (
                                                <button disabled className="w-10 h-10 bg-zinc-100 text-zinc-300 rounded-full flex items-center justify-center cursor-not-allowed">
                                                    <X className="w-5 h-5 stroke-[3px]" />
                                                </button>
                                            )}
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
                        <h3 className="text-xl font-bold text-zinc-800">{t.noResults}</h3>
                        <p className="text-sm text-zinc-500 mt-1 max-w-[200px] mx-auto">We couldn&apos;t find what you&apos;re looking for.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary font-bold">{t.clearSearch}</Button>
                    </div>
                )}
            </main>

            {/* --- FLOATING CART (Refined Floating Island) --- */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
                        <button onClick={() => setIsCartOpen(true)} className="pointer-events-auto w-full max-w-sm bg-zinc-900 text-white p-3 rounded-[3rem] shadow-2xl flex items-center gap-4 transition-transform active:scale-95 ring-4 ring-primary">
                            <div className="bg-white text-black font-black w-12 h-12 rounded-full flex items-center justify-center shadow-inner shrink-0 scale-105">
                                <motion.span key={cartCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>{cartCount}</motion.span>
                            </div>
                            <div className={`flex-1 min-w-0 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">{t.totalOrder}</p>
                                <p className="text-xl font-bold font-mono tracking-tighter truncate">{currencySymbol}{cartTotal.toFixed(2)}</p>
                            </div>
                            <div className="bg-primary text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <span>{t.check}</span>
                                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CART SHEET --- */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="bottom" className="h-[92vh] rounded-t-[3rem] p-0 border-t-0 bg-white outline-none overflow-hidden [&>button]:hidden">
                    <div className="h-full flex flex-col relative w-full max-w-lg mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-200 rounded-full z-20" />

                        <div className="p-8 pb-6 bg-white border-b border-zinc-100 flex items-end justify-between">
                            <div>
                                <SheetTitle className="text-4xl font-black text-zinc-900 tracking-tighter">{t.basket}</SheetTitle>
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">{t.ready}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full h-10 w-10 bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm hover:bg-zinc-200 transition-all"><X className="w-5 h-5" /></Button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 space-y-4 py-8 bg-[#FBFBFC]">
                            {cart.map((item, i) => (
                                <motion.div layout key={`${item.id}-${i}`} className="flex gap-4 items-center bg-white p-4 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                                    <div className="w-20 h-20 bg-zinc-100 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                                        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-zinc-900 text-sm truncate uppercase pr-4">{getItemName(item.name)}</h4>
                                            {item.selectedVariants && item.selectedVariants.length > 0 && (
                                                <div className="text-[10px] text-zinc-500 mt-0.5 space-y-0.5">
                                                    {item.selectedVariants.map((v, idx) => (
                                                        <div key={idx} className="flex gap-1">
                                                            <span className="font-semibold">{v.groupName}:</span> {v.name} (+{v.price})
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <span className="font-bold text-zinc-900 text-sm whitespace-nowrap">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-2xl px-2 py-1.5">
                                                <button onClick={() => updateQuantity(item.cartId || item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-xl text-lg shadow-sm hover:translate-y-px transition-all">-</button>
                                                <span className="font-black w-5 text-center text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartId || item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-zinc-900 text-white rounded-xl text-lg shadow-sm hover:-translate-y-px transition-all">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Moved Input Section Inside Scrollable Area for Mobile Keyboard Safety */}
                            <div className="p-4 bg-white rounded-[2rem] border border-zinc-100 space-y-5 shadow-sm mt-8">
                                {/* Order Type Toggle */}
                                <div className="bg-zinc-100 p-1.5 rounded-2xl flex relative h-14">
                                    <div
                                        className={cn(
                                            "absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl shadow-sm transition-all duration-300 ease-spring",
                                            orderType === 'dine_in' ? "start-1.5 bg-primary" : "start-[calc(50%+3px)] bg-primary"
                                        )}
                                    />
                                    <button
                                        onClick={() => setOrderType('dine_in')}
                                        className={cn(
                                            "flex-1 text-sm font-black uppercase tracking-wider relative z-10 transition-colors duration-300",
                                            orderType === 'dine_in' ? "text-white" : "text-zinc-400" // Changed text-zinc-900 to text-white
                                        )}
                                    >
                                        {language === 'ar' ? 'داخل المطعم' : 'Dine In'}
                                    </button>
                                    <button
                                        onClick={() => setOrderType('takeaway')}
                                        className={cn(
                                            "flex-1 text-sm font-black uppercase tracking-wider relative z-10 transition-colors duration-300",
                                            orderType === 'takeaway' ? "text-white" : "text-zinc-400" // Changed text-zinc-900 to text-white
                                        )}
                                    >
                                        {language === 'ar' ? 'سفري' : 'Take Away'}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <Input placeholder={t.deliveryName} value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-16 rounded-[2rem] bg-zinc-50 border border-zinc-200 px-8 text-lg font-bold text-zinc-900 placeholder:text-zinc-500 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20" />
                                    <div className="grid grid-cols-1 gap-3">
                                        {orderType === 'dine_in' && (
                                            <Input placeholder={t.table} value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="h-14 rounded-[1.5rem] bg-zinc-50 border border-zinc-200 px-6 font-semibold text-zinc-900 placeholder:text-zinc-500 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20" />
                                        )}
                                        <Input placeholder={t.instructions} value={orderNotes} onChange={e => setOrderNotes(e.target.value)} className="h-14 rounded-[1.5rem] bg-zinc-50 border border-zinc-200 px-6 font-semibold text-zinc-900 placeholder:text-zinc-500 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20" />
                                    </div>
                                </div>
                                <Button
                                    onClick={placeOrder}
                                    disabled={loading || cart.length === 0 || !currentRestaurant.is_taking_orders}
                                    className={cn(
                                        "w-full h-auto min-h-[5rem] py-4 rounded-[2.5rem] text-lg md:text-xl font-black transition-all flex items-center justify-between px-6 md:px-10",
                                        !currentRestaurant.is_taking_orders
                                            ? "bg-white border-[3px] border-red-500 text-red-500 cursor-not-allowed opacity-100"
                                            : "bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 disabled:bg-zinc-300 disabled:shadow-none disabled:cursor-not-allowed"
                                    )}
                                >
                                    <span className="uppercase tracking-tighter text-left leading-tight py-1">
                                        {currentRestaurant.is_taking_orders ? t.confirm : (language === 'ar' ? "المتجر مغلق" : "Store Closed")}
                                    </span>
                                    <div className={`border mx-2 md:mx-4 ${language === 'ar' ? 'border-r border-white/20 pr-4 md:pr-8' : 'border-l border-white/20 pl-4 md:pl-8'} font-mono shrink-0 opacity-80 ${(!currentRestaurant.is_taking_orders ? "border-red-200" : "")}`}>
                                        <span className="text-[10px] mr-1 opacity-80">{language === 'ar' && currencyCode === 'QAR' ? 'ر.ق' : currencySymbol}</span>
                                        {cartTotal.toFixed(2)}
                                    </div>
                                </Button>
                            </div>

                            {/* Spacer to ensure scrolling past bottom */}
                            <div className="h-20" />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* --- DETAIL SCREEN --- */}
            <Sheet open={!!selectedItem} onOpenChange={(open) => {
                if (!open) {
                    setSelectedItem(null);
                    setDetailQuantity(1);
                    setDetailNotes("");
                    setVariants([]); // Clear variants
                }
            }}>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] p-0 border-t-0 bg-white shadow-none outline-none overflow-hidden [&>button]:hidden">
                    <SheetTitle className="sr-only">Item Details</SheetTitle>

                    {/* Better approach: Add useEffect after the component mount section, but since I can't easily jump there, I'll add an inline effect or just assume I updated the onClick handler elsewhere. 
                       Actually, I should check if I can just add a useEffect block here? No.
                       The best place logic-wise is in the main body.
                       I'll add a useEffect block near the top of the component.
                    */}
                    {selectedItem && (
                        <div className="h-full flex flex-col bg-white w-full max-w-lg mx-auto rounded-t-[2rem] shadow-2xl overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            {/* Header Image */}
                            <div className="relative h-[30vh] shrink-0 bg-zinc-50">
                                {selectedItem.image_url ? (
                                    <img src={selectedItem.image_url} className="w-full h-full object-cover" alt={selectedItem.name} />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300">
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/5" />
                                <button
                                    onClick={() => { setSelectedItem(null); setDetailQuantity(1); setDetailNotes(""); }}
                                    className={`absolute top-4 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-zinc-900 shadow-sm z-50 hover:bg-white active:scale-95 transition-all ${language === 'ar' ? 'left-4' : 'right-4'}`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content & Scroll Area */}
                            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
                                        {getItemName(selectedItem.name)}
                                    </h2>
                                    <span className="text-xl font-bold text-primary whitespace-nowrap">
                                        {currencySymbol}{calculateItemTotal(selectedItem, detailQuantity, selectedVariants).toFixed(2)}
                                    </span>
                                </div>

                                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                                    {getItemDescription(selectedItem.description) || "The original taste you love, freshly prepared and delivered hot."}
                                </p>

                                {/* Variants Section */}
                                {variantsLoading ? (
                                    <div className="py-4 text-center">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                    </div>
                                ) : (
                                    variants.map(group => (
                                        <div key={group.id} className="mb-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-bold text-lg text-zinc-900 capitalize">{group.name}</h3>
                                                {group.is_required && <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{t.required || "Required"}</span>}
                                                <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                                    {group.selection_type === 'single' ? '1 Choice' : `Max ${group.max_selection}`}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {group.variants.map((variant: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                                    const isSelected = (selectedVariants[group.id] || []).includes(variant.id);
                                                    return (
                                                        <div
                                                            key={variant.id}
                                                            onClick={() => handleVariantChange(group.id, variant.id, group.selection_type, group.max_selection)}
                                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-zinc-300'}`}>
                                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                                </div>
                                                                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-zinc-700'}`}>{variant.name}</span>
                                                            </div>
                                                            {variant.price_adjustment > 0 && (
                                                                <span className="text-sm font-bold text-zinc-500">+{currencySymbol}{variant.price_adjustment}</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Special Instructions */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                                        <Info className="w-3 h-3 text-zinc-400" />
                                        {t.instructions || "Special Notes"}
                                    </label>
                                    <textarea
                                        placeholder={t.addNotes}
                                        className="w-full min-h-[100px] p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-zinc-400"
                                        value={detailNotes}
                                        onChange={(e) => setDetailNotes(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Fixed Bottom Action Bar */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100/50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-20">
                                <div className="flex items-center gap-3 max-w-lg mx-auto">
                                    {/* Quantity Selector - Compact */}
                                    <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-2 h-12 md:h-14">
                                        <button
                                            onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                                            className="w-8 h-full flex items-center justify-center text-lg font-medium text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                                        >-</button>
                                        <span className="w-4 text-center font-bold text-zinc-900 text-sm">{detailQuantity}</span>
                                        <button
                                            onClick={() => setDetailQuantity(detailQuantity + 1)}
                                            className="w-8 h-full flex items-center justify-center text-lg font-medium text-zinc-500 hover:text-zinc-900 active:scale-90 transition-transform"
                                        >+</button>
                                    </div>

                                    {/* Add Button */}
                                    <Button
                                        onClick={() => {
                                            addToCart(selectedItem, detailQuantity, detailNotes);
                                            setSelectedItem(null);
                                            setDetailQuantity(1);
                                            setDetailNotes("");
                                        }}
                                        className="flex-1 h-12 md:h-14 rounded-xl bg-primary text-white hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 px-4"
                                    >
                                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="uppercase tracking-wide text-[10px] md:text-sm font-bold whitespace-nowrap">{t.addToBasket}</span>
                                        <span className="opacity-50 text-xs">|</span>
                                        <span className="font-bold whitespace-nowrap text-xs md:text-sm">
                                            {currencySymbol}{calculateItemTotal(selectedItem, detailQuantity, selectedVariants).toFixed(2)}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* --- CONTACT & SOCIALS SHEET (NEW ULTRA PRO) --- */}
            <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
                <SheetContent side="bottom" className="rounded-t-[2rem] p-0 border-t-0 bg-white shadow-2xl outline-none overflow-hidden [&>button]:hidden h-auto max-h-[85vh] flex flex-col">
                    {/* Close Button "X" */}
                    <button
                        onClick={() => setIsContactOpen(false)}
                        className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-zinc-100/80 backdrop-blur-md !flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col h-full overflow-y-auto overscroll-contain">
                        <div className="flex flex-col items-center p-6 pb-8 w-full max-w-lg mx-auto relative min-h-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            {/* Background Blurs */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-[100px] -mr-40 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-[100px] -ml-40 -mb-20 pointer-events-none" />

                            <div className="w-12 h-1.5 bg-zinc-100 rounded-full mb-8 shrink-0 opacity-50" />

                            <SheetTitle className="sr-only">{t.getInTouch}</SheetTitle>

                            {/* Header Section */}
                            <div className="flex flex-col items-center text-center space-y-5 mb-12 z-10 w-full">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                                    <div className="relative w-28 h-28 rounded-[2rem] bg-white p-2 shadow-2xl shadow-zinc-200/50 border border-zinc-100 transform transition-transform group-hover:scale-105 duration-500">
                                        {currentRestaurant.logo_url ? (
                                            <img src={currentRestaurant.logo_url} className="w-full h-full object-cover rounded-[1.5rem]" alt="Logo" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-zinc-200">
                                                {currentRestaurant.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2">{currentRestaurant.name}</h3>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse", currentRestaurant.is_taking_orders !== false ? "bg-emerald-500" : "bg-red-500")} />
                                        <span className={cn("text-xs font-bold uppercase tracking-wider", currentRestaurant.is_taking_orders !== false ? "text-emerald-600" : "text-red-600")}>
                                            {currentRestaurant.is_taking_orders !== false ? "Open Now" : "Closed Now"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Grid */}
                            <div className="w-full space-y-4 z-10">
                                {/* Operating Hours - NEW */}
                                {(currentRestaurant.opening_time || currentRestaurant.closing_time) && (
                                    <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:bg-white/80 group">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Operating Hours</p>
                                            <p className="font-bold text-zinc-900 flex items-center gap-2">
                                                <span>{currentRestaurant.opening_time?.slice(0, 5) || "09:00"}</span>
                                                <span className="text-zinc-300">•</span>
                                                <span>{currentRestaurant.closing_time?.slice(0, 5) || "22:00"}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentRestaurant.phone && (
                                    <a href={`tel:${currentRestaurant.phone}`} className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] active:scale-[0.98] group">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Call Us</p>
                                            <p className="font-bold text-zinc-900 text-lg dir-ltr">{currentRestaurant.phone}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-zinc-100/50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                            {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                        </div>
                                    </a>
                                )}

                                {currentRestaurant.address && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(currentRestaurant.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] active:scale-[0.98] group"
                                    >
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Visit Us</p>
                                            <p className="font-bold text-zinc-900 text-sm leading-relaxed line-clamp-2">{currentRestaurant.address}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-zinc-100/50 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </a>
                                )}

                                {currentRestaurant.email_public && (
                                    <a href={`mailto:${currentRestaurant.email_public}`} className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] active:scale-[0.98] group">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Email Us</p>
                                            <p className="font-bold text-zinc-900 text-sm break-all">{currentRestaurant.email_public}</p>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Social Media */}
                            {(currentRestaurant.instagram_url || currentRestaurant.facebook_url || currentRestaurant.website_url) && (
                                <div className="mt-12 w-full z-10">
                                    <div className="relative flex items-center justify-center mb-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-zinc-100"></div>
                                        </div>
                                        <span className="relative bg-white px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Connect With Us</span>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        {currentRestaurant.instagram_url && (
                                            <a
                                                href={currentRestaurant.instagram_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
                                                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                                            >
                                                <Instagram className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                                            </a>
                                        )}
                                        {currentRestaurant.facebook_url && (
                                            <a
                                                href={currentRestaurant.facebook_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-16 h-16 bg-[#1877F2] rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
                                            >
                                                <Facebook className="w-7 h-7 group-hover:-rotate-12 transition-transform duration-300" />
                                            </a>
                                        )}
                                        {currentRestaurant.website_url && (
                                            <a
                                                href={currentRestaurant.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/40 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
                                            >
                                                <Globe className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Terms / Footer */}
                            <div className="mt-12 text-center">
                                <p className="text-[10px] text-zinc-300 font-medium">
                                    © {new Date().getFullYear()} {currentRestaurant.name}. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>



            {/* Simple Footer */}
            <footer className="py-24 text-center flex flex-col items-center">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">{t.experience}</p>
                <p className="text-sm font-bold text-zinc-500 mt-2">{t.poweredBy}</p>

                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 bg-black hover:bg-zinc-900 text-white h-14 px-8 rounded-full flex items-center justify-center gap-4 transition-transform hover:scale-105 shadow-xl shadow-zinc-200"
                >
                    <span className="text-xs font-bold tracking-wide">{t.workWithUs}</span>
                    <div className="h-4 w-px bg-white/20" />
                    <img src="/restau-plus-white.png" alt="Visit Restau Plus" className="h-4 w-auto" />
                </a>
            </footer>

            {/* --- CLOSED STORE MODAL --- */}
            <Dialog open={isClosedModalOpen} onOpenChange={setIsClosedModalOpen}>
                <DialogContent showCloseButton={false} className="sm:max-w-md w-[90%] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-zinc-900 text-white">
                    <div className="relative h-48 bg-zinc-800 shrink-0">
                        {currentRestaurant.banner_url ? (
                            <img src={currentRestaurant.banner_url} className="w-full h-full object-cover opacity-60" alt="Cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl">
                                <Clock className="w-8 h-8 text-red-500 animate-pulse" />
                            </div>
                        </div>
                        {/* Close Button manually added to allow dismissing to view menu (but actions disabled) */}
                        <button
                            onClick={() => setIsClosedModalOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-8 pb-10 pt-2 text-center space-y-6">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-black tracking-tight text-white">
                                {language === 'ar' ? "نعتذر، نحن مغلقون حالياً" : "Sorry, We're Currently Closed"}
                            </DialogTitle>
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                {language === 'ar'
                                    ? "لا نستقبل طلبات في الوقت الحالي. يرجى التحقق من أوقات العمل أدناه."
                                    : "We are not accepting orders at the moment. Please check our operating hours below."}
                            </p>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                                    {language === 'ar' ? t.open : "OPENS"}
                                </span>
                                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                                    {language === 'ar' ? t.close : "CLOSES"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xl font-black text-emerald-400 font-mono">
                                    {currentRestaurant.opening_time?.slice(0, 5) || "--:--"}
                                </span>
                                <div className="h-px bg-zinc-700 flex-1 mx-4" />
                                <span className="text-xl font-black text-red-400 font-mono">
                                    {currentRestaurant.closing_time?.slice(0, 5) || "--:--"}
                                </span>
                            </div>
                        </div>

                        {/* Socials & Contact */}
                        <div className="grid grid-cols-2 gap-3">
                            {currentRestaurant.instagram_url && (
                                <a
                                    href={currentRestaurant.instagram_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#E1306C]/10 border border-[#E1306C]/20 hover:bg-[#E1306C]/20 transition-all group"
                                >
                                    <Instagram className="w-5 h-5 text-[#E1306C] mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-[#E1306C] tracking-wide uppercase">Instagram</span>
                                </a>
                            )}
                            {/* Assuming phone is available or fallback */}
                            <a
                                href={`tel:${currentRestaurant.phone || ''}`}
                                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                            >
                                <Phone className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold text-blue-500 tracking-wide uppercase">Call Us</span>
                            </a>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={() => setIsClosedModalOpen(false)}
                                className="w-full h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold tracking-wide"
                            >
                                {language === 'ar' ? "تصفح القائمة فقط" : "Browse Menu Only"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- ULTRA PRO ORDER SUCCESS OVERLAY --- */}
            <AnimatePresence>
                {isOrderPlaced && lastOrderDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-zinc-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 overflow-y-auto"
                        style={{ overflowY: 'auto', maxHeight: '100vh' }}
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                            {/* Floating Emojis */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        y: Math.random() * 200 + 400,
                                        x: Math.random() * 100 - 50,
                                        scale: 0.5
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        y: -200,
                                        x: Math.random() * 100 - 50,
                                        scale: [0.5, 1.2, 0.8],
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        ease: "easeOut"
                                    }}
                                    className="absolute bottom-0 text-4xl"
                                    style={{
                                        left: `${Math.random() * 80 + 10}%`,
                                    }}
                                >
                                    {['❤️', '💖', '💘', '💝', '💗', '💓'][Math.floor(Math.random() * 6)]}
                                </motion.div>
                            ))}

                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
                            />
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative z-10 w-full max-w-sm flex flex-col items-center"
                        >
                            {/* Partnership Header - Floating Top */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-6 mb-8"
                            >
                                {/* Restaurant Logo Sphere */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                                        {currentRestaurant.logo_url ? (
                                            <img src={currentRestaurant.logo_url} className="w-full h-full object-cover rounded-full" alt="Restaurant" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-black text-white/50 text-xl">
                                                {currentRestaurant.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* X Separator */}
                                <div className="relative flex items-center justify-center">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 font-black text-2xl" style={{ fontFamily: 'monospace' }}>✕</span>
                                    <div className="absolute inset-0 blur-lg bg-white/20 rounded-full scale-50" />
                                </div>

                                {/* Restau Plus Logo Sphere */}
                                {/* Restau Plus Logo - Standalone & Clickable */}
                                <Link href="/" className="relative group transition-transform hover:scale-105">
                                    <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src="/logo.png"
                                        className="h-6 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] relative z-10"
                                        alt="Restau Plus"
                                    />
                                </Link>
                            </motion.div>

                            {/* Receipt Card */}
                            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative w-full">
                                {/* Top Decoration */}
                                <div className="h-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

                                <div className="p-8 pb-6 flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-emerald-50"
                                    >
                                        <BadgeCheck className="w-10 h-10 text-emerald-500" />
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-black text-zinc-900 tracking-tight mb-2 uppercase"
                                    >
                                        {language === 'ar' ? "تم استلام الطلب" : "Order Received"}
                                    </motion.h2>
                                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        {language === 'ar' ? "شكراً لطلبك!" : "Thank you for your order!"}
                                    </p>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex flex-col items-center">
                                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">{language === 'ar' ? "الاسم" : "Name"}</span>
                                            <span className="font-bold text-zinc-900 truncate max-w-full">{lastOrderDetails.customerName}</span>
                                        </div>
                                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex flex-col items-center">
                                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">{language === 'ar' ? "الطاولة" : "Table"}</span>
                                            <span className="font-bold text-zinc-900 text-xl">{lastOrderDetails.tableNumber || "-"}</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full flex items-center justify-between pointer-events-none opacity-20 mb-6">
                                        <div className="w-6 h-6 rounded-full bg-zinc-900 -ml-11" />
                                        <div className="flex-1 border-t-2 border-dashed border-zinc-900 mx-2" />
                                        <div className="w-6 h-6 rounded-full bg-zinc-900 -mr-11" />
                                    </div>

                                    {/* Order Items Summary */}
                                    <div className="w-full space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {lastOrderDetails.cart.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                                <div className="flex gap-3 text-left">
                                                    <span className="font-black text-zinc-200 bg-zinc-900 w-6 h-6 flex items-center justify-center rounded-md text-[10px] shrink-0">
                                                        {item.quantity}x
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-zinc-800 leading-tight">
                                                            {getItemName(item.name)}
                                                        </span>
                                                        {item.selectedVariants && item.selectedVariants.length > 0 && (
                                                            <span className="text-[10px] text-zinc-400 capitalize">
                                                                {item.selectedVariants.map(v => v.name).join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-bold text-zinc-900 whitespace-nowrap">
                                                    {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full pt-4 border-t border-zinc-100 flex justify-between items-center mb-8">
                                        <span className="font-black text-zinc-400 uppercase tracking-widest text-xs">
                                            {language === 'ar' ? "المجموع" : "TOTAL AMOUNT"}
                                        </span>
                                        <span className="font-black text-2xl text-emerald-600">
                                            {currencySymbol}{lastOrderDetails.total.toFixed(2)}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsOrderPlaced(false)}
                                        className="w-full h-14 bg-zinc-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        {language === 'ar' ? "إغلاق" : "Done, Thanks"}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
