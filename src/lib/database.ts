// src/lib/database.ts - 数据库操作函数
import clientPromise from './mongodb';
import { SideHustle, AdminUser } from './types';
import { ObjectId } from 'mongodb';

const DB_NAME = 'side-hustle-hub';
const COLLECTION_SIDE_HUSTLES = 'side_hustles';
const COLLECTION_USERS = 'users';

/**
 * Helpers
 */
function toObjectId(id: string | undefined | null): ObjectId | null {
  if (!id) return null;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function toNumericId(id: string | undefined | null): number | null {
  if (!id) return null;
  const n = Number(id);
  return Number.isInteger(n) ? n : null;
}

/**
 * SideHustle DB 操作
 */
export class SideHustleDB {
  static async getAll(status: string = 'published'): Promise<SideHustle[]> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const query = status === 'all' ? {} : { status };
    const result = await collection
      .find(query)
      .sort({ featured: -1, updatedAt: -1 })
      .toArray();

    return result.map((item: any) => ({
      ...item,
      _id: item._id?.toString?.() ?? item._id
    })) as SideHustle[];
  }

  static async getById(id: string): Promise<SideHustle | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const objectId = toObjectId(id);
    const numericId = toNumericId(id);

    const orClauses: any[] = [];
    if (objectId) orClauses.push({ _id: objectId });
    if (numericId !== null) orClauses.push({ id: numericId });

    // 如果既不是合法 ObjectId 也不是数字 id，则直接返回 null
    if (orClauses.length === 0) return null;

    const result = await collection.findOne({ $or: orClauses });

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString?.() ?? result._id
    } as SideHustle;
  }

  static async create(data: Omit<SideHustle, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<SideHustle> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    // 生成新的数字ID（若 collection 中已有 id 字段）
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

    return {
      ...newItem,
      _id: result.insertedId.toString()
    } as SideHustle;
  }

  static async update(id: string, data: Partial<SideHustle>): Promise<SideHustle | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const objectId = toObjectId(id);
    const numericId = toNumericId(id);

    const orClauses: any[] = [];
    if (objectId) orClauses.push({ _id: objectId });
    if (numericId !== null) orClauses.push({ id: numericId });

    if (orClauses.length === 0) return null;

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { $or: orClauses },
      { $set: updateData },
      { returnDocument: 'after' as const } // 确保返回更新后的文档
    );

    // result.value 可能为 null
    if (!result || !result.value) return null;

    const updated = result.value;
    return {
      ...updated,
      _id: updated._id?.toString?.() ?? updated._id
    } as SideHustle;
  }

  static async delete(id: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const objectId = toObjectId(id);
    const numericId = toNumericId(id);

    const orClauses: any[] = [];
    if (objectId) orClauses.push({ _id: objectId });
    if (numericId !== null) orClauses.push({ id: numericId });

    if (orClauses.length === 0) return false;

    const result = await collection.deleteOne({ $or: orClauses });

    return result.deletedCount > 0;
  }

  static async incrementViews(id: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const objectId = toObjectId(id);
    const numericId = toNumericId(id);

    const orClauses: any[] = [];
    if (objectId) orClauses.push({ _id: objectId });
    if (numericId !== null) orClauses.push({ id: numericId });

    if (orClauses.length === 0) return;

    await collection.updateOne(
      { $or: orClauses },
      { $inc: { views: 1 } }
    );
  }

  static async search(searchTerm: string, category: string = '全部', status: string = 'published'): Promise<SideHustle[]> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const query: any = {};

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
      .sort({ featured: -1, updatedAt: -1 })
      .toArray();

    return result.map((item: any) => ({
      ...item,
      _id: item._id?.toString?.() ?? item._id
    })) as SideHustle[];
  }

  static async getCategories(): Promise<{ name: string; count: number }[]> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_SIDE_HUSTLES);

    const pipeline = [
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ];

    // 明确类型，避免 TS 报错
    const categories = await collection.aggregate<{ name: string; count: number }>(pipeline).toArray();
    const totalCount = await collection.countDocuments({ status: 'published' });

    return [
      { name: '全部', count: totalCount },
      ...categories
    ];
  }
}

/**
 * User DB 操作
 */
export class UserDB {
  static async findByEmail(email: string): Promise<AdminUser | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_USERS);

    const user = await collection.findOne({ email });

    if (!user) return null;

    return {
      ...user,
      _id: user._id?.toString?.() ?? user._id
    } as AdminUser;
  }

  static async updateLastLogin(email: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<any>(COLLECTION_USERS);

    await collection.updateOne(
      { email },
      { $set: { lastLogin: new Date() } }
    );
  }
}
