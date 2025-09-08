// src/lib/data.ts
import { SideHustle } from './types';

// 这里存储所有副业信息 - 要添加新项目就在这个数组里加
export const sideHustleData: SideHustle[] = [
  {
    id: 1,
    title: 'Spaceship/Say/Regery 比价 + Cloudflare 免费解析/加速',
    category: '域名服务',
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
    featured: true
  },
  {
    id: 2,
    title: 'Supabase (PG+实时) + Upstash Redis + Cloudflare R2 存储',
    category: '数据存储',
    description: '为中小企业提供现代化数据栈搭建和维护服务',
    tools: ['Supabase', 'Upstash Redis', 'Cloudflare R2', 'PostgreSQL'],
    pricing: '项目搭建 3000-8000元，月维护 500-2000元',
    difficulty: '中等',
    setup: '1-2周学习 + 项目实践',
    profit: '月收入 5000-15000元',
    requirements: ['数据库基础', '云服务经验', '英语读写能力'],
    steps: [
      '学习Supabase基础操作',
      '掌握Redis缓存策略',
      '了解R2存储配置',
      '建立客户案例库'
    ],
    pros: ['技术含量高', '客单价高', '长期合作'],
    cons: ['学习成本高', '竞争激烈'],
    views: 890,
    lastUpdated: '2024-12-14'
  },
  {
    id: 3,
    title: 'Vercel / Cloudflare Pages 免费托管',
    category: '网站部署',
    description: '为个人和小企业提供网站部署和维护服务',
    tools: ['Vercel', 'Cloudflare Pages', 'Netlify', 'GitHub Actions'],
    pricing: '部署服务 500-1500元，月维护 200-800元',
    difficulty: '简单',
    setup: '2-3天',
    profit: '月收入 3000-12000元',
    requirements: ['Git基础', '基础命令行', '域名知识'],
    steps: [
      '学习Git工作流',
      '掌握CI/CD概念',
      '配置自定义域名',
      '监控和维护流程'
    ],
    pros: ['门槛低', '需求稳定', '自动化程度高'],
    cons: ['价格竞争激烈', '利润率低'],
    views: 2100,
    lastUpdated: '2024-12-16',
    featured: true
  }
];

// 分类统计 - 会自动计算每个分类的数量
export const getCategories = () => {
  const categoryCount = sideHustleData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: '全部', count: sideHustleData.length },
    ...Object.entries(categoryCount).map(([name, count]) => ({ name, count }))
  ];
};

// 搜索和筛选函数
export const searchSideHustles = (searchTerm: string, category: string = '全部') => {
  return sideHustleData.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = category === '全部' || item.category === category;
    
    return matchesSearch && matchesCategory;
  });
};

// 添加新副业项目的辅助函数（以后可以用）
export const addNewSideHustle = (newItem: Omit<SideHustle, 'id'>) => {
  const newId = Math.max(...sideHustleData.map(item => item.id)) + 1;
  const newSideHustle = { ...newItem, id: newId };
  sideHustleData.push(newSideHustle);
  return newSideHustle;
};