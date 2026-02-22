"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Plus, Edit2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Reorder, useDragControls } from "framer-motion";
import { useLanguage } from "@/context/language-context";

interface Category {
    id: string;
    name: string;
    sort_order: number;
}

interface CategoryManagerProps {
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (categories: Category[]) => void;
    restaurantId: string;
}

const CategoryItem = ({
    cat,
    editingId,
    editName,
    startEdit,
    saveEdit,
    setEditName,
    handleDelete
}: {
    cat: Category;
    editingId: string | null;
    editName: string;
    startEdit: (cat: Category) => void;
    saveEdit: () => void;
    setEditName: (s: string) => void;
    handleDelete: (id: string) => void;
}) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={cat}
            id={cat.id}
            dragListener={false}
            dragControls={controls}
            className="flex items-center gap-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 group select-none touch-none"
        >
            <div
                onPointerDown={(e) => controls.start(e)}
                className="cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none"
            >
                <GripVertical className="w-4 h-4 text-zinc-600 hover:text-zinc-400 transition-colors" />
            </div>

            {editingId === cat.id ? (
                <div className="flex-1 flex gap-2">
                    <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 bg-black border-zinc-700 text-sm"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500" onClick={saveEdit}>
                        <Check className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
            )}

            <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => startEdit(cat)}>
                    <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Reorder.Item>
    );
};

export function CategoryManager({ categories, isOpen, onClose, onUpdate, restaurantId }: CategoryManagerProps) {
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const supabase = createClient();
    const { t } = useLanguage();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync only when opening or when props change explicitly
    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    // Persist to DB
    const persistOrder = async (cats: Category[]) => {
        const updates = cats.map((cat, index) => ({
            id: cat.id,
            sort_order: index,
            restaurant_id: restaurantId
        }));

        const { error } = await supabase
            .from('categories')
            .upsert(updates)
            .select();

        if (error) {
            console.error("Failed to save order", error);
            toast.error("Failed to save order");
        }
    };

    // Handle Reorder with Debounce
    const handleReorder = (newOrder: Category[]) => {
        setLocalCategories(newOrder);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            persistOrder(newOrder);
        }, 1500);
    };

    // Save on Close wrapper
    const handleCloseWrapper = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            persistOrder(localCategories);
            onUpdate(localCategories);
        } else {
            // Check dirty
            const currentIds = localCategories.map(c => c.id).join(',');
            const propIds = categories.map(c => c.id).join(',');
            if (currentIds !== propIds) {
                persistOrder(localCategories);
                onUpdate(localCategories);
            }
        }
        onClose();
    };


    const handleAdd = async () => {
        if (!newItemName.trim()) return;
        try {
            const { data, error } = await supabase.from('categories').insert({
                restaurant_id: restaurantId,
                name: newItemName.trim(),
                sort_order: localCategories.length * 10
            }).select().single();

            if (error) throw error;

            const updated = [...localCategories, data];
            setLocalCategories(updated);
            onUpdate(updated); // Parent update is fine here
            setNewItemName("");
            toast.success("Category added");
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete category? Items will be uncategorized.")) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            const updated = localCategories.filter(c => c.id !== id);
            setLocalCategories(updated);
            onUpdate(updated);
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const saveEdit = async () => {
        if (!editingId || !editName.trim()) return;
        try {
            const { error } = await supabase.from('categories').update({ name: editName }).eq('id', editingId);
            if (error) throw error;

            const updated = localCategories.map(c => c.id === editingId ? { ...c, name: editName } : c);
            setLocalCategories(updated);
            onUpdate(updated);
            setEditingId(null);
            toast.success("Category renamed");
        } catch (error) {
            toast.error("Failed to update category");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseWrapper()}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-zinc-500" />
                        {t('menuPage.dialog.categories.manageTitle')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Add New */}
                    <div className="flex gap-2">
                        <Input
                            placeholder={t('menuPage.dialog.categories.placeholder')}
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="bg-zinc-900 border-zinc-800 focus:border-emerald-500"
                        />
                        <Button onClick={handleAdd} size="icon" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* List */}
                    <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                        {localCategories.length === 0 && (
                            <p className="text-zinc-500 text-center text-sm py-4">{t('menuPage.dialog.categories.noCategories')}</p>
                        )}

                        <Reorder.Group axis="y" values={localCategories} onReorder={handleReorder} className="space-y-2">
                            {localCategories.map((cat) => (
                                <CategoryItem
                                    key={cat.id}
                                    cat={cat}
                                    editingId={editingId}
                                    editName={editName}
                                    startEdit={startEdit}
                                    saveEdit={saveEdit}
                                    setEditName={setEditName}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </Reorder.Group>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
