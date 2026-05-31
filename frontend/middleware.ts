import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Bypassing Supabase temporarily to isolate the Vercel crash
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
