import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const WIDTHS = {
    /** Video grids: matches the header and footer edges. */
    wide: "max-w-[1600px]",
    /** Lists such as "My videos". */
    default: "max-w-5xl",
    /** Forms and single-column reading. */
    narrow: "max-w-xl",
};

export default function PageContainer({
    width = "wide",
    className,
    children,
}: {
    width?: keyof typeof WIDTHS;
    className?: string;
    children: ReactNode;
}) {
    return <div className={cn("mx-auto w-full px-4 pt-8 sm:px-6 lg:px-8", WIDTHS[width], className)}>{children}</div>;
}
