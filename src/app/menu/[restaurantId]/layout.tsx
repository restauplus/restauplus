
import { CartProvider } from "@/context/CartContext";

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-muted/20 pb-20">
                {children}
            </div>
        </CartProvider>
    );
}
