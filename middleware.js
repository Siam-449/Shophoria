
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // Check if the request is coming from the old Netlify domain
  if (host && host.includes('shopshophoria.netlify.app')) {
    // Perform a 301 Permanent Redirect to the new domain
    const newDomain = 'https://www.shophoriabd.com';
    const newUrl = `${newDomain}${url.pathname}${url.search}`;
    
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

// Only run middleware on page routes, not static assets or API
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
