"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, GripVertical, Plus, Edit2, X, Check } from "lucide-react";
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

export function CategoryManager({ categories, isOpen, onClose, onUpdate, restaurantId }: CategoryManagerProps) {
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const supabase = createClient();
    const { t } = useLanguage();

    // Sync when prop changes
    if (JSON.stringify(categories) !== JSON.stringify(localCategories) && !editingId) {
        setLocalCategories(categories);
    }

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
            onUpdate(updated);
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
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 rtl:pl-1 rtl:pr-0">
                        {localCategories.length === 0 && (
                            <p className="text-zinc-500 text-center text-sm py-4">{t('menuPage.dialog.categories.noCategories')}</p>
                        )}
                        {localCategories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 group">
                                <GripVertical className="w-4 h-4 text-zinc-600 cursor-move" />

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

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => startEdit(cat)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(cat.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
