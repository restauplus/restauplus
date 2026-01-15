
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export function TableInput() {
    const [isOpen, setIsOpen] = useState(false);
    const [table, setTable] = useState("");

    useEffect(() => {
        // Check if table is set in session/local storage
        const savedTable = sessionStorage.getItem("restau_table");
        if (!savedTable) {
            setIsOpen(true);
        } else {
            setTable(savedTable);
        }
    }, []);

    const handleSave = () => {
        if (table) {
            sessionStorage.setItem("restau_table", table);
            setIsOpen(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (table) setIsOpen(open); // Only allow closing if table is set
            }}>
                <DialogContent className="sm:max-w-xs" onInteractOutside={(e) => {
                    if (!table) e.preventDefault();
                }}>
                    <DialogHeader>
                        <DialogTitle className="text-center">Select Your Table</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            Please enter your table number to start ordering.
                        </p>
                        <Input
                            type="number"
                            placeholder="Table Number (e.g. 5)"
                            className="text-center text-lg"
                            value={table}
                            onChange={(e) => setTable(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave} className="w-full" disabled={!table}>
                            Start Ordering
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
