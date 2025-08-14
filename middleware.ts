import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = !!(request.cookies.get('better-auth.session_token'))
  const { pathname } = request.nextUrl
  // Routes publiques (accessibles sans authentification)
  const publicRoutes = ['/', '/auth' ,'/signin', '/signup', '/about']
  const authRoutes = ['/auth', '/auth/signin', '/auth/signup']
  // Routes protégées (nécessitent une authentification)
  const protectedRoutes = ['/dashboard', '/profile', '/admin']
  
  // Routes admin (nécessitent des privilèges admin)
  const adminRoutes = ['/admin']


  if(authRoutes.includes(pathname) && token){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Vérifier si la route est publique
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Vérifier si l'utilisateur est authentifié pour les routes protégées
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Vérifier les privilèges admin pour les routes admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Ici vous pouvez ajouter une vérification du rôle admin
    // const userRole = getUserRoleFromToken(token)
    // if (userRole !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
