import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { logUserAction } from './lib/monitoring';

export async function middleware(request: NextRequest) {
  // Skip logging for auth endpoints and monitoring endpoint
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/monitoring')
  ) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.next();
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.next();
  }

  // Determine the action based on the HTTP method
  let action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  switch (request.method) {
    case 'POST':
      action = 'CREATE';
      break;
    case 'GET':
      action = 'READ';
      break;
    case 'PUT':
    case 'PATCH':
      action = 'UPDATE';
      break;
    case 'DELETE':
      action = 'DELETE';
      break;
    default:
      return NextResponse.next();
  }

  // Extract entity from URL path
  const pathParts = request.nextUrl.pathname.split('/');
  const entity = pathParts[2]; // e.g., /api/bands/123 -> bands
  const entityId = parseInt(pathParts[3], 10);

  if (entity && !isNaN(entityId)) {
    // Log the action asynchronously
    logUserAction(decoded.userId, action, entity, entityId).catch(console.error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 