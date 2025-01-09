import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./utils/validation";

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    // manually logout
    // http://reset:reset@localhost:3000/admin

        // Every URL that starts with "/admin" goes through a validation
        if (pathname.startsWith("/admin")) {
            const isAuthenticatedResult = await isAuthenticated(req);

            if (!isAuthenticatedResult) {
                return new NextResponse("Unauthorized", {
                    status: 401,
                    headers: { "WWW-Authenticate": "Basic" },
                });
            }
        }

        return NextResponse.next();
    }

    async function isAuthenticated(req: NextRequest) {
        const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
        if (authHeader == null) return false;

        const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
        return username === process.env.ADMIN_USERNAME && await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string);
    }

    // Middleware config for matching paths
    export const config = {
        matcher: ["/admin/:path*"], // Match both "/admin" routes and "/api/logout"
    };
