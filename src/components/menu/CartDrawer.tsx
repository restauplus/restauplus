
"use client";

import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
    const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
    const [isCheckedOut, setIsCheckedOut] = useState(false);

    const handleCheckout = () => {
        setIsCheckedOut(true);
        setTimeout(() => {
            clearCart();
            setIsCheckedOut(false);
            // In a real app, redirect or show success modal
        }, 2000);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" className="relative rounded-full h-12 w-12 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>

                {isCheckedOut ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold">Order Placed!</h3>
                        <p className="text-muted-foreground text-center">Your order has been sent to the kitchen.</p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-2">
                                    <ShoppingBag className="h-12 w-12 opacity-20" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-4 py-2"
                                            >
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                                                )}
                                                <div className="flex-1 overflow-hidden">
                                                    <h4 className="font-semibold truncate">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </ScrollArea>

                        {items.length > 0 && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax (10%)</span>
                                        <span>${(total * 0.1).toFixed(2)}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${(total * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button className="w-full text-lg h-12" size="lg" onClick={handleCheckout}>
                                    Checkout • ${(total * 1.1).toFixed(2)}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
