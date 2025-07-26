// 应用配置
export const APP_CONFIG = {
  // 应用信息
  name: 'ADHD儿童注意力训练平台',
  version: '1.0.0',
  description: '专为注意力缺陷多动障碍（ADHD）儿童设计的科学训练平台',
  
  // API配置
  api: {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
  },
  
  // 游戏配置
  games: {
    numberGame: {
      gridSize: 5,
      maxNumber: 25,
      errorDisplayTime: 3000, // 错误提示显示时间（毫秒）
    }
  },
  
  // 用户配置
  user: {
    username: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    password: {
      minLength: 6,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    }
  },
  
  // 隐私条款
  privacy: {
    url: '/privacy-policy',
    lastUpdated: '2024-01-01',
  },
  
  // 页面配置
  pages: {
    home: {
      title: '首页',
      description: 'ADHD训练平台首页，了解平台功能和ADHD相关知识',
    },
    numberGame: {
      title: '数字顺序游戏',
      description: '在5x5方格中按顺序点击数字1-25，训练视觉注意力',
    },
    login: {
      title: '登录',
      description: '登录到ADHD训练平台',
    },
    register: {
      title: '注册',
      description: '注册ADHD训练平台账号',
    },
  },
  
  // 导航配置
  navigation: [
    {
      name: '首页',
      path: '/',
      icon: 'Home',
      description: '平台介绍和功能概览',
    },
    {
      name: '数字游戏',
      path: '/number-game',
      icon: 'Gamepad2',
      description: '注意力训练游戏',
    },
  ],
  
  // 主题配置
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      }
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
    },
  },
  
  // 功能开关
  features: {
    registration: true,
    leaderboard: true,
    privacyPolicy: true,
    numberGame: true,
  },
  
  // 开发配置
  development: {
    enableLogs: import.meta.env.DEV,
    mockData: import.meta.env.DEV,
  }
};

// 环境配置
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL,
  appUrl: import.meta.env.VITE_APP_URL,
};

// 导出默认配置
export default APP_CONFIG; 