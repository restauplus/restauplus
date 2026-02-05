"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Image as ImageIcon, Search, X, GripVertical, Sparkles, Filter, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CategoryManager } from "./CategoryManager";
import { VariantManager } from "./VariantManager";
import { useLanguage } from "@/context/language-context";

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    is_visible?: boolean;
    category_id?: string;
}

export function MenuGrid({ initialItems, categories, restaurantId, currency }: { initialItems: MenuItem[], categories: any[], restaurantId: string, currency: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [localCategories, setLocalCategories] = useState(categories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const supabase = createClient();
    const { t, direction } = useLanguage();

    const initialFormState = { id: "", name: "", description: "", price: "", image_url: "", is_available: true, is_visible: true, category_id: "" };
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    // Category Creation
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    const getCurrencySymbol = (code: string) => {
        if (code === 'QAR') return 'QR';
        if (code === 'MAD') return 'DH';
        return '$';
    };

    const currencySymbol = getCurrencySymbol(currency);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAdd = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsDialogOpen(true);
        setSelectedCurrency(currency);
        setIsCreatingCategory(false);
        setNewCategoryName("");
    };

    const openEdit = (item: MenuItem) => {
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.price.toString(),
            image_url: item.image_url || "",
            is_available: item.is_available,
            is_visible: item.is_visible !== false,
            category_id: item.category_id || ""
        });
        setIsEditing(true);
        setIsDialogOpen(true);
        setSelectedCurrency(currency);
        setIsCreatingCategory(false);
        setNewCategoryName("");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${restaurantId}/menu-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('restaurant-assets')
            .upload(fileName, file);

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            toast.error("Error uploading image");
            setLoading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('restaurant-assets')
            .getPublicUrl(fileName);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setLoading(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (selectedCurrency !== currency) {
                const { error: currError } = await supabase
                    .from('restaurants')
                    .update({ currency: selectedCurrency })
                    .eq('id', restaurantId);

                if (currError) {
                    console.error("Currency Update Error", currError);
                    toast.error("Failed to update store currency");
                } else {
                    toast.success(`Store currency updated to ${selectedCurrency}`);
                }
            }

            let categoryId = formData.category_id;
            if (isCreatingCategory && newCategoryName.trim()) {
                const { data: newCat, error: catError } = await supabase
                    .from('categories')
                    .insert({
                        restaurant_id: restaurantId,
                        name: newCategoryName.trim(),
                        sort_order: (localCategories.length * 10)
                    })
                    .select()
                    .single();

                if (catError) throw catError;
                setLocalCategories([...localCategories, newCat]);
                categoryId = newCat.id;
                toast.success(`Category '${newCategoryName}' created!`);
            }

            const payload = {
                restaurant_id: restaurantId,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                image_url: formData.image_url || null,
                is_available: formData.is_available,
                is_visible: formData.is_visible,
                category_id: categoryId || null
            };

            if (isEditing) {
                const { data, error } = await supabase.from('menu_items')
                    .update(payload)
                    .eq('id', formData.id)
                    .select().single();
                if (error) throw error;
                setItems(items.map(i => i.id === formData.id ? data : i));
                toast.success("Item updated successfully");
            } else {
                const { data, error } = await supabase.from('menu_items')
                    .insert(payload)
                    .select().single();
                if (error) throw error;
                setItems([data, ...items]);
                toast.success("Item added successfully");
            }

            setIsDialogOpen(false);
            router.refresh();
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Error saving item:", error);
            toast.error(error.message || "Failed to save item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const { error } = await supabase.from('menu_items').delete().eq('id', id);
            if (error) throw error;
            setItems(items.filter(i => i.id !== id));
            toast.success("Item deleted");
            router.refresh();
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white space-y-12">

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)]">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-white mb-1">
                                    {t('menuPage.title')}
                                </h1>
                                <Badge variant="outline" className="h-7 px-3 rounded-full border-zinc-700 bg-zinc-900/50 text-zinc-400 font-mono text-xs backdrop-blur-md">
                                    {items.length} {t('menuPage.itemsCount')}
                                </Badge>
                            </div>
                            <p className="text-zinc-400 font-medium">{t('menuPage.subtitle')}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 lg:w-80 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center px-4 h-12 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/30">
                            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('menuPage.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder:text-zinc-600 ml-3 rtl:mr-3 rtl:ml-0 font-medium"
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="h-12 px-6 rounded-2xl bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/20 transition-all backdrop-blur-md"
                    >
                        <GripVertical className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {t('menuPage.categories')}
                    </Button>

                    <Button
                        onClick={openAdd}
                        className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 stroke-[3px]" />
                        {t('menuPage.newItem')}
                    </Button>
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />

                            <div
                                onClick={() => openEdit(item)}
                                className="relative h-full bg-[#09090b] border border-white/5 rounded-[1.8rem] overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-500 shadow-2xl cursor-pointer"
                            >

                                {/* Image Container */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                                    {item.image_url ? (
                                        <>
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent opacity-80" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                                            <ImageIcon className="w-12 h-12 opacity-50" />
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Image</span>
                                        </div>
                                    )}

                                    {/* Action Buttons (Floating) */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 hover:scale-110 shadow-lg"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 hover:scale-110 shadow-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Badges */}
                                    <div className={cn("absolute top-4 flex flex-col gap-2", direction === 'rtl' ? "right-4" : "left-4")}>
                                        {!item.is_available && item.is_visible !== false && (
                                            <Badge variant="destructive" className="bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-md shadow-lg">{t('menuPage.dialog.status.soldOut')}</Badge>
                                        )}
                                        {item.is_visible === false && (
                                            <Badge className="bg-zinc-800/80 text-zinc-400 border border-zinc-700 backdrop-blur-md shadow-lg">{t('menuPage.dialog.status.hidden')}</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 pt-0 flex flex-col flex-1 relative z-10 -mt-12">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="inline-flex px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold font-mono text-sm shadow-xl shadow-emerald-500/20 mb-2">
                                            {currencySymbol}{item.price.toFixed(2)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                                        {item.description || "No description provided."}
                                    </p>

                                    {/* Simple Category Tag if exists */}
                                    {item.category_id && categories.find(c => c.id === item.category_id) && (
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                                                {categories.find(c => c.id === item.category_id)?.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center text-zinc-500">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-300 mb-2">{t('menuPage.noItems.title')}</h3>
                    <p className="max-w-xs mx-auto">{t('menuPage.noItems.desc')}</p>
                </div>
            )}

            {/* KEEPING THE MANAGERS AND DIALOGS SAME AS BEFORE BUT WITH UPDATED STYLING IF NEEDED IN THE DIALOG CONTENT, WHICH IS ALREADY DARK MODE COMPATIBLE */}
            <CategoryManager
                categories={localCategories}
                isOpen={isCategoryManagerOpen}
                onClose={() => setIsCategoryManagerOpen(false)}
                onUpdate={(newCategories) => {
                    setLocalCategories(newCategories);
                    router.refresh();
                }}
                restaurantId={restaurantId}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full max-h-[90vh] flex flex-col bg-[#09090b] border-zinc-800 text-zinc-100 shadow-2xl p-0 overflow-hidden ring-1 ring-white/10">
                    <DialogHeader className="px-6 py-6 border-b border-zinc-800 bg-zinc-900/50 text-start">
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                {isEditing ? <Edit2 className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <span className="font-display">{isEditing ? t('menuPage.dialog.editTitle') : t('menuPage.dialog.newTitle')}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-start">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400 font-medium text-xs uppercase tracking-wider">{t('menuPage.dialog.labels.name')}</Label>
                            <Input
                                id="name"
                                className="bg-zinc-900/50 border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-12 text-base placeholder:text-zinc-600 rounded-xl"
                                placeholder={t('menuPage.dialog.labels.namePlaceholder')}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Price Input with Unified Currency Select */}
                            <div className="col-span-12 sm:col-span-5 space-y-2">
                                <Label htmlFor="price" className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">{t('menuPage.dialog.labels.price')}</Label>
                                <div className="flex rounded-xl bg-zinc-900/50 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden h-12">
                                    <div className="flex-1 relative">
                                        <span className={cn("absolute top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm pointer-events-none z-10", direction === 'rtl' ? "right-4" : "left-4")}>
                                            {currencySymbol}
                                        </span>
                                        <Input
                                            id="price"
                                            type="number"
                                            className={cn(
                                                "bg-transparent border-none focus:ring-0 focus:border-none h-full font-mono text-lg font-medium shadow-none text-zinc-100 placeholder:text-zinc-700",
                                                direction === 'rtl' ? "pr-10 pl-3" : "pl-10 mr-3"
                                            )}
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-px bg-zinc-800 my-2" />
                                    <div className="relative w-20 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                                        <select
                                            className="w-full h-full bg-transparent text-xs font-bold text-zinc-400 focus:outline-none appearance-none pl-3 pr-2 cursor-pointer hover:text-emerald-400 transition-colors text-center"
                                            value={selectedCurrency}
                                            onChange={(e) => setSelectedCurrency(e.target.value)}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="MAD">MAD</option>
                                            <option value="QAR">QAR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Status Selection */}
                            <div className="col-span-12 sm:col-span-7 space-y-2">
                                <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">{t('menuPage.dialog.labels.status')}</Label>
                                <div className="relative h-12 px-0">
                                    <select
                                        className="flex h-full w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer hover:bg-zinc-900/80"
                                        value={
                                            !formData.is_visible ? "hidden" :
                                                !formData.is_available ? "sold_out" : "available"
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'hidden') {
                                                setFormData({ ...formData, is_visible: false, is_available: false });
                                            } else if (val === 'sold_out') {
                                                setFormData({ ...formData, is_visible: true, is_available: false });
                                            } else {
                                                setFormData({ ...formData, is_visible: true, is_available: true });
                                            }
                                        }}
                                    >
                                        <option value="available">{t('menuPage.dialog.status.available')}</option>
                                        <option value="sold_out">{t('menuPage.dialog.status.soldOut')}</option>
                                        <option value="hidden">{t('menuPage.dialog.status.hidden')}</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <Filter className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Category Selection */}
                            <div className="space-y-2">
                                <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">{t('menuPage.dialog.labels.category')}</Label>
                                {!isCreatingCategory ? (
                                    <div className="relative h-12 px-0">
                                        <select
                                            className="flex h-full w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer hover:bg-zinc-900/80"
                                            value={formData.category_id}
                                            onChange={(e) => {
                                                if (e.target.value === 'new') {
                                                    setIsCreatingCategory(true);
                                                    setFormData({ ...formData, category_id: "" });
                                                } else {
                                                    setFormData({ ...formData, category_id: e.target.value });
                                                }
                                            }}
                                        >
                                            <option value="">{t('menuPage.dialog.categories.select')}</option>
                                            {localCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                            <option value="new" className="font-bold text-emerald-400 bg-zinc-900">{t('menuPage.dialog.categories.new')}</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex gap-2 h-12"
                                    >
                                        <Input
                                            placeholder={t('menuPage.dialog.categories.placeholder')}
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            autoFocus
                                            className="bg-zinc-900/50 border-emerald-500/50 focus:border-emerald-500 h-full rounded-xl focus:ring-emerald-500/20"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-full w-12 rounded-xl hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
                                            onClick={() => { setIsCreatingCategory(false); setNewCategoryName(""); }}
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-zinc-400 font-medium text-xs uppercase tracking-wider">{t('menuPage.dialog.labels.description')}</Label>
                            <Textarea
                                id="desc"
                                className="bg-zinc-900/50 border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[100px] resize-none rounded-xl"
                                placeholder={t('menuPage.dialog.labels.descPlaceholder')}
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">{t('menuPage.dialog.labels.image')}</Label>
                            <div className="border border-zinc-800/50 rounded-xl p-3 bg-zinc-900/30">
                                <div className="flex gap-4">
                                    {/* Preview Box */}
                                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-black/40 flex items-center justify-center group">
                                        {formData.image_url ? (
                                            <>
                                                <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setFormData({ ...formData, image_url: "" })}>
                                                    <Trash2 className="w-5 h-5 text-white/90" />
                                                </div>
                                            </>
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-zinc-700" />
                                        )}
                                    </div>

                                    {/* Action Area */}
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-emerald-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <label className="relative flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-dashed border-zinc-700 hover:border-emerald-500/50 bg-zinc-900/50 text-zinc-400 hover:text-emerald-400 cursor-pointer transition-all">
                                                <span className="text-xs font-medium">Choose Image File...</span>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-px bg-zinc-800 flex-1" />
                                            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">OR</span>
                                            <div className="h-px bg-zinc-800 flex-1" />
                                        </div>

                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="Paste image URL..."
                                                value={formData.image_url || ""}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="h-9 text-xs bg-zinc-950/50 border-zinc-800 focus:border-zinc-700 rounded-lg text-zinc-400 font-mono pl-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variant Manager Section */}
                    {isEditing && formData.id ? (
                        <div className="pt-6 border-t border-zinc-800/50">
                            <VariantManager menuItemId={formData.id} />
                        </div>
                    ) : (
                        <div className="pt-6 border-t border-zinc-800/50 text-center py-4 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                            <p className="text-zinc-500 text-sm">Save this item first to add choices (Sizes, Sauces, etc.)</p>
                        </div>
                    )}

                    <DialogFooter className="px-6 py-6 border-t border-zinc-800 bg-zinc-900/50 flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl h-12"
                        >
                            {t('menuPage.dialog.cancel')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl h-12 px-8"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    {t('menuPage.dialog.saving')}
                                </span>
                            ) : (
                                t('menuPage.dialog.save')
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
