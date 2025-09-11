'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

// 创建文件：src/app/system/maintenance/login/page.tsx
// 隐蔽访问地址：http://localhost:3000/system/maintenance/login

export default function MaintenancePortal() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [accessGranted, setAccessGranted] = useState(false);
  const [timeCheck, setTimeCheck] = useState(true);

  // 检查访问时间（可选的安全措施）
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // 只在早上6点到晚上11点允许访问（可根据需要调整）
    if (hour < 6 || hour > 23) {
      setTimeCheck(false);
    }

    // 记录访问日志（发送到后端）
    logAccess();
  }, []);

  const logAccess = async () => {
    try {
      await fetch('/api/admin/log-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side'
        })
      });
    } catch (error) {
      console.log('Access log failed');
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: '请填写完整的认证信息' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '认证成功，正在跳转...' });
        setAccessGranted(true);
        
        // 存储token
        if (result.data.token) {
          localStorage.setItem('auth-token', result.data.token);
        }
        
        // 跳转到管理面板
        setTimeout(() => {
          window.location.href = '/system/maintenance/admin';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: '认证失败，访问被拒绝' });
        
        // 记录失败尝试
        try {
          await fetch('/api/admin/log-failed-attempt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent
            })
          });
        } catch (logError) {
          console.log('Failed to log attempt');
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: '系统维护中，请稍后重试' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // 如果不在允许的访问时间内
  if (!timeCheck) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-red-100 mb-2">系统维护中</h1>
            <p className="text-red-300 text-sm">
              系统维护时间：每日 06:00 - 23:00
            </p>
            <p className="text-red-400 text-xs mt-2">
              请在维护时间外访问
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 伪装的头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-gray-700 rounded-2xl shadow-lg mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">系统维护工具</h1>
          <p className="text-blue-200 mt-2">内部技术支持门户</p>
          <div className="text-xs text-gray-400 mt-1">
            Version 2.1.4 | Build 20241220
          </div>
        </div>

        {/* 认证表单 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">技术人员认证</h2>
            <p className="text-blue-200 text-sm">请输入维护凭据以继续</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                技术员ID
              </label>
              <input
                type="email"
                placeholder="输入技术员邮箱"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                访问密钥
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="输入维护密钥"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-200"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 消息提示 */}
            {message.text && (
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-100 border border-red-500/30'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || accessGranted}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  认证中...
                </div>
              ) : accessGranted ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  认证成功
                </div>
              ) : (
                '验证凭据'
              )}
            </button>
          </div>

          {/* 伪装的技术信息 */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-xs text-blue-300 space-y-1">
              <div className="flex justify-between">
                <span>系统状态:</span>
                <span className="text-green-400">● 正常运行</span>
              </div>
              <div className="flex justify-between">
                <span>数据库:</span>
                <span className="text-green-400">● 连接正常</span>
              </div>
              <div className="flex justify-between">
                <span>服务器负载:</span>
                <span className="text-yellow-400">● 中等</span>
              </div>
              <div className="flex justify-between">
                <span>最后检查:</span>
                <span className="text-blue-400">{new Date().toLocaleTimeString('zh-CN')}</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-xs text-gray-400">
                Authorized Personnel Only | 仅限授权人员使用
              </div>
            </div>
          </div>
        </div>

        {/* 底部伪装链接 */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
          >
            ← 返回主站点
          </a>
        </div>
      </div>
    </div>
  );
}