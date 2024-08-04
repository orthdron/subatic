import Footer from "@/components/sections/Footer";
import NavBar from "@/components/sections/NavBar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subatic",
  description: "Video hosting for all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <NavBar />
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
