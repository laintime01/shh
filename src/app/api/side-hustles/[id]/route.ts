// src/app/api/side-hustles/[id]/route.ts - 单个副业信息操作
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const result = await SideHustleDB.getById(params.id);
      
      if (!result) {
        return Response.json(
          { success: false, message: '未找到该项目' },
          { status: 404 }
        );
      }
  
      // 增加浏览次数
      await SideHustleDB.incrementViews(params.id);
  
      return Response.json({ success: true, data: result });
    } catch (error) {
      console.error('Get side hustle error:', error);
      return Response.json(
        { success: false, message: '获取数据失败' },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const user = verifyAuthToken(request);
      if (!user) {
        return Response.json(
          { success: false, message: '未授权访问' },
          { status: 401 }
        );
      }
  
      const data = await request.json();
      const result = await SideHustleDB.update(params.id, data);
  
      if (!result) {
        return Response.json(
          { success: false, message: '未找到该项目' },
          { status: 404 }
        );
      }
  
      return Response.json({
        success: true,
        data: result,
        message: '更新成功'
      });
    } catch (error) {
      console.error('Update side hustle error:', error);
      return Response.json(
        { success: false, message: '更新失败' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const user = verifyAuthToken(request);
      if (!user || user.role !== 'admin') {
        return Response.json(
          { success: false, message: '需要管理员权限' },
          { status: 403 }
        );
      }
  
      const success = await SideHustleDB.delete(params.id);
  
      if (!success) {
        return Response.json(
          { success: false, message: '未找到该项目' },
          { status: 404 }
        );
      }
  
      return Response.json({
        success: true,
        message: '删除成功'
      });
    } catch (error) {
      console.error('Delete side hustle error:', error);
      return Response.json(
        { success: false, message: '删除失败' },
        { status: 500 }
      );
    }
  }