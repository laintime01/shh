// src/lib/mongodb.ts - 更新版本，启动时自动连接和测试
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.error('❌ 缺少环境变量: MONGODB_URI');
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// 连接状态跟踪
let isConnected = false;
let connectionError: Error | null = null;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
    
    // 启动时测试连接
    testConnection();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  
  // 生产环境也测试连接
  testConnection();
}

async function testConnection() {
  try {
    console.log('🔄 正在连接 MongoDB...');
    
    const client = await clientPromise;
    const db = client.db('side-hustle-hub');
    
    // 测试连接
    await db.admin().ping();
    
    // 检查副业数据
    const sideHustlesCollection = db.collection('side_hustles');
    const count = await sideHustlesCollection.countDocuments();
    
    console.log('✅ MongoDB 连接成功！');
    console.log(`📊 数据库: side-hustle-hub`);
    console.log(`📝 副业项目数量: ${count} 条`);
    
    if (count === 0) {
      console.log('💡 提示: 数据库为空，可以运行数据迁移脚本导入初始数据');
    }
    
    isConnected = true;
    connectionError = null;
    
  } catch (error) {
    const err = error as Error;
    console.error('❌ MongoDB 连接失败:', err.message);
    
    // 更详细的错误信息
    if (err.message.includes('Authentication failed')) {
      console.error('🔐 认证失败 - 请检查用户名和密码');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('🌐 网络错误 - 请检查网络连接和集群地址');
    } else if (err.message.includes('Cannot read properties of undefined')) {
      console.error('🔧 连接对象错误 - 请检查 MONGODB_URI 格式');
    }
    
    console.error('🔧 请检查:');
    console.error('   1. .env.local 文件中的 MONGODB_URI 是否正确');
    console.error('   2. MongoDB Atlas 网络访问设置');
    console.error('   3. 数据库用户权限配置');
    
    isConnected = false;
    connectionError = err;
  }
}

// 导出连接状态检查函数
export function getConnectionStatus() {
  return {
    isConnected,
    error: connectionError
  };
}

export default clientPromise;