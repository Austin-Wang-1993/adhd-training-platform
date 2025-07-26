import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: 初始化检查token');
    // 检查本地存储的token
    const token = localStorage.getItem('token');
    if (token) {
      console.log('AuthContext: 找到token，验证有效性');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // 验证token有效性
      api.get('/auth/me')
        .then(response => {
          console.log('AuthContext: token验证成功，设置用户:', response.data.data);
          setUser(response.data.data);
        })
        .catch((error) => {
          console.log('AuthContext: token验证失败:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('AuthContext: 没有找到token');
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    console.log('AuthContext: 开始登录请求');
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    console.log('AuthContext: 登录响应:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || '登录失败');
    }
    
    // 只有在登录成功时才设置用户状态
    if (response.data.data && response.data.data.user && response.data.data.token) {
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      console.log('AuthContext: 登录成功，用户已设置');
    } else {
      throw new Error('登录响应数据格式错误');
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { user, token } = response.data.data!;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 