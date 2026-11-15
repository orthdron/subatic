import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <div className="mx-auto w-full max-w-sm px-4 pt-16 sm:pt-24">{children}</div>;
}
