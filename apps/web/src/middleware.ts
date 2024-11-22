import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextURL } from "next/dist/server/web/next-url";

const protectedRoutes = ["/events/purchase", "/dashboard"];

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isProtected = protectedRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    const token = cookieStore.get("access_token")?.value || "";

    if (isProtected && !token) {
      return NextResponse.redirect(new NextURL("/login", req.nextUrl));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("Something went wrong");
    console.log(err);
    return NextResponse.redirect(new NextURL("/login", req.nextUrl));
  };
};

export const config = {
  matcher: ["/dashboard/:path*", "/events/purchase/:path*"],
};
