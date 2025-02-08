// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   console.log('Middleware is running for:', req.url); // Log the URL being accessed

//   // Get the token from the cookies
//   const token = req.cookies.get('token')?.value;

//   console.log('Token from cookies:', token); // Log the token value to check if it's being retrieved

//   // If the token does not exist or is invalid, redirect to the login page
//   if (!token || token !== 'true') {
//     console.log('Redirecting to login'); // Log if redirection is happening
//     return NextResponse.redirect(new URL('/login', req.url)); // Redirect to /login
//   }

//   // If the token is valid, allow the request to proceed
//   return NextResponse.next();
// }

// // Apply this middleware only to the /Admin/Dashboard route
// export const config = {
//   matcher: ['/Admin/Dashboard'], // Protect only the /Admin/Dashboard route
// };


import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('isAuthenticated')?.value === 'true';

  // Redirect to login if not authenticated and trying to access dashboard routes
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (isAuthenticated && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/Admin/Dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Admin/Dashboard', '/dashboard/:path*'],
};