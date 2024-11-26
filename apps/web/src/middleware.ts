import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextURL } from "next/dist/server/web/next-url";
import { jwtDecode } from "jwt-decode";
import { AccessTokenOrganizer, AccessTokenUser } from "./interfaces/accesstokens";

const protectedRoutes = ["/events/purchase", "/dashboard"];

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    console.log("middleware hello");
    const isProtected = protectedRoutes.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    const token = cookieStore.get("access_token")?.value || "";
    const sessionToken = cookieStore.get("access_token_session")?.value || "";

    if (isProtected && !token && !sessionToken) {
      return NextResponse.redirect(new NextURL("/login", req.nextUrl));
    };

    let decodedToken: AccessTokenUser | AccessTokenOrganizer | null = null;
    if (token) {
      decodedToken = jwtDecode(token);
    } else if (sessionToken) {
      decodedToken = jwtDecode(sessionToken);
    };

    if (isProtected && req.nextUrl.pathname.startsWith("/events/purchase") && decodedToken?.role !== "user") {
      return NextResponse.redirect(new NextURL("/events" + req.nextUrl.pathname.slice(16), req.nextUrl));
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
