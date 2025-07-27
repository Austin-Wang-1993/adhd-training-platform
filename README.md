# ADHD儿童注意力训练平台

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

专为注意力缺陷多动障碍（ADHD）儿童设计的科学训练平台，通过有趣的游戏帮助孩子们提升注意力、专注力和认知能力。

## 🌟 项目亮点

- 🎯 **科学训练**：基于认知科学原理设计的注意力训练游戏
- 🎮 **多难度模式**：简单、中等、困难三种难度，适应不同能力水平
- ⚡ **实时反馈**：毫秒级计时，即时成绩反馈
- 📊 **进度追踪**：详细的成绩记录和排行榜系统
- 🔒 **隐私保护**：完整的隐私条款和数据处理规范
- 🚀 **一键部署**：完整的腾讯云部署方案，支持自动化运维

## 🎯 适用人群

- **ADHD儿童**：通过游戏化训练提升注意力
- **家长**：监控孩子的训练进度和效果
- **教育工作者**：辅助注意力训练教学
- **康复师**：作为注意力康复训练工具

## 功能特性

- 🔐 **完整的账号体系** - 用户注册、登录、密码加密存储，支持用户名/密码验证
- 🎮 **多难度注意力训练游戏** - 数字顺序游戏，支持简单/中等/困难三种难度
- 📊 **独立排行榜系统** - 每种难度都有独立的排行榜，毫秒级精度计时
- 📱 **响应式设计** - 支持桌面端和移动端，自适应布局
- 🎨 **现代化UI** - 简洁美观的界面设计，一致的设计规范
- 🔒 **隐私保护** - 完整的隐私条款和数据处理规范，强制用户同意
- ⚡ **实时计时** - 毫秒级精度的实时计时器，增强紧迫感
- 🎯 **智能导航** - 隐私条款页面智能返回，用户体验优化
- 🚀 **一键部署** - 完整的腾讯云部署方案，支持自动化部署

## 技术栈

### 前端
- **React 18 + TypeScript** - 现代化前端框架，类型安全
- **Vite** - 快速构建工具，热重载开发体验
- **Tailwind CSS** - 原子化CSS框架，快速样式开发
- **React Router** - 客户端路由管理，SPA体验
- **Axios** - HTTP客户端，请求拦截和错误处理
- **Lucide React** - 现代化图标库，一致性设计

### 后端
- **Node.js + Express** - 高性能服务端框架
- **内存数据库** - 开发环境使用Map对象，避免编译问题
- **JWT** - 无状态身份认证，支持跨域
- **bcryptjs** - 密码加密存储，安全性保障
- **express-validator** - 数据验证中间件
- **PM2** - 生产环境进程管理，自动重启

### 部署和运维
- **Nginx** - 反向代理和静态文件服务
- **GitHub Actions** - CI/CD自动化部署
- **腾讯云 CVM** - 云服务器托管
- **Let's Encrypt** - 免费SSL证书

## 技术特性

### 🎯 用户体验优化
- **智能表单管理**：使用 `useRef` 避免状态重置，提升表单体验
- **实时计时器**：毫秒级精度，增强游戏紧迫感
- **智能导航**：隐私条款页面动态返回，用户体验流畅
- **页面滚动优化**：自动滚动到顶部，统一浏览体验

### 🔧 开发体验
- **TypeScript**：完整的类型定义，开发时错误检查
- **热重载**：Vite 快速开发，实时预览
- **代码规范**：ESLint + Prettier，代码质量保障
- **模块化设计**：组件化开发，易于维护和扩展

### 🚀 性能优化
- **代码分割**：React Router 懒加载，减少首屏加载时间
- **静态资源缓存**：Nginx 缓存策略，提升访问速度
- **进程管理**：PM2 集群模式，充分利用服务器资源
- **数据库优化**：内存数据库，快速读写操作

### 🔒 安全特性
- **密码加密**：bcryptjs 单向加密，安全存储
- **JWT 认证**：无状态认证，支持跨域访问
- **CORS 配置**：生产环境严格限制跨域请求
- **输入验证**：express-validator 防止恶意输入
- **安全头**：Helmet 中间件，防止常见攻击

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 安装所有依赖（前端+后端）
npm run install:all

# 或者分别安装
npm install
cd frontend && npm install
cd backend && npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cd backend
cp env.example .env
```

2. 编辑 `.env` 文件，配置必要的环境变量：
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
```

### 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端 (http://localhost:3000)
npm run dev:backend   # 后端 (http://localhost:5000)
```

### 构建生产版本

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 项目结构

```
ADHD/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/      # 组件 (Layout, PrivacyModal等)
│   │   ├── contexts/        # React上下文 (AuthContext)
│   │   ├── hooks/          # 自定义Hooks (useScrollToTop)
│   │   ├── lib/            # 工具函数 (api, utils)
│   │   ├── pages/          # 页面组件 (Login, Register, NumberGame等)
│   │   └── types/          # TypeScript类型定义
│   ├── public/             # 静态资源
│   └── package.json
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── routes/         # API路由 (auth, scores)
│   │   ├── database.js     # 数据库配置 (内存数据库)
│   │   └── index.js        # 服务器入口
│   ├── env.example         # 环境变量示例
│   └── package.json
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # 自动部署配置
├── ecosystem.config.js      # PM2 进程管理配置
├── nginx.conf              # Nginx 反向代理配置
├── deploy.sh               # 自动化部署脚本
├── DEPLOYMENT.md           # 详细部署指南
├── package.json            # 根目录配置
└── README.md
```

## API接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 成绩接口
- `POST /api/scores` - 提交游戏成绩 (支持难度参数)
- `GET /api/scores/:gameType?difficulty=xxx` - 获取指定难度的游戏排行榜
- `GET /api/scores/user/:gameType?difficulty=xxx` - 获取用户指定难度的个人成绩

### 健康检查
- `GET /api/health` - 服务健康状态检查

## 游戏说明

### 数字顺序游戏 - 三种难度模式

#### 🎯 简单模式
- 点击正确数字后，该数字会被标记为 ✓
- 查找范围逐渐减少，速度越来越快
- 适合初学者，帮助建立信心

#### ⚡ 中等模式
- 点击后数字不会标记，需要全局寻找
- 用户始终要在25个数字中寻找目标
- 需要更好的注意力集中能力

#### 🧠 困难模式
- 每次点击正确数字后，其他24个数字立即重新排列
- 使用户的记忆残留无效
- 需要极强的注意力和记忆力

### 游戏特性
- **毫秒级计时**：实时计时器，精确到百分之一秒
- **独立排行榜**：每种难度都有独立的排行榜
- **错误提示**：点击错误时会有友好提示
- **进度显示**：实时显示当前目标数字
- **一键重玩**：游戏完成后可立即重新开始

## 部署说明

### 🚀 腾讯云一键部署

项目提供了完整的腾讯云部署方案，包括：

#### 部署文件
- `ecosystem.config.js` - PM2 进程管理配置
- `nginx.conf` - Nginx 反向代理配置
- `deploy.sh` - 自动化部署脚本
- `.github/workflows/deploy.yml` - GitHub Actions 自动部署

#### 快速部署步骤

1. **准备服务器**
   ```bash
   # 购买腾讯云 CVM (建议：2核4GB，Ubuntu 20.04)
   # 开放端口：22(SSH), 80(HTTP), 443(HTTPS)
   ```

2. **一键部署**
   ```bash
   # 克隆项目
   cd /var/www
   sudo git clone https://github.com/your-username/adhd-app.git
   cd adhd-app
   
   # 配置环境变量
   cp backend/env.production.example backend/.env
   # 编辑 .env 文件
   
   # 运行部署脚本
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **配置 Nginx**
   ```bash
   # 复制配置文件
   sudo cp nginx.conf /etc/nginx/sites-available/adhd-app
   sudo ln -s /etc/nginx/sites-available/adhd-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### 自动化部署 (GitHub Actions)

1. **配置 GitHub Secrets**
   - `HOST`: 服务器IP地址
   - `USERNAME`: SSH用户名
   - `SSH_KEY`: SSH私钥

2. **推送代码自动部署**
   ```bash
   git push origin main
   # Actions 自动构建和部署
   ```

### 📋 详细部署指南

查看 [DEPLOYMENT.md](DEPLOYMENT.md) 获取完整的部署指南，包括：
- 服务器环境配置
- 域名和 SSL 证书配置
- 监控和维护
- 故障排除
- 安全建议

## 开发规范

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件和函数使用一致的命名规范

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请联系：
- 邮箱：support@adhd-training.com
- 项目地址：[GitHub Repository](https://github.com/your-username/adhd-platform)

## 更新日志

### v1.2.0 (2024-01-XX)
- ✨ **新增多难度游戏模式**：简单、中等、困难三种难度
- ⚡ **毫秒级实时计时**：精确到百分之一秒的计时器
- 📊 **独立排行榜系统**：每种难度都有独立的排行榜
- 🎯 **智能隐私条款**：一键同意并自动提交，优化用户体验
- 🚀 **完整部署方案**：腾讯云一键部署，支持自动化部署
- 🔧 **性能优化**：修复登录状态管理，优化页面滚动

### v1.1.0 (2024-01-XX)
- 🔐 **完善账号体系**：用户名/密码验证，隐私条款强制同意
- 🎮 **游戏功能增强**：错误提示优化，游戏状态管理
- 📱 **UI/UX 改进**：响应式设计，页面滚动优化
- 🔒 **隐私保护**：完整的隐私条款页面和弹窗

### v1.0.0 (2024-01-01)
- 🎉 **初始版本发布**
- 🔐 **完整的用户认证系统**：注册、登录、JWT认证
- 🎮 **数字顺序游戏**：5x5网格，1-25数字点击
- 📊 **排行榜功能**：成绩记录和展示
- 📱 **响应式设计**：支持多设备访问
- 🎨 **现代化UI**：Tailwind CSS设计系统 

---

**自动化部署测试 - 2025-07-26** 

**重新测试SSH密钥配置 - 2025-07-26** 

**修复SSH配置后重新测试 - 2025-07-26**

**调试SSH认证问题 - 2025-07-26** 

**修复用户名配置后重新测试 - 2025-07-26** 

**修复HOST配置后重新测试 - 2025-07-26**

**创建deploy.sh后重新测试自动化部署 - 2025-07-26** 