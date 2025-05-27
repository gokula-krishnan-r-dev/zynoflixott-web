import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: '/api/upload/media',
}

export function middleware(request: NextRequest) {
    // This middleware doesn't modify the request but allows the config to be applied
    return NextResponse.next()
} 