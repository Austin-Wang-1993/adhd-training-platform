import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateUsername, validatePassword } from '../lib/utils';
import PrivacyModal from '../components/PrivacyModal';

export default function Login() {
  // 使用 useRef 保存表单状态，避免组件重新挂载时丢失
  const formDataRef = useRef<{
    username: string;
    password: string;
    agreeToTerms: boolean;
  }>({
    username: '',
    password: '',
    agreeToTerms: false,
  });
  
  // 使用 state 来触发重新渲染，但数据来源是 ref
  const [, forceUpdate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { login, user, loading } = useAuth();
  const errorTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // 监控错误状态变化
  useEffect(() => {
    console.log('错误状态变化:', errors);
  }, [errors]);

  // 监控用户状态变化
  useEffect(() => {
    console.log('Login组件: 用户状态变化:', { user, loading });
  }, [user, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // 更新 ref 中的对应字段
    if (name === 'username') {
      formDataRef.current.username = value;
    } else if (name === 'password') {
      formDataRef.current.password = value;
    } else if (name === 'agreeToTerms') {
      formDataRef.current.agreeToTerms = checked;
    }
    
    // 触发重新渲染
    forceUpdate({});
    
    // 清除对应字段的错误，但保留通用错误
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '',
        // 保留通用错误，除非用户正在修改导致错误的字段
        general: name === 'username' || name === 'password' ? '' : prev.general
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formDataRef.current.username) {
      newErrors.username = '请输入用户名';
    } else if (!validateUsername(formDataRef.current.username)) {
      newErrors.username = '用户名长度3-20位，只允许字母、数字、下划线';
    }

    if (!formDataRef.current.password) {
      newErrors.password = '请输入密码';
    } else if (!validatePassword(formDataRef.current.password)) {
      newErrors.password = '密码长度6-20位，只允许字母、数字、下划线';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePrivacyTerms = () => {
    if (!formDataRef.current.agreeToTerms) {
      setShowPrivacyModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('开始登录流程');
    
    // 先验证表单字段
    if (!validateForm()) {
      console.log('表单验证失败');
      return;
    }

    // 再验证隐私条款
    if (!validatePrivacyTerms()) {
      console.log('隐私条款验证失败');
      return;
    }

    console.log('开始登录请求');
    setIsLoading(true);
    
    // 清除之前的定时器
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    
    try {
      // 使用 ref 中的数据，确保即使组件重新挂载也能获取到正确的数据
      await login(formDataRef.current);
      console.log('登录成功');
    } catch (error: any) {
      console.log('登录失败:', error);
      const errorMessage = error.response?.data?.message || '登录失败，请重试';
      
      console.log('设置错误消息:', errorMessage);
      
      // 立即设置错误，不使用 setTimeout
      setErrors({ general: errorMessage });
      
      // 5秒后自动清除错误提示
      errorTimeoutRef.current = window.setTimeout(() => {
        console.log('清除错误消息');
        setErrors(prev => ({ ...prev, general: '' }));
        errorTimeoutRef.current = null;
      }, 5000);
    } finally {
      setIsLoading(false);
      console.log('登录流程结束');
    }
  };

  const openPrivacyPolicy = () => {
    navigate('/privacy-policy', { state: { from: '/login' } });
  };

  const handlePrivacyAgree = () => {
    formDataRef.current.agreeToTerms = true;
    forceUpdate({});
    setShowPrivacyModal(false);
    
    // 使用 setTimeout 确保状态更新完成后再提交
    setTimeout(() => {
      if (formDataRef.current.username && formDataRef.current.password) {
        handleSubmit(new Event('submit') as any);
      }
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录到ADHD训练平台
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            欢迎回来！请输入您的账号信息
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={(e) => {
          console.log('表单提交事件触发');
          handleSubmit(e);
        }}>
          {errors.general && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 animate-pulse">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.general}
                  </h3>
                  <p className="text-xs text-red-600 mt-1">
                    提示：请检查用户名和密码是否正确
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`mt-1 input-field ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="请输入用户名"
                value={formDataRef.current.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="请输入密码"
                  value={formDataRef.current.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formDataRef.current.agreeToTerms}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  我已阅读并同意{' '}
                  <button
                    type="button"
                    onClick={openPrivacyPolicy}
                    className="text-primary-600 hover:text-primary-500 font-medium inline-flex items-center"
                  >
                    隐私条款
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </button>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账号？{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                立即注册
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* 隐私条款弹窗 */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAgree={handlePrivacyAgree}
        title="请同意隐私条款"
        content="为了继续登录，您需要阅读并同意我们的隐私条款。我们承诺保护您的个人信息安全。"
      />
    </div>
  );
} 