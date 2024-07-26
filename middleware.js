import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (!token && pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
    }

    return NextResponse.next();
}
