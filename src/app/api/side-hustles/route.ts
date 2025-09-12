// 修复 src/app/api/side-hustles/route.ts
import { NextRequest } from 'next/server';
import { SideHustleDB } from '@/lib/database'; // 添加这行导入
import { verifyAuthToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '全部';
    const status = searchParams.get('status') || 'published';

    if (search || category !== '全部') {
      const results = await SideHustleDB.search(search, category, status);
      return Response.json({ success: true, data: results });
    }

    const results = await SideHustleDB.getAll(status);
    return Response.json({ success: true, data: results });
  } catch (error) {
    const err = error as Error;
    console.error('Get side hustles error:', err.message);
    return Response.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const requiredFields = ['title', 'category', 'description', 'tools', 'pricing', 'difficulty'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return Response.json(
          { success: false, message: `缺少必需字段: ${field}` },
          { status: 400 }
        );
      }
    }

    const newItem = await SideHustleDB.create({
      ...data,
      status: data.status || 'published',
      createdBy: user.userId
    });

    return Response.json({
      success: true,
      data: newItem,
      message: '创建成功'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Create side hustle error:', err.message);
    return Response.json(
      { success: false, message: '创建失败' },
      { status: 500 }
    );
  }
}
