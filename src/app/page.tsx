"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Code, Eye, ChevronDown, AlertCircle, Loader } from 'lucide-react';

// 定义数据类型
interface SideHustle {
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
  status?: string;
}

interface Category {
  name: string;
  count: number;
}

// 替换你现有的 src/app/page.tsx
export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sideHustles, setSideHustles] = useState<SideHustle[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ name: '全部', count: 0 }]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  // 获取副业数据
  const fetchSideHustles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== '全部') params.append('category', selectedCategory);
      params.append('status', 'published'); // 只获取已发布的项目
      
      const response = await fetch(`/api/side-hustles?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSideHustles(data.data);
      } else {
        setError(data.message || '获取数据失败');
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      setError('网络连接失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  // 增加浏览次数
  const incrementViews = async (id: number) => {
    try {
      await fetch(`/api/side-hustles/${id}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('更新浏览次数失败:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchCategories();
    fetchSideHustles();
  }, []);

  // 搜索和筛选变化时重新获取数据
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSideHustles();
    }, 300); // 防抖

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">副业信息库</h1>
                <p className="text-xs text-gray-500">实用工具 · 赚钱方法 · 技术服务</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          {/* 搜索框 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索工具、服务或技术栈..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* 结果统计 */}
          <div className="text-sm text-gray-600 mb-6">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                加载中...
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            ) : (
              <>
                找到 <span className="font-semibold text-gray-900">{sideHustles.length}</span> 个副业项目
              </>
            )}
          </div>
        </div>

        {/* 项目列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载项目数据...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : sideHustles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关项目</h3>
            <p className="text-gray-600">尝试调整搜索词或选择不同的分类</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sideHustles.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => incrementViews(item.id)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {item.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          难度: {item.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {item.setup}
                        </span>
                        {item.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                            推荐
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="w-4 h-4" />
                        {(item.views || 0).toLocaleString()}
                      </div>
                      <div>更新: {item.lastUpdated}</div>
                    </div>
                  </div>

                  {/* 工具标签 */}
                  {item.tools && item.tools.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">涉及工具:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tools.map((tool, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-md text-sm border">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 关键信息 */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">收费标准</div>
                      <div className="font-medium text-gray-900">{item.pricing}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">预期收入</div>
                      <div className="font-medium text-green-600">{item.profit}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">基础要求</div>
                      <div className="font-medium text-gray-900">
                        {item.requirements && item.requirements.length > 0 ? item.requirements[0] : '无特殊要求'}
                      </div>
                    </div>
                  </div>

                  {/* 可展开详情 */}
                  <details className="group">
                    <summary className="cursor-pointer text-blue-600 font-medium flex items-center gap-2 hover:text-blue-700">
                      查看详细信息
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* 技能要求 */}
                      {item.requirements && item.requirements.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">技能要求:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {item.requirements.map((req, index) => (
                              <li key={index} className="text-sm">{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 实施步骤 */}
                      {item.steps && item.steps.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">实施步骤:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-gray-600">
                            {item.steps.map((step, index) => (
                              <li key={index} className="text-sm">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* 优缺点 */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.pros && item.pros.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2 text-green-700">优势:</h5>
                            <ul className="space-y-1">
                              {item.pros.map((pro, index) => (
                                <li key={index} className="text-sm text-green-600">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.cons && item.cons.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2 text-red-700">注意事项:</h5>
                            <ul className="space-y-1">
                              {item.cons.map((con, index) => (
                                <li key={index} className="text-sm text-red-600">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}