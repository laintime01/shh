// src/lib/data.ts
import { SideHustle } from './types';

// 这里存储所有副业信息 - 要添加新项目就在这个数组里加
export const sideHustleData: SideHustle[] = [
  // 技术服务类
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
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: 2,
    title: 'Supabase (PG+实时) + Upstash Redis + Cloudflare R2 存储',
    category: '技术服务',
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
    lastUpdated: '2024-12-14',
    featured: false,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: 3,
    title: 'Vercel / Cloudflare Pages 免费托管',
    category: '技术服务',
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
    featured: true,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  // 内容创作类
  {
    id: 4,
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
    featured: false,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: 5,
    title: '小红书知识博主 + 付费咨询',
    category: '内容创作',
    description: '分享专业知识，建立个人IP，提供一对一咨询服务',
    tools: ['小红书', '微信', 'Notion', 'Canva'],
    pricing: '咨询费 200-800元/小时，课程 299-1999元',
    difficulty: '简单',
    setup: '1-2周',
    profit: '月收入 3000-15000元',
    requirements: ['某个领域专业知识', '内容创作能力', '沟通表达能力'],
    steps: [
      '选择专业领域和定位',
      '持续输出高质量内容',
      '建立粉丝群体',
      '开发付费产品和服务'
    ],
    pros: ['门槛低', '变现方式多样', '个人成长'],
    cons: ['内容同质化竞争', '需要持续输出'],
    views: 1876,
    lastUpdated: '2024-12-15',
    featured: true,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  // 跨境贸易类
  {
    id: 6,
    title: 'Amazon FBA 跨境电商',
    category: '跨境贸易',
    description: '利用亚马逊FBA服务销售产品到海外市场',
    tools: ['Amazon Seller Central', 'Helium 10', '1688', 'PayPal'],
    pricing: '产品利润率 20-50%',
    difficulty: '高',
    setup: '2-3个月',
    profit: '月收入 5000-50000元',
    requirements: ['英语能力', '市场分析', '资金投入', '供应链管理'],
    steps: [
      '市场调研和产品选择',
      '找到可靠供应商',
      '产品优化和上架',
      '广告投放和运营优化'
    ],
    pros: ['市场空间大', '可扩展性强', '美元收入'],
    cons: ['前期投入大', '政策风险', '竞争激烈'],
    views: 1432,
    lastUpdated: '2024-12-14',
    featured: false,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: 7,
    title: 'Shopee 东南亚电商代运营',
    category: '跨境贸易',
    description: '为国内企业提供东南亚电商平台代运营服务',
    tools: ['Shopee Seller Center', 'ChatGPT', '翻译工具', '数据分析工具'],
    pricing: '代运营费 5000-20000元/月',
    difficulty: '中等',
    setup: '1个月',
    profit: '月收入 8000-30000元',
    requirements: ['东南亚市场了解', '电商运营经验', '多语言能力'],
    steps: [
      '了解东南亚各国市场特点',
      '建立运营团队',
      '开发标准化服务流程',
      '寻找企业客户合作'
    ],
    pros: ['蓝海市场', 'B2B服务稳定', '可批量化'],
    cons: ['文化差异', '汇率风险'],
    views: 987,
    lastUpdated: '2024-12-13',
    featured: false,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  // 知识服务类
  {
    id: 8,
    title: '在线编程课程制作与销售',
    category: '知识服务',
    description: '制作编程教学课程，在多平台销售',
    tools: ['腾讯课堂', '网易云课堂', 'Udemy', 'OBS', 'VS Code'],
    pricing: '课程定价 99-999元',
    difficulty: '中等',
    setup: '1-3个月',
    profit: '月收入 2000-25000元',
    requirements: ['编程技能', '教学能力', '课程设计能力'],
    steps: [
      '选择热门编程语言/技术',
      '设计完整课程大纲',
      '录制高质量视频课程',
      '多平台上架和推广'
    ],
    pros: ['一次制作多次销售', '技能变现', '帮助他人成长'],
    cons: ['技术更新快', '制作周期长'],
    views: 1654,
    lastUpdated: '2024-12-12',
    featured: true,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: 9,
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
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
  },
  // 生活服务类
  {
    id: 10,
    title: '宠物寄养和遛狗服务',
    category: '生活服务',
    description: '为上班族提供宠物日间照看和遛狗服务',
    tools: ['微信小程序', '支付宝', '宠物用品', '位置分享'],
    pricing: '遛狗 30-50元/次，寄养 80-150元/天',
    difficulty: '简单',
    setup: '即时开始',
    profit: '月收入 2000-8000元',
    requirements: ['喜爱动物', '责任心强', '体力充沛'],
    steps: [
      '在社区和网络平台宣传',
      '建立客户信任关系',
      '制定服务标准流程',
      '扩展服务范围'
    ],
    pros: ['门槛低', '现金流好', '工作灵活'],
    cons: ['收入有限', '体力消耗大', '责任风险'],
    views: 1123,
    lastUpdated: '2024-12-11',
    featured: false,
    status: 'draft',
    createdAt: undefined,
    updatedAt: undefined
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