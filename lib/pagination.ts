export type PageNumber = number | "ellipsis";

/**
 * Page numbers to show in a pager: a window of `maxVisible` pages around the
 * current one, plus the first and last pages separated by ellipses.
 */
export function getPageNumbers(current: number, total: number, maxVisible = 5): PageNumber[] {
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(current - half, 1);
    const end = Math.min(start + maxVisible - 1, total);

    if (end === total) {
        start = Math.max(end - maxVisible + 1, 1);
    }

    const pages: PageNumber[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (start > 1) {
        if (start > 2) pages.unshift("ellipsis");
        pages.unshift(1);
    }

    if (end < total) {
        if (end < total - 1) pages.push("ellipsis");
        pages.push(total);
    }

    return pages;
}
