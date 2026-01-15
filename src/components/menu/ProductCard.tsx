
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Plus } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    popular?: boolean;
}

export function ProductCard({ product }: { product: ProductProps }) {
    const { addItem } = useCart();

    // 3D Card Effect
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="perspective-1000 h-full"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                className="h-full"
            >
                <Card className="overflow-hidden h-full flex flex-col border-border/50 bg-card/80 backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <motion.div
                            style={{ transform: "translateZ(20px)" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; // Fallback food image
                                }}
                            />
                        </motion.div>

                        {product.popular && (
                            <div className="absolute top-2 left-2 z-10">
                                <motion.span
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="inline-flex items-center rounded-full bg-amber-500/90 backdrop-blur px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm ring-1 ring-white/20"
                                >
                                    Popular
                                </motion.span>
                            </div>
                        )}

                        {/* Add Button Gradient overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 flex items-end justify-center">
                            <Button
                                className="w-full shadow-lg font-semibold tracking-wide"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addItem(product)
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add to Order
                            </Button>
                        </div>
                    </div>

                    <CardContent className="flex-1 p-5 space-y-3 relative bg-card/50">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                            <span className="font-bold text-primary whitespace-nowrap bg-primary/10 px-2 py-0.5 rounded-md">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    </CardContent>

                    {/* Mobile-only visible add button for better UX on touch */}
                    <div className="p-4 pt-0 block sm:hidden">
                        <Button
                            variant="secondary"
                            className="w-full"
                            size="sm"
                            onClick={() => addItem(product)}
                        >
                            Add ${product.price.toFixed(2)}
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
