
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Image as ImageIcon, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    category_id?: string;
}

export function MenuGrid({ initialItems, categories, restaurantId, currency }: { initialItems: MenuItem[], categories: any[], restaurantId: string, currency: string }) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [localCategories, setLocalCategories] = useState(categories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const initialFormState = { id: "", name: "", description: "", price: "", image_url: "", is_available: true, category_id: "" };
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    // Category Creation
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

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

    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    const openAdd = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsDialogOpen(true);
        setSelectedCurrency(currency);
        setIsCreatingCategory(false); // Reset
        setNewCategoryName(""); // Reset
    };

    const openEdit = (item: MenuItem) => {
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: item.price.toString(),
            image_url: item.image_url || "",
            is_available: item.is_available,
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
            // Update currency if changed
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

            // HANDLE CATEGORY CREATION
            if (isCreatingCategory && newCategoryName.trim()) {
                const { data: newCat, error: catError } = await supabase
                    .from('categories')
                    .insert({
                        restaurant_id: restaurantId,
                        name: newCategoryName.trim(),
                        sort_order: (localCategories.length * 10) // Basic sort logic
                    })
                    .select()
                    .single();

                if (catError) throw catError;

                // Update local state immediately
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
        } catch (error: any) {
            console.error("Error saving item (Full Details):", error);
            const msg = error?.message || error?.details || "Failed to save item";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
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
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight glow-text text-primary">Menu Management</h1>
                    <p className="text-muted-foreground">Manage your culinary offerings.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search menu..."
                            className="pl-9 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openAdd} className="gap-2 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" /> Add Item
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl bg-zinc-950/95 backdrop-blur-xl border-zinc-800/50 text-zinc-100 shadow-2xl shadow-black/80 p-0 overflow-hidden gap-0 ring-1 ring-white/10">
                    <DialogHeader className="px-6 py-5 border-b border-zinc-800/50 bg-zinc-900/20">
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                {isEditing ? <Edit2 className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                            </div>
                            <span className="font-display">{isEditing ? "Edit Creation" : "New Creation"}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400 font-medium text-xs uppercase tracking-wider">Item Name</Label>
                            <Input
                                id="name"
                                className="bg-zinc-900/50 border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-11 text-base placeholder:text-zinc-600"
                                placeholder="e.g. Truffle Mushroom Burger"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Price Input with Unified Currency Select */}
                            <div className="col-span-12 sm:col-span-5 space-y-2">
                                <Label htmlFor="price" className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">Price</Label>
                                <div className="flex rounded-xl bg-zinc-900/50 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden h-12">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm pointer-events-none z-10">
                                            {currencySymbol}
                                        </span>
                                        <Input
                                            id="price"
                                            type="number"
                                            className="pl-9 bg-transparent border-none focus:ring-0 focus:border-none h-full font-mono text-lg font-medium shadow-none text-zinc-100 placeholder:text-zinc-700"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-px bg-zinc-800 my-2" />
                                    <div className="relative w-24 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
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

                            {/* Category Selection */}
                            <div className="col-span-12 sm:col-span-7 space-y-2">
                                <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">Category</Label>
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
                                            <option value="">Select Category...</option>
                                            {localCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                            <option value="new" className="font-bold text-emerald-400 bg-zinc-900">+ New Category</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex gap-2 h-12"
                                    >
                                        <Input
                                            placeholder="Category Name"
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
                            <Label htmlFor="desc" className="text-zinc-400 font-medium text-xs uppercase tracking-wider">Description</Label>
                            <Textarea
                                id="desc"
                                className="bg-zinc-900/50 border-zinc-800 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[80px] resize-none"
                                placeholder="Describe the ingredients, taste, and story..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1">Visual Asset</Label>
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

                    <DialogFooter className="px-6 py-4 bg-zinc-900/40 border-t border-zinc-800/50 flex flex-col-reverse sm:flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-lg px-8"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Saving
                                </span>
                            ) : (
                                "Save Item"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence>
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden group border-muted/40 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all hover:shadow-xl hover:shadow-primary/5">
                                <div className="relative aspect-video overflow-hidden">
                                    {item.image_url ? (
                                        <div className="w-full h-full relative">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                                            <ImageIcon className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 right-2 backdrop-blur-md bg-black/50 hover:bg-black/70 border-white/10 text-white">
                                        {currencySymbol} {item.price.toFixed(2)}
                                    </Badge>
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg font-bold truncate">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 pb-4 flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{item.description}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                    <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={() => openEdit(item)}>
                                        <Edit2 className="h-3 w-3" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No items found.</p>
                </div>
            )}
        </div>
    );
}
