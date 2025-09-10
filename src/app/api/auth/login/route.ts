// src/app/api/auth/login/route.ts - 登录API
import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    const user = await AuthService.authenticateUser(email, password);
    
    if (!user) {
      return Response.json(
        { success: false, message: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const response = Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      }
    });

    // 设置HTTP-only cookie
    response.headers.set(
      'Set-Cookie',
      `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

