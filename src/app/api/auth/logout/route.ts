// src/app/api/auth/logout/route.ts - 登出API
export async function POST() {
    const response = Response.json({
      success: true,
      message: '登出成功'
    });
  
    // 清除cookie
    response.headers.set(
      'Set-Cookie',
      `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
    );
  
    return response;
  }