import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Auto Repair Shop Management",
  description: "Manage cars, work orders, and repairs for your auto repair shop",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 p-4">
            {children}
        </main>

        <Footer />
        </body>
        </html>
    );
}
