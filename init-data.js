// 创建文件：init-data.js（项目根目录）
// 运行命令：node init-data.js

require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

const sampleData = [
  {
    id: 1,
    title: 'Spaceship/Say/Regery 比价 + Cloudflare 免费解析/加速',
    category: '技术服务',
    description: '域名注册比价服务，结合CDN加速，为用户提供最优域名解决方案',
    tools: ['Spaceship', 'Say', 'Regery', 'Cloudflare DNS'],
    pricing: '域名代购服务费 50-200元/次',
    difficulty: '简单',
    setup: '1-2小时',
    profit: '月收入 2000-8000元',
    requirements: ['基础英语能力', '支付账户', '客服沟通能力'],
    steps: [
      '注册各大域名商账户',
      '学习域名价格比较',
      '设置Cloudflare CDN',
      '建立客户服务流程'
    ],
    pros: ['需求稳定', '重复客户多', '技术门槛低'],
    cons: ['需要垫付资金', '汇率波动风险'],
    views: 1240,
    lastUpdated: '2024-12-15',
    featured: true,
    status: 'published'
  },
  {
    id: 2,
    title: 'YouTube 中文教学频道制作',
    category: '内容创作',
    description: '制作编程、生活技巧、产品评测等中文视频内容',
    tools: ['OBS Studio', 'DaVinci Resolve', 'Canva', 'YouTube Studio'],
    pricing: '广告收入 + 赞助 + 课程销售',
    difficulty: '中等',
    setup: '1-2个月建立频道',
    profit: '月收入 1000-20000元',
    requirements: ['视频剪辑', '内容策划', '持续更新能力'],
    steps: [
      '确定频道定位和目标受众',
      '学习视频拍摄和剪辑技巧',
      '制作高质量内容',
      '优化SEO和缩略图设计'
    ],
    pros: ['被动收入潜力大', '个人品牌建设', '技能可复用'],
    cons: ['前期收入低', '需要长期坚持', '平台政策风险'],
    views: 2341,
    lastUpdated: '2024-12-16',
    featured: true,
    status: 'published'
  },
  {
    id: 3,
    title: 'ChatGPT 应用培训咨询',
    category: '知识服务',
    description: '为企业和个人提供AI工具使用培训和咨询',
    tools: ['ChatGPT', 'Claude', 'Midjourney', '腾讯会议', 'PPT'],
    pricing: '培训费 3000-10000元/场，咨询 500-1000元/小时',
    difficulty: '简单',
    setup: '1-2周',
    profit: '月收入 5000-20000元',
    requirements: ['AI工具熟练使用', '培训演讲能力', '案例积累'],
    steps: [
      '深度学习各种AI工具',
      '开发标准培训课程',
      '积累实际应用案例',
      '建立企业客户渠道'
    ],
    pros: ['市场需求旺盛', '时薪高', '技能前沿'],
    cons: ['技术更新快', '需要持续学习'],
    views: 2890,
    lastUpdated: '2024-12-17',
    featured: false,
    status: 'published'
  }
];

async function initData() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ 请检查 .env.local 中的 MONGODB_URI');
    process.exit(1);
  }

  console.log('🚀 开始初始化数据...');

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ MongoDB 连接成功');
    
    const db = client.db('side-hustle-hub');
    const collection = db.collection('side_hustles');
    
    // 检查现有数据
    const count = await collection.countDocuments();
    console.log(`📊 当前数据库中有 ${count} 条记录`);
    
    if (count > 0) {
      console.log('💡 数据库已有数据，跳过初始化');
      console.log('💡 如需重新初始化，请先清空数据库');
      await client.close();
      return;
    }
    
    // 准备插入的数据
    const dataToInsert = sampleData.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'init-script'
    }));
    
    // 插入数据
    const result = await collection.insertMany(dataToInsert);
    console.log(`✅ 成功插入 ${result.insertedCount} 条副业数据`);
    
    // 创建索引提高查询性能
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ featured: 1 });
    await collection.createIndex({ title: 'text', description: 'text' });
    console.log('✅ 索引创建完成');
    
    await client.close();
    console.log('🎉 数据初始化完成！');
    console.log('🌐 现在可以刷新网页查看数据了');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    process.exit(1);
  }
}

initData();