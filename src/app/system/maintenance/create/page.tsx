'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Eye, ArrowLeft, AlertCircle, CheckCircle, X } from 'lucide-react';

// 创建文件：src/app/system/maintenance/create/page.tsx
// 访问地址：http://localhost:3000/system/maintenance/create

interface SideHustleForm {
  title: string;
  category: string;
  description: string;
  tools: string[];
  pricing: string;
  difficulty: string;
  setup: string;
  profit: string;
  requirements: string[];
  steps: string[];
  pros: string[];
  cons: string[];
  featured: boolean;
  status: string;
}

export default function CreateSideHustlePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState<SideHustleForm>({
    title: '',
    category: '技术服务',
    description: '',
    tools: [],
    pricing: '',
    difficulty: '简单',
    setup: '',
    profit: '',
    requirements: [''],
    steps: [''],
    pros: [''],
    cons: [''],
    featured: false,
    status: 'published'
  });

  const categories = [
    '技术服务', '内容创作', '跨境贸易', '知识服务', '生活服务',
    '设计创意', '数据分析', '营销推广', '金融投资', '其他'
  ];

  const difficulties = ['简单', '中等', '高'];

  // 验证登录状态
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        window.location.href = '/system/maintenance/login';
        return;
      }
      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleInputChange = (field: keyof SideHustleForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'requirements' | 'steps' | 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'steps' | 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'steps' | 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleToolsChange = (value: string) => {
    const toolsArray = value.split(',').map(tool => tool.trim()).filter(tool => tool !== '');
    setFormData(prev => ({ ...prev, tools: toolsArray }));
  };

  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.title || !formData.description || !formData.pricing || !formData.profit) {
      setMessage({ type: 'error', text: '请填写所有必填字段' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/side-hustles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tools: formData.tools.filter(tool => tool.trim() !== ''),
          requirements: formData.requirements.filter(req => req.trim() !== ''),
          steps: formData.steps.filter(step => step.trim() !== ''),
          pros: formData.pros.filter(pro => pro.trim() !== ''),
          cons: formData.cons.filter(con => con.trim() !== ''),
          lastUpdated: new Date().toISOString().split('T')[0]
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '副业信息添加成功！' });
        // 重置表单
        setTimeout(() => {
          setFormData({
            title: '',
            category: '技术服务',
            description: '',
            tools: [],
            pricing: '',
            difficulty: '简单',
            setup: '',
            profit: '',
            requirements: [''],
            steps: [''],
            pros: [''],
            cons: [''],
            featured: false,
            status: 'published'
          });
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || '添加失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.href = '/system/maintenance/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">验证权限中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                返回
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">添加副业项目</h1>
                <p className="text-sm text-gray-500">系统维护 - 内容管理</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/"
                target="_blank"
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                查看网站
              </a>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          
          {/* 消息提示 */}
          {message.text && (
            <div className={`mb-6 flex items-center gap-2 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* 基础信息 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目标题 *
                </label>
                <input
                  type="text"
                  placeholder="例：YouTube 中文教学频道制作"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目描述 *
              </label>
              <textarea
                rows={3}
                placeholder="简要描述这个副业项目的内容和价值..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                涉及工具
              </label>
              <input
                type="text"
                placeholder="用逗号分隔，例：YouTube Studio, DaVinci Resolve, Canva"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tools?.join(', ') || ''}
                onChange={(e) => handleToolsChange(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">用逗号分隔多个工具</p>
            </div>

            {/* 商业信息 */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  难度等级 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  启动时间 *
                </label>
                <input
                  type="text"
                  placeholder="例：1-2个月"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.setup}
                  onChange={(e) => handleInputChange('setup', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">推荐项目</span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  收费标准 *
                </label>
                <input
                  type="text"
                  placeholder="例：广告收入 + 赞助 + 课程销售"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pricing}
                  onChange={(e) => handleInputChange('pricing', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预期收入 *
                </label>
                <input
                  type="text"
                  placeholder="例：月收入 1000-20000元"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.profit}
                  onChange={(e) => handleInputChange('profit', e.target.value)}
                />
              </div>
            </div>

            {/* 动态列表字段 */}
            {(['requirements', 'steps', 'pros', 'cons'] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field === 'requirements' && '技能要求'}
                  {field === 'steps' && '实施步骤'}
                  {field === 'pros' && '优势'}
                  {field === 'cons' && '注意事项'}
                </label>
                <div className="space-y-2">
                  {(formData[field] as string[])?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`输入${
                          field === 'requirements' ? '技能要求' : 
                          field === 'steps' ? '步骤' : 
                          field === 'pros' ? '优势' : '注意事项'
                        }...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item}
                        onChange={(e) => handleArrayChange(field, index, e.target.value)}
                      />
                      {(formData[field] as string[]).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(field, index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem(field)}
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    添加{
                      field === 'requirements' ? '要求' : 
                      field === 'steps' ? '步骤' : 
                      field === 'pros' ? '优势' : '注意事项'
                    }
                  </button>
                </div>
              </div>
            ))}

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存副业信息
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}