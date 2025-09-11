'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Edit, Trash2, Eye, ArrowLeft, AlertCircle, CheckCircle, X, Search, Filter } from 'lucide-react';

// 创建文件：src/app/system/maintenance/admin/page.tsx
// 完整的副业信息管理界面 - 支持增删改查

interface SideHustle {
  _id?: string;
  id: number;
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
  views: number;
  lastUpdated: string;
  featured: boolean;
  status: string;
}

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

export default function SideHustleManagePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 数据状态
  const [sideHustles, setSideHustles] = useState<SideHustle[]>([]);
  const [filteredHustles, setFilteredHustles] = useState<SideHustle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
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

  // 获取所有副业数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchSideHustles();
    }
  }, [isAuthenticated]);

  // 搜索和筛选
  useEffect(() => {
    let filtered = sideHustles;
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredHustles(filtered);
  }, [sideHustles, searchTerm, statusFilter]);

  const fetchSideHustles = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/side-hustles?status=all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSideHustles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch side hustles:', error);
    }
  };

  const resetForm = () => {
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
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

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

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (item: SideHustle) => {
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      tools: item.tools,
      pricing: item.pricing,
      difficulty: item.difficulty,
      setup: item.setup,
      profit: item.profit,
      requirements: item.requirements,
      steps: item.steps,
      pros: item.pros,
      cons: item.cons,
      featured: item.featured,
      status: item.status
    });
    setIsEditing(true);
    setEditingId(item._id || '');
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.pricing || !formData.profit) {
      setMessage({ type: 'error', text: '请填写所有必填字段' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth-token');
      const url = isEditing ? `/api/side-hustles/${editingId}` : '/api/side-hustles';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
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
        setMessage({ 
          type: 'success', 
          text: isEditing ? '更新成功！' : '添加成功！' 
        });
        await fetchSideHustles();
        setTimeout(() => {
          resetForm();
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message || '操作失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除"${title}"吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/side-hustles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '删除成功！' });
        await fetchSideHustles();
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: '删除失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '删除失败，请重试' });
      console.error('Delete error:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/side-hustles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchSideHustles();
      }
    } catch (error) {
      console.error('Status toggle failed:', error);
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
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
                <h1 className="text-xl font-bold text-gray-900">副业信息管理</h1>
                <p className="text-sm text-gray-500">系统维护 - 数据库管理</p>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {!showForm ? (
          <>
            {/* 控制栏 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* 搜索框 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="搜索项目..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* 状态筛选 */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">所有状态</option>
                      <option value="published">已发布</option>
                      <option value="draft">草稿</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={startCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  添加新项目
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                共 {sideHustles.length} 个项目，显示 {filteredHustles.length} 个
              </div>
            </div>

            {/* 项目列表 */}
            <div className="bg-white rounded-lg shadow-sm border">
              {filteredHustles.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>没有找到匹配的项目</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredHustles.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {item.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status === 'published' ? '已发布' : '草稿'}
                            </span>
                            {item.featured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                推荐
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>分类: {item.category}</span>
                            <span>浏览: {(item.views || 0).toLocaleString()}</span>
                            <span>更新: {item.lastUpdated}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleStatus(item._id || '', item.status)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              item.status === 'published'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {item.status === 'published' ? '转为草稿' : '发布'}
                          </button>
                          
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item._id || '', item.title)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // 表单界面
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? '编辑项目' : '添加新项目'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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
              </div>

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
                <div className="flex items-center space-y-2">
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

              {/* 动态数组字段 */}
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
                      {isEditing ? '更新中...' : '保存中...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditing ? '更新项目' : '保存项目'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}