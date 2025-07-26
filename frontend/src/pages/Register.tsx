import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateUsername, validatePassword } from '../lib/utils';
import PrivacyModal from '../components/PrivacyModal';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { register } = useAuth();
  const errorTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // 清除对应字段的错误，但保留通用错误
    if (errors[name]) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '',
        // 保留通用错误，除非用户正在修改导致错误的字段
        general: ['username', 'password', 'confirmPassword'].includes(name) ? '' : prev.general
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = '用户名长度3-20位，只允许字母、数字、下划线';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '密码长度6-20位，只允许字母、数字、下划线';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePrivacyTerms = () => {
    if (!formData.agreeToTerms) {
      setShowPrivacyModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 先验证表单字段
    if (!validateForm()) {
      return;
    }

    // 再验证隐私条款
    if (!validatePrivacyTerms()) {
      return;
    }

    setIsLoading(true);
    
    // 清除之前的定时器
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    
    try {
      await register(formData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '注册失败，请重试';
      
      // 使用 setTimeout 确保在下一个事件循环中设置错误
      setTimeout(() => {
        setErrors({ general: errorMessage });
        
        // 5秒后自动清除错误提示
        errorTimeoutRef.current = window.setTimeout(() => {
          setErrors(prev => ({ ...prev, general: '' }));
          errorTimeoutRef.current = null;
        }, 5000);
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const openPrivacyPolicy = () => {
    navigate('/privacy-policy', { state: { from: '/register' } });
  };

  const handlePrivacyAgree = () => {
    setFormData(prev => ({ ...prev, agreeToTerms: true }));
    setShowPrivacyModal(false);
    
    // 使用 setTimeout 确保状态更新完成后再提交
    setTimeout(() => {
      if (formData.username && formData.password && formData.confirmPassword) {
        handleSubmit(new Event('submit') as any);
      }
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            注册ADHD训练平台
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            创建您的账号，开始注意力训练之旅
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 animate-pulse">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.general}
                  </h3>
                  <p className="text-xs text-red-600 mt-1">
                    提示：请检查输入信息是否正确
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
                placeholder="请输入用户名（3-20位字母、数字、下划线）"
                value={formData.username}
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
                  placeholder="请输入密码（6-20位字母、数字、下划线）"
                  value={formData.password}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.agreeToTerms}
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
              {isLoading ? '注册中...' : '注册'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              已有账号？{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                立即登录
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
        content="为了继续注册，您需要阅读并同意我们的隐私条款。我们承诺保护您的个人信息安全。"
      />
    </div>
  );
} 