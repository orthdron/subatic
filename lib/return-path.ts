const PLACEHOLDER_ORIGIN = "http://return-path.invalid";
const AUTH_PAGES = /^\/(sign-in|sign-up|sign-out)(\/|$)/;

/**
 * Where to send someone after they sign in: a path on this site, or "/" for
 * anything else. Resolving against a placeholder origin catches every way of
 * escaping to another host ("//evil.com", "/\evil.com", tabs or newlines in
 * the path), so the ?next= parameter can't be used as an open redirect.
 */
export function safeReturnPath(value: string | string[] | undefined | null): string {
    const raw = Array.isArray(value) ? value[0] : value;
    if (!raw || !raw.startsWith("/")) {
        return "/";
    }
    let url: URL;
    try {
        url = new URL(raw, PLACEHOLDER_ORIGIN);
    } catch {
        return "/";
    }
    // Dot segments can normalise "/..//evil.com" into "//evil.com", which a
    // browser reads as another host, so check the resolved path as well.
    if (url.origin !== PLACEHOLDER_ORIGIN || url.pathname.startsWith("//") || AUTH_PAGES.test(url.pathname)) {
        return "/";
    }
    return url.pathname + url.search + url.hash;
}

/** The sign-in page, set to come back to `returnTo` afterwards. */
export function signInPath(returnTo: string): string {
    return `/sign-in?next=${encodeURIComponent(returnTo)}`;
}

/** `href` plus ?next= when there is somewhere other than home to return to. */
export function withReturnPath(href: string, returnTo: string): string {
    return returnTo === "/" ? href : `${href}?next=${encodeURIComponent(returnTo)}`;
}
