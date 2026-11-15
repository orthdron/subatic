import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getPageNumbers } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/** Server-rendered pager. `hrefForPage` builds the link for a page number. */
export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  className,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      {hasPrevious ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className={buttonVariants({ variant: "ghost", size: "sm", className: "pl-2" })}
        >
          <ChevronLeft aria-hidden />
          Previous
        </Link>
      ) : (
        <span className={buttonVariants({ variant: "ghost", size: "sm", className: "pl-2 opacity-35" })} aria-hidden>
          <ChevronLeft />
          Previous
        </span>
      )}

      <ul className="hidden items-center gap-1 sm:flex">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="w-9 text-center text-usher" aria-hidden>
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={hrefForPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "tabular-nums",
                  page === currentPage && "bg-screen text-auditorium hover:bg-screen hover:text-auditorium"
                )}
              >
                {page}
              </Link>
            </li>
          )
        )}
      </ul>
      <p className="px-3 text-sm tabular-nums text-usher sm:hidden">
        Page {currentPage} of {totalPages}
      </p>

      {hasNext ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          className={buttonVariants({ variant: "ghost", size: "sm", className: "pr-2" })}
        >
          Next
          <ChevronRight aria-hidden />
        </Link>
      ) : (
        <span className={buttonVariants({ variant: "ghost", size: "sm", className: "pr-2 opacity-35" })} aria-hidden>
          Next
          <ChevronRight />
        </span>
      )}
    </nav>
  );
}
