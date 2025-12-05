// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Se está tentando acessar rota protegida sem token
  if (!isPublicRoute && !token) {
    // Verificar localStorage via header (workaround)
    const hasLocalStorageToken = request.headers.get('authorization');
    
    if (!hasLocalStorageToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};