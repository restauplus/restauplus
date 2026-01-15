
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    category_id?: string;
}

export function MenuGrid({ initialItems, restaurantId }: { initialItems: MenuItem[], restaurantId: string }) {
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "",
        image_url: ""
    });

    const handleAddItem = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('menu_items').insert({
                restaurant_id: restaurantId,
                name: newItem.name,
                description: newItem.description,
                price: parseFloat(newItem.price),
                image_url: newItem.image_url || null, // Optional
            }).select().single();

            if (error) throw error;
            if (data) {
                setItems([...items, data]);
                setIsAddOpen(false);
                setNewItem({ name: "", description: "", price: "", image_url: "" });
                router.refresh();
            }
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item");
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
            router.refresh();
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
                    <p className="text-muted-foreground">Add or edit items in your digital menu.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Menu Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <Textarea
                                    id="desc"
                                    value={newItem.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewItem({ ...newItem, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddItem} disabled={loading}>
                                {loading ? "Adding..." : "Save Item"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No items found. Create your first menu item!</p>
                    </div>
                )}
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden group">
                        <div className="relative aspect-video bg-muted">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                    <ImageIcon className="h-8 w-8" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="icon">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            {!item.is_available && (
                                <Badge className="absolute top-2 right-2 bg-red-500 text-white">Sold Out</Badge>
                            )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold truncate">{item.name}</CardTitle>
                                <span className="font-semibold">${item.price.toFixed(2)}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 pb-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button variant="outline" className="flex-1 gap-2">
                                <Edit2 className="h-3 w-3" /> Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="shrink-0"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
