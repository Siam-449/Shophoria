
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');

  // Check if the request is coming from the old Netlify domain
  if (host && host.includes('shopshophoria.netlify.app')) {
    // Perform a 301 Permanent Redirect to the new domain
    const newDomain = 'https://www.shophoriabd.com';
    
    // Add a flag so the new site knows they were redirected
    url.searchParams.set('moved', 'true');
    
    const newUrl = `${newDomain}${url.pathname}${url.search}`;
    
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
