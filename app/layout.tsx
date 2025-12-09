import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Auto Repair Shop Management",
  description: "Manage cars, work orders, and repairs for your auto repair shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    // no-op
  }
})();
                    `.trim(),
                }}
            />
        </head>
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
