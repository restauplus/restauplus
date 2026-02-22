import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RESTAU PLUS",
  description: "Modern Restaurant Ordering System",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark no-scrollbar" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased bg-black")} suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            {/* <SmoothScroll> */}
            {children}
            <Toaster position="top-right" richColors theme="dark" />
            {/* </SmoothScroll> */}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
