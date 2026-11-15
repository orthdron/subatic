import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Page not found" };

// Unknown URLs land here so the 404 renders with the site header and footer.
// Without it Next.js falls back to its bare default page outside the (site) layout.
export default function Missing() {
    notFound();
}
