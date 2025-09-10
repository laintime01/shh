// src/app/api/categories/route.ts - 分类API
export async function GET() {
    try {
      const categories = await SideHustleDB.getCategories();
      return Response.json({ success: true, data: categories });
    } catch (error) {
      const err = error as Error;
      console.error('Get categories error:', err.message);
      return Response.json(
        { success: false, message: '获取分类失败' },
        { status: 500 }
      );
    }
  }