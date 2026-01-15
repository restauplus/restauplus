import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RESTAU PLUS",
  description: "Modern Restaurant Ordering System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "antialiased bg-black")} suppressHydrationWarning>
        <AuthProvider>
          {/* <SmoothScroll> */}
          {children}
          {/* </SmoothScroll> */}
        </AuthProvider>
      </body>
    </html>
  );
}
