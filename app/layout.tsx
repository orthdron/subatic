import Analytics from '@/components/sections/Analytics';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <Analytics />
            </head>
            <body>{children}</body>
        </html>
    );
}