import PageContainer from "@/components/layout/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

/** Shown for unknown URLs (see [...missing]) and missing or failed videos, inside the site chrome. */
export default function NotFound() {
    return (
        <PageContainer>
            <EmptyState
                title="Page not found"
                body="The link may be mistyped, or the video may have been removed."
                action={
                    <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                        Browse videos
                    </Link>
                }
            />
        </PageContainer>
    );
}
