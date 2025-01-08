import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ModeToggle } from "@/components/toggleTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Booking App - Foodtel test",
    description: "Foodtel test",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex h-auto sm:h-screen font-sans antialiased flex-col transition-all duration-1000 ease-in-out`}>
                <ThemeProvider>
                    <ModeToggle />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
