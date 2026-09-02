middleware_code = """
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  
  if (request.nextUrl.pathname.startsWith('/admin/studio')) {
    if (token !== "admin_secure_session_token_123") {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/studio/:path*'],
}
"""

with open("src/middleware.ts", "w", encoding="utf-8") as f:
    f.write(middleware_code)
