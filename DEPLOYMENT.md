# ADHD训练平台部署指南

## 部署到腾讯云

### 1. 服务器准备

#### 1.1 购买腾讯云 CVM
- 选择 Ubuntu 20.04 LTS 或 CentOS 8
- 建议配置：2核4GB内存，50GB系统盘
- 开放端口：22(SSH), 80(HTTP), 443(HTTPS)

#### 1.2 连接服务器
```bash
ssh root@your-server-ip
```

### 2. 环境安装

#### 2.1 更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2.2 安装 Node.js
```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 2.3 安装 Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 2.4 安装 Git
```bash
sudo apt install git -y
```

### 3. 项目部署

#### 3.1 克隆项目
```bash
cd /var/www
sudo git clone https://github.com/your-username/adhd-app.git
sudo chown -R $USER:$USER adhd-app
cd adhd-app
```

#### 3.2 配置环境变量
```bash
# 复制环境变量文件
cp backend/env.production.example backend/.env

# 编辑环境变量
nano backend/.env
```

修改以下内容：
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### 3.3 配置 Nginx
```bash
# 复制 Nginx 配置
sudo cp nginx.conf /etc/nginx/sites-available/adhd-app

# 创建软链接
sudo ln -s /etc/nginx/sites-available/adhd-app /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 3.4 运行部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. 配置 GitHub Actions（可选）

#### 4.1 在 GitHub 仓库设置 Secrets
- `HOST`: 服务器IP地址
- `USERNAME`: SSH用户名（通常是root）
- `SSH_KEY`: SSH私钥

#### 4.2 推送代码触发自动部署
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### 5. 域名配置（可选）

#### 5.1 购买域名
在腾讯云或其他域名服务商购买域名

#### 5.2 配置 DNS
将域名解析到服务器IP

#### 5.3 配置 SSL 证书
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. 监控和维护

#### 6.1 查看服务状态
```bash
# 查看 PM2 进程
pm2 status

# 查看日志
pm2 logs adhd-backend

# 查看 Nginx 状态
sudo systemctl status nginx
```

#### 6.2 更新部署
```bash
cd /var/www/adhd-app
git pull origin main
./deploy.sh
```

#### 6.3 备份数据
```bash
# 备份项目文件
tar -czf adhd-app-backup-$(date +%Y%m%d).tar.gz /var/www/adhd-app

# 备份 Nginx 配置
sudo cp /etc/nginx/sites-available/adhd-app /backup/
```

### 7. 故障排除

#### 7.1 常见问题
- **端口被占用**: `sudo netstat -tlnp | grep :80`
- **权限问题**: `sudo chown -R $USER:$USER /var/www/adhd-app`
- **服务启动失败**: 查看日志 `pm2 logs adhd-backend`

#### 7.2 性能优化
- 启用 Nginx 缓存
- 配置 PM2 集群模式
- 使用 CDN 加速静态资源

### 8. 安全建议

- 修改默认 SSH 端口
- 配置防火墙规则
- 定期更新系统和依赖
- 使用强密码和 SSH 密钥
- 配置 SSL 证书
- 定期备份数据

## 访问地址

部署完成后，可以通过以下地址访问：
- 前端: `http://your-domain.com` 或 `http://your-server-ip`
- API: `http://your-domain.com/api` 或 `http://your-server-ip/api`
- 健康检查: `http://your-domain.com/api/health` 