import { NextRequest, NextResponse } from 'next/server';

// Embeds are loaded in iframes on other sites, so allow cross-origin requests.
export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    if (request.nextUrl.pathname.startsWith('/embed/')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400');
    }

    return response;
}

export const config = {
    matcher: '/embed/:path*',
};
