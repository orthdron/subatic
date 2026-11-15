import Analytics from "@/components/layout/Analytics";
import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Variable width axis: condensed for headings, normal width for body text.
const archivo = Archivo({
    subsets: ["latin"],
    axes: ["wdth"],
    variable: "--font-archivo",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Subatic",
        template: "%s | Subatic",
    },
    description: "Self-hosted video sharing",
    icons: {
        icon: [
            { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: { url: "/favicons/apple-touch-icon.png", sizes: "180x180" },
    },
    manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
    themeColor: "#131217",
    colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        // Browser extensions often add attributes to <html> before React hydrates
        // (e.g. data-gs-image-helper); this only ignores attribute diffs on this element.
        <html lang="en" className={archivo.variable} suppressHydrationWarning>
            <body>
                {children}
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            background: "#25232b",
                            color: "#f3f1f6",
                            border: "1px solid #2e2b35",
                            fontSize: "14px",
                        },
                    }}
                />
                <Analytics />
            </body>
        </html>
    );
}
