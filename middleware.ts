import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Check if the request is for the embed route
    if (request.nextUrl.pathname.startsWith('/embed/')) {
        // Allow CORS for all origins
        response.headers.set('Access-Control-Allow-Origin', '*');

        // Allow specific methods
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

        // Allow specific headers
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Set max age for preflight requests
        response.headers.set('Access-Control-Max-Age', '86400');
    }

    return response;
}

export const config = {
    matcher: '/embed/:path*',
};