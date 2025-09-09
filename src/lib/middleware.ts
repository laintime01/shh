// src/lib/middleware.ts - 中间件工具
import { NextRequest } from 'next/server';
import { AuthService } from './auth';

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 也可以从cookie中获取
  return request.cookies.get('auth-token')?.value || null;
}

export function verifyAuthToken(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return AuthService.verifyToken(token);
}

export function createAuthResponse(success: boolean, data?: any, message?: string) {
  return Response.json({
    success,
    data,
    message
  }, {
    status: success ? 200 : 401
  });
}