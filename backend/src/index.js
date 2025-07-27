const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const adminRoutes = require('./routes/admin');
const { initDatabase, closeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://your-domain.com', 'https://your-domain.com'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ADHD训练平台API运行正常' });
});

// 隐私条款页面
app.get('/privacy-policy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>隐私条款 - ADHD训练平台</title>
        <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #374151; margin-top: 30px; }
            p { color: #4b5563; margin-bottom: 15px; }
            .highlight { background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        </style>
    </head>
    <body>
        <h1>隐私条款</h1>
        
        <div class="highlight">
            <p><strong>最后更新时间：</strong>2024年1月1日</p>
        </div>

        <h2>1. 信息收集</h2>
        <p>我们收集以下信息：</p>
        <ul>
            <li>用户名和密码（用于账号注册和登录）</li>
            <li>游戏成绩和训练数据（用于个人进度追踪和排行榜）</li>
            <li>使用时间和频率（用于改善用户体验）</li>
        </ul>

        <h2>2. 信息使用</h2>
        <p>我们使用收集的信息用于：</p>
        <ul>
            <li>提供个性化训练服务</li>
            <li>生成训练报告和进度分析</li>
            <li>维护排行榜功能</li>
            <li>改善平台功能和用户体验</li>
        </ul>

        <h2>3. 信息保护</h2>
        <p>我们采取以下措施保护您的信息：</p>
        <ul>
            <li>使用加密技术保护数据传输和存储</li>
            <li>定期更新安全措施</li>
            <li>限制员工访问个人信息的权限</li>
        </ul>

        <h2>4. 信息共享</h2>
        <p>我们不会向第三方出售、交易或转让您的个人信息，除非：</p>
        <ul>
            <li>获得您的明确同意</li>
            <li>法律要求或政府机构要求</li>
            <li>保护我们的权利和财产</li>
        </ul>

        <h2>5. 儿童隐私</h2>
        <p>本平台专为ADHD儿童设计，我们特别重视儿童隐私保护：</p>
        <ul>
            <li>只收集必要的训练数据</li>
            <li>不收集儿童的个人身份信息</li>
            <li>家长可以随时查看和删除儿童数据</li>
        </ul>

        <h2>6. 您的权利</h2>
        <p>您有权：</p>
        <ul>
            <li>查看我们收集的您的信息</li>
            <li>更正不准确的信息</li>
            <li>删除您的账号和数据</li>
            <li>退出某些数据收集</li>
        </ul>

        <h2>7. 联系我们</h2>
        <p>如果您对本隐私条款有任何疑问，请联系我们：</p>
        <p>邮箱：privacy@adhd-training.com</p>

        <div class="highlight">
            <p><strong>注意：</strong>使用本平台即表示您同意本隐私条款。我们可能会不时更新此条款，更新后的条款将在平台上发布。</p>
        </div>
    </body>
    </html>
  `);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误' 
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: '接口不存在' 
  });
});

// 启动服务器
async function startServer() {
  try {
    // 初始化数据库
    await initDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
      console.log(`健康检查: http://localhost:${PORT}/api/health`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，正在关闭服务器...');
      server.close(() => {
        console.log('HTTP 服务器已关闭');
        closeDatabase();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('收到 SIGINT 信号，正在关闭服务器...');
      server.close(() => {
        console.log('HTTP 服务器已关闭');
        closeDatabase();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer(); 