"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, ChevronDown, ChevronUp, GripVertical, CheckCircle2, Circle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

interface Variant {
    id: string;
    group_id: string;
    name: string;
    price_adjustment: number;
    is_available: boolean;
}

interface VariantGroup {
    id: string;
    menu_item_id: string;
    name: string;
    selection_type: 'single' | 'multiple';
    min_selection: number;
    max_selection: number;
    is_required: boolean;
    variants?: Variant[];
}

export function VariantManager({ menuItemId }: { menuItemId: string }) {
    const [groups, setGroups] = useState<VariantGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGroupName, setNewGroupName] = useState("");
    const supabase = createClient();
    const { t } = useLanguage();

    useEffect(() => {
        fetchGroups();
    }, [menuItemId]);

    const fetchGroups = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('menu_item_variant_groups')
            .select(`
                *,
                variants:menu_item_variants(*)
            `)
            .eq('menu_item_id', menuItemId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching variants:", error);
            // toast.error("Failed to load variants"); 
        } else {
            // Sort variants within groups
            const sortedData = data?.map(group => ({
                ...group,
                variants: group.variants?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []
            })) || [];
            setGroups(sortedData);
        }
        setLoading(false);
    };

    const addGroup = async () => {
        if (!newGroupName.trim()) return;

        try {
            const { data, error } = await supabase.from('menu_item_variant_groups').insert({
                menu_item_id: menuItemId,
                name: newGroupName,
                selection_type: 'single', // Default
                is_required: false
            }).select().single();

            if (error) throw error;

            setGroups([...groups, { ...data, variants: [] }]);
            setNewGroupName("");
            toast.success("Group created");
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    const deleteGroup = async (groupId: string) => {
        if (!confirm("Delete this group and all its options?")) return;
        try {
            const { error } = await supabase.from('menu_item_variant_groups').delete().eq('id', groupId);
            if (error) throw error;
            setGroups(groups.filter(g => g.id !== groupId));
            toast.success("Group deleted");
        } catch (error) {
            toast.error("Failed to delete group");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                    <Label className="text-zinc-500 font-semibold text-[10px] uppercase tracking-widest pl-1 rtl:pr-1 rtl:pl-0">{t('menuPage.dialog.variants.groupName')}</Label>
                    <div className="flex gap-2">
                        <Input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder={t('menuPage.dialog.variants.groupPlaceholder')}
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 rounded-xl"
                            onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                        />
                        <Button onClick={addGroup} className="rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-white text-zinc-400 transition-colors">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {groups.map((group) => (
                    <GroupCard key={group.id} group={group} onDelete={() => deleteGroup(group.id)} onUpdate={fetchGroups} />
                ))}

                {!loading && groups.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                        <p className="text-sm">{t('menuPage.dialog.variants.noVariants')}</p>
                        <p className="text-xs opacity-50">{t('menuPage.dialog.variants.addDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function GroupCard({ group, onDelete, onUpdate }: { group: VariantGroup, onDelete: () => void, onUpdate: () => void }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [newVariantName, setNewVariantName] = useState("");
    const [newVariantPrice, setNewVariantPrice] = useState("");
    const supabase = createClient();
    const { t } = useLanguage();

    const updateGroup = async (updates: Partial<VariantGroup>) => {
        const { error } = await supabase.from('menu_item_variant_groups').update(updates).eq('id', group.id);
        if (error) toast.error("Failed to update");
        else onUpdate();
    };

    const addVariant = async () => {
        if (!newVariantName.trim()) return;
        try {
            const { error } = await supabase.from('menu_item_variants').insert({
                group_id: group.id,
                name: newVariantName,
                price_adjustment: parseFloat(newVariantPrice) || 0
            });
            if (error) throw error;
            setNewVariantName("");
            setNewVariantPrice("");
            onUpdate();
        } catch (error) {
            toast.error("Failed to add option");
        }
    };

    const deleteVariant = async (variantId: string) => {
        const { error } = await supabase.from('menu_item_variants').delete().eq('id', variantId);
        if (error) toast.error("Failed to delete");
        else onUpdate();
    };

    return (
        <div className="border border-zinc-800 bg-zinc-900/30 rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-zinc-500 hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <span className="font-bold text-zinc-200">{group.name}</span>
                    <Badge variant="outline" className="text-[10px] h-5 border-zinc-700 text-zinc-500 px-2 rounded-md uppercase tracking-wider">
                        {group.selection_type === 'single' ? t('menuPage.dialog.variants.single') : t('menuPage.dialog.variants.multi')}
                    </Badge>
                    {group.is_required && (
                        <Badge className="text-[10px] h-5 bg-red-500/10 text-red-500 border border-red-500/20 px-2 rounded-md uppercase tracking-wider">
                            {t('menuPage.dialog.variants.full')?.replace('?', '') || 'Required'}
                        </Badge>
                    )}
                </div>
                <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 space-y-4"
                    >
                        {/* Settings Row */}
                        <div className="grid grid-cols-2 gap-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400">{t('menuPage.dialog.variants.selectionType')}</span>
                                <div className="flex bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                                    <button
                                        onClick={() => updateGroup({ selection_type: 'single', max_selection: 1 })}
                                        className={`px-3 py-1 rounded-md transition-all ${group.selection_type === 'single' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >{t('menuPage.dialog.variants.single')}</button>
                                    <button
                                        onClick={() => updateGroup({ selection_type: 'multiple', max_selection: 2 })} // Default max 2 just to start
                                        className={`px-3 py-1 rounded-md transition-all ${group.selection_type === 'multiple' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >{t('menuPage.dialog.variants.multi')}</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-400">{t('menuPage.dialog.variants.full')}</span>
                                <div
                                    onClick={() => updateGroup({ is_required: !group.is_required })}
                                    className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${group.is_required ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${group.is_required ? 'translate-x-4' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {/* Variants List */}
                        <div className="space-y-2">
                            {group.variants?.map((variant) => (
                                <div key={variant.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950 border border-zinc-800/50 group/item">
                                    <GripVertical className="w-4 h-4 text-zinc-700" />
                                    <div className="flex-1 text-sm text-zinc-300 font-medium">{variant.name}</div>
                                    <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                                        +{variant.price_adjustment}
                                    </div>
                                    <button onClick={() => deleteVariant(variant.id)} className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-400 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Variant Input */}
                        <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                            <Input
                                placeholder={t('menuPage.dialog.variants.optionName')}
                                value={newVariantName}
                                onChange={(e) => setNewVariantName(e.target.value)}
                                className="bg-transparent border-zinc-800 focus:border-emerald-500/50 h-9 text-sm rounded-lg"
                                onKeyDown={(e) => e.key === 'Enter' && addVariant()}
                            />
                            <Input
                                type="number"
                                placeholder={t('menuPage.dialog.variants.price')}
                                value={newVariantPrice}
                                onChange={(e) => setNewVariantPrice(e.target.value)}
                                className="bg-transparent border-zinc-800 focus:border-emerald-500/50 w-24 h-9 text-sm rounded-lg"
                                onKeyDown={(e) => e.key === 'Enter' && addVariant()}
                            />
                            <Button size="sm" onClick={addVariant} className="h-9 bg-zinc-800 hover:bg-emerald-500 hover:text-white text-zinc-400 rounded-lg">
                                {t('menuPage.dialog.variants.add')}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
