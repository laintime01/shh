// src/app/admin/page.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Save, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { SideHustle } from '@/lib/types';

export default function AdminPage() {
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState<Partial<SideHustle>>({
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
    views: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    featured: false
  });

  const categories = [
    '技术服务', '内容创作', '跨境贸易', '知识服务', '生活服务',
    '设计创意', '数据分析', '营销推广', '金融投资', '其他'
  ];

  const difficulties = ['简单', '中等', '高'];

  const handleInputChange = (field: keyof SideHustle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'tools' | 'requirements' | 'steps' | 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'tools' | 'requirements' | 'steps' | 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: 'tools' | 'requirements' | 'steps' | 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleToolsChange = (value: string) => {
    const toolsArray = value.split(',').map(tool => tool.trim()).filter(tool => tool !== '');
    setFormData(prev => ({ ...prev, tools: toolsArray }));
  };

  const generateCode = () => {
    const newId = Date.now(); // 简单的ID生成
    const codeObj = {
      ...formData,
      id: newId,
      views: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    return `// 将以下代码添加到 src/lib/data.ts 的 sideHustleData 数组中
{
  id: ${newId},
  title: '${codeObj.title}',
  category: '${codeObj.category}',
  description: '${codeObj.description}',
  tools: ${JSON.stringify(codeObj.tools)},
  pricing: '${codeObj.pricing}',
  difficulty: '${codeObj.difficulty}',
  setup: '${codeObj.setup}',
  profit: '${codeObj.profit}',
  requirements: ${JSON.stringify(codeObj.requirements)},
  steps: ${JSON.stringify(codeObj.steps)},
  pros: ${JSON.stringify(codeObj.pros)},
  cons: ${JSON.stringify(codeObj.cons)},
  views: ${codeObj.views},
  lastUpdated: '${codeObj.lastUpdated}',
  featured: ${codeObj.featured}
},`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      alert('代码已复制到剪贴板！请手动添加到 src/lib/data.ts 文件中');
    } catch (err) {
      alert('复制失败，请手动复制代码');
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 预览头部 */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                返回编辑
              </button>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  复制代码
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 预览内容 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {formData.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      难度: {formData.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {formData.setup}
                    </span>
                    {formData.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        推荐
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {formData.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {formData.description}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="w-4 h-4" />
                    {formData.views?.toLocaleString() || 0}
                  </div>
                  <div>更新: {formData.lastUpdated}</div>
                </div>
              </div>

              {/* 工具标签 */}
              {formData.tools && formData.tools.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">涉及工具:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tools.map((tool, index) => (
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
                  <div className="font-medium text-gray-900">{formData.pricing}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">预期收入</div>
                  <div className="font-medium text-green-600">{formData.profit}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">基础要求</div>
                  <div className="font-medium text-gray-900">{formData.requirements?.[0] || ''}</div>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="space-y-4 pt-4 border-t">
                {/* 技能要求 */}
                {formData.requirements && formData.requirements.filter(req => req).length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">技能要求:</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {formData.requirements.filter(req => req).map((req, index) => (
                        <li key={index} className="text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 实施步骤 */}
                {formData.steps && formData.steps.filter(step => step).length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">实施步骤:</h5>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      {formData.steps.filter(step => step).map((step, index) => (
                        <li key={index} className="text-sm">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* 优缺点 */}
                <div className="grid md:grid-cols-2 gap-4">
                  {formData.pros && formData.pros.filter(pro => pro).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 text-green-700">优势:</h5>
                      <ul className="space-y-1">
                        {formData.pros.filter(pro => pro).map((pro, index) => (
                          <li key={index} className="text-sm text-green-600">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {formData.cons && formData.cons.filter(con => con).length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 text-red-700">注意事项:</h5>
                      <ul className="space-y-1">
                        {formData.cons.filter(con => con).map((con, index) => (
                          <li key={index} className="text-sm text-red-600">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 生成的代码 */}
          <div className="mt-8 bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">生成的代码 (复制并添加到 data.ts)</h4>
              <button
                onClick={copyToClipboard}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                复制代码
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{generateCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                返回首页
              </Link>
              <h1 className="text-xl font-bold text-gray-900">添加副业信息</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPreview(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                预览
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form className="space-y-6">
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
                涉及工具 *
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
                  onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
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
                  {field === 'requirements' && '技能要求 *'}
                  {field === 'steps' && '实施步骤 *'}
                  {field === 'pros' && '优势 *'}
                  {field === 'cons' && '注意事项 *'}
                </label>
                <div className="space-y-2">
                  {(formData[field] as string[])?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`输入${field === 'requirements' ? '技能要求' : field === 'steps' ? '步骤' : field === 'pros' ? '优势' : '注意事项'}...`}
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
                          删除
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
                    添加{field === 'requirements' ? '要求' : field === 'steps' ? '步骤' : field === 'pros' ? '优势' : '注意事项'}
                  </button>
                </div>
              </div>
            ))}

            {/* 提示信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">使用说明：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>填写完成后，点击"预览"查看效果</li>
                    <li>确认无误后，复制生成的代码</li>
                    <li>将代码手动添加到 <code className="bg-blue-100 px-1 rounded">src/lib/data.ts</code> 文件中</li>
                    <li>刷新网站即可看到新添加的项目</li>
                  </ul>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}