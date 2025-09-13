// src/lib/database.ts - 修复所有类型错误
import { ObjectId, Document } from 'mongodb';
import clientPromise, { getConnectionStatus } from './mongodb';
import { SideHustle, AdminUser } from './types';

const DB_NAME = 'side-hustle-hub';
const COLLECTION_SIDE_HUSTLES = 'side_hustles';
const COLLECTION_USERS = 'users';

// MongoDB 查询接口
interface MongoQuery {
  [key: string]: unknown;
  status?: string;
  category?: string;
  $or?: Array<{
    [key: string]: unknown;
  }>;
}

interface MongoIdQuery {
  [key: string]: unknown;
  _id?: ObjectId;
  id?: number;
  $or?: Array<{
    _id?: ObjectId;
    id?: number;
  }>;
}

// 副业信息相关操作
export class SideHustleDB {
  // 检查连接状态
  static async checkConnection(): Promise<boolean> {
    const status = getConnectionStatus();
    if (!status.isConnected) {
      console.error('⚠️  数据库未连接，使用静态数据作为后备');
      return false;
    }
    return true;
  }

  static async getAll(status: string = 'published'): Promise<SideHustle[]> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_SIDE_HUSTLES);
      
      const query: MongoQuery = status === 'all' ? {} : { status };
      const result = await collection
        .find(query)
        .sort({ featured: -1, lastUpdated: -1 })
        .toArray();
      
      console.log(`📖 从 MongoDB 获取到 ${result.length} 条副业数据`);
      
      return result.map(item => ({
        ...item,
        _id: item._id?.toString()
      })) as SideHustle[];
      
    } catch (error) {
      const err = error as Error;
      console.error('❌ 获取数据失败:', err.message);
      console.log('💡 数据库连接失败，请检查连接状态');
      return [];
    }
  }

  static async getById(id: string): Promise<SideHustle | null> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_SIDE_HUSTLES);
      
      // 构建查询条件，处理 ObjectId 和数字 ID
      let query: MongoIdQuery;
      
      // 检查是否是有效的 ObjectId
      if (ObjectId.isValid(id) && id.length === 24) {
        // 如果是 24 位的有效 ObjectId，同时查询 _id 和数字 id
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          query = {
            $or: [
              { _id: new ObjectId(id) },
              { id: numericId }
            ]
          };
        } else {
          query = { _id: new ObjectId(id) };
        }
      } else {
        // 如果不是 ObjectId，尝试作为数字 ID
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          query = { id: numericId };
        } else {
          // 如果都不是，返回 null
          return null;
        }
      }
      
      const result = await collection.findOne(query);
      
      if (!result) return null;
      
      return {
        ...result,
        _id: result._id?.toString()
      } as SideHustle;
      
    } catch (error) {
      const err = error as Error;
      console.error('获取单个项目失败:', err.message);
      return null;
    }
  }

  static async create(data: Omit<SideHustle, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<SideHustle> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_SIDE_HUSTLES);
    
    // 生成新的数字ID
    const lastItem = await collection.findOne({}, { sort: { id: -1 } });
    const newId = (lastItem?.id || 0) + 1;
    
    const newItem = {
      ...data,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    };
    
    const result = await collection.insertOne(newItem);
    
    console.log(`✅ 新增副业项目: ${data.title}`);
    
    return {
      ...newItem,
      _id: result.insertedId.toString()
    } as SideHustle;
  }

  static async update(id: string, data: Partial<SideHustle>): Promise<SideHustle | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_SIDE_HUSTLES);
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    // 构建查询条件，处理 ObjectId 和数字 ID
    let query: MongoIdQuery;
    
    if (ObjectId.isValid(id) && id.length === 24) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        query = {
          $or: [
            { _id: new ObjectId(id) },
            { id: numericId }
          ]
        };
      } else {
        query = { _id: new ObjectId(id) };
      }
    } else {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        query = { id: numericId };
      } else {
        return null;
      }
    }
    
    const result = await collection.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result || !result.value) return null;
    
    const updatedItem = result.value;
    console.log(`✅ 更新副业项目: ${updatedItem.title}`);
    
    return {
      ...updatedItem,
      _id: updatedItem._id?.toString()
    } as SideHustle;
  }

  static async delete(id: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_SIDE_HUSTLES);
    
    // 构建查询条件
    let query: MongoIdQuery;
    
    if (ObjectId.isValid(id) && id.length === 24) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        query = {
          $or: [
            { _id: new ObjectId(id) },
            { id: numericId }
          ]
        };
      } else {
        query = { _id: new ObjectId(id) };
      }
    } else {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        query = { id: numericId };
      } else {
        return false;
      }
    }
    
    const result = await collection.deleteOne(query);
    
    if (result.deletedCount > 0) {
      console.log(`🗑️  删除副业项目 ID: ${id}`);
    }
    
    return result.deletedCount > 0;
  }

  static async incrementViews(id: string): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_SIDE_HUSTLES);
      
      // 构建查询条件
      let query: MongoIdQuery;
      
      if (ObjectId.isValid(id) && id.length === 24) {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          query = {
            $or: [
              { _id: new ObjectId(id) },
              { id: numericId }
            ]
          };
        } else {
          query = { _id: new ObjectId(id) };
        }
      } else {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          query = { id: numericId };
        } else {
          return; // 无效 ID，直接返回
        }
      }
      
      await collection.updateOne(query, { $inc: { views: 1 } });
    } catch (error) {
      const err = error as Error;
      // 浏览次数更新失败不影响主要功能，只记录日志
      console.log('浏览次数更新失败:', err.message);
    }
  }

  static async search(searchTerm: string, category: string = '全部', status: string = 'published'): Promise<SideHustle[]> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_SIDE_HUSTLES);
      
      const query: MongoQuery = {};
      
      // 状态筛选
      if (status !== 'all') {
        query.status = status;
      }
      
      // 分类筛选
      if (category !== '全部') {
        query.category = category;
      }
      
      // 搜索条件
      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tools: { $elemMatch: { $regex: searchTerm, $options: 'i' } } }
        ];
      }
      
      const result = await collection
        .find(query)
        .sort({ featured: -1, lastUpdated: -1 })
        .toArray();
      
      console.log(`🔍 搜索结果: ${result.length} 条 (关键词: "${searchTerm}", 分类: "${category}")`);
      
      return result.map(item => ({
        ...item,
        _id: item._id?.toString()
      })) as SideHustle[];
      
    } catch (error) {
      const err = error as Error;
      console.error('搜索失败:', err.message);
      return [];
    }
  }

  static async getCategories(): Promise<{ name: string; count: number }[]> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_SIDE_HUSTLES);
      
      const pipeline = [
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ];
      
      const categories = await collection.aggregate(pipeline).toArray();
      const totalCount = await collection.countDocuments({ status: 'published' });
      
      console.log(`📂 获取分类: ${categories.length + 1} 个分类，总计 ${totalCount} 个项目`);
      
      // 明确定义返回类型
      const categoryList: { name: string; count: number }[] = [
        { name: '全部', count: totalCount }
      ];
      
      // 安全地处理 categories 数组
      categories.forEach((cat: Document) => {
        if (cat && typeof cat.name === 'string' && typeof cat.count === 'number') {
          categoryList.push({
            name: cat.name,
            count: cat.count
          });
        }
      });
      
      return categoryList;
      
    } catch (error) {
      const err = error as Error;
      console.error('获取分类失败:', err.message);
      return [{ name: '全部', count: 0 }];
    }
  }
}

// 用户相关操作
export class UserDB {
  static async findByEmail(email: string): Promise<AdminUser | null> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_USERS);
      
      const user = await collection.findOne({ email });
      
      if (!user) return null;
      
      return {
        ...user,
        _id: user._id?.toString()
      } as AdminUser;
    } catch (error) {
      const err = error as Error;
      console.error('查找用户失败:', err.message);
      return null;
    }
  }

  static async updateLastLogin(email: string): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_USERS);
      
      await collection.updateOne(
        { email },
        { $set: { lastLogin: new Date() } }
      );
    } catch (error) {
      const err = error as Error;
      console.log('更新最后登录时间失败:', err.message);
    }
  }
}