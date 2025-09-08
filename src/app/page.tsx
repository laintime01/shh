// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { Search, Code, Eye, ChevronDown } from 'lucide-react';
import { sideHustleData, getCategories, searchSideHustles } from '@/lib/data';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = getCategories();
  const filteredData = searchSideHustles(searchTerm, selectedCategory);

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

          <div className="text-sm text-gray-600 mb-6">
            找到 <span className="font-semibold text-gray-900">{filteredData.length}</span> 个副业项目
          </div>
        </div>

        {/* 项目列表 */}
        <div className="space-y-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
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
                      {item.views.toLocaleString()}
                    </div>
                    <div>更新: {item.lastUpdated}</div>
                  </div>
                </div>

                {/* 工具标签 */}
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
                    <div className="font-medium text-gray-900">{item.requirements[0]}</div>
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
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">技能要求:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {item.requirements.map((req, index) => (
                          <li key={index} className="text-sm">{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 实施步骤 */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">实施步骤:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-600">
                        {item.steps.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* 优缺点 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 text-green-700">优势:</h5>
                        <ul className="space-y-1">
                          {item.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-green-600">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 text-red-700">注意事项:</h5>
                        <ul className="space-y-1">
                          {item.cons.map((con, index) => (
                            <li key={index} className="text-sm text-red-600">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>

        {/* 无结果提示 */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关项目</h3>
            <p className="text-gray-600">尝试调整搜索词或选择不同的分类</p>
          </div>
        )}
      </div>
    </div>
  );
}