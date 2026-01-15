
"use client";

import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CategoryTabsProps {
    activeCategory: string;
    onSelect: (id: string) => void;
}

export function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
    return (
        <div className="sticky top-[60px] z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 p-4">
                    <Button
                        variant={activeCategory === "all" ? "default" : "secondary"}
                        onClick={() => onSelect("all")}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "secondary"}
                            onClick={() => onSelect(category.id)}
                            className="rounded-full px-6"
                        >
                            {category.name} {/* Could render icon here too */}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
        </div>
    );
}
