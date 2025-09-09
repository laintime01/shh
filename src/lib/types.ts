// src/lib/types.ts - 更新类型定义
export interface SideHustle {
  _id?: string; // MongoDB 默认ID
  id: number; // 显示用ID
  title: string;
  category: string;
  description: string;
  tools: string[];
  pricing: string;
  difficulty: '简单' | '中等' | '高';
  setup: string;
  profit: string;
  requirements: string[];
  steps: string[];
  pros: string[];
  cons: string[];
  views: number;
  lastUpdated: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived'; // 新增状态字段
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // 创建者ID
}

export interface AdminUser {
  _id?: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  lastLogin?: Date;
  createdAt: Date;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: string;
  };
  expires: string;
}