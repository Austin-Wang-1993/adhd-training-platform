# 数据库设置指南

## 概述

本项目使用 **PostgreSQL + Prisma ORM** 作为数据库解决方案。**推荐在现有服务器上安装 PostgreSQL**，无需额外购买数据库实例。

## 🏠 推荐方案：本地 PostgreSQL（经济实惠）

### ✅ 优势
- **零额外成本**：利用现有服务器资源
- **简单部署**：一键安装脚本
- **完全控制**：自主管理数据库
- **低延迟**：同服务器部署，访问速度快

### 🚀 快速部署

#### 1. 自动安装（推荐）
```bash
# 在服务器上运行
chmod +x scripts/install-postgresql.sh
./scripts/install-postgresql.sh
```

#### 2. 手动安装
```bash
# 更新系统
sudo apt update

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql << EOF
CREATE DATABASE adhd_db;
CREATE USER adhd_user WITH PASSWORD 'adhd_password_2024';
GRANT ALL PRIVILEGES ON DATABASE adhd_db TO adhd_user;
ALTER USER adhd_user CREATEDB;
\q
EOF
```

### 📋 数据库信息
- **主机**: localhost
- **端口**: 5432
- **数据库**: adhd_db
- **用户名**: adhd_user
- **密码**: adhd_password_2024
- **连接字符串**: `postgresql://adhd_user:adhd_password_2024@localhost:5432/adhd_db`

## 🔧 部署流程

### 1. 更新部署脚本
部署脚本已自动包含 PostgreSQL 安装和配置：

```bash
# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 2. 环境变量配置
```env
# backend/.env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
ADMIN_JWT_SECRET=your-admin-jwt-secret-key
DATABASE_URL=postgresql://adhd_user:adhd_password_2024@localhost:5432/adhd_db
```

### 3. 数据库初始化
```bash
cd backend
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 创建数据库表
npm run db:init      # 初始化管理员账号
```

## 📊 管理端功能

### 登录信息
- **地址**: `http://your-domain.com/api/admin/login`
- **用户名**: `admin`
- **密码**: `admin123456`

### 主要功能
- **用户管理**: 查看、搜索、删除用户
- **成绩统计**: 数据分析和报表
- **系统配置**: 动态配置管理
- **活动日志**: 用户行为追踪

## 💾 数据备份

### 自动备份
```bash
# 运行备份脚本
chmod +x scripts/backup-database.sh
./scripts/backup-database.sh
```

### 定时备份
```bash
# 添加到 crontab（每天凌晨2点备份）
crontab -e
0 2 * * * /var/www/adhd-app/scripts/backup-database.sh
```

### 备份恢复
```bash
# 恢复数据库
gunzip -c backup_file.sql.gz | PGPASSWORD=adhd_password_2024 psql -h localhost -U adhd_user -d adhd_db
```

## 🔍 监控和维护

### 服务状态检查
```bash
# 检查 PostgreSQL 服务状态
sudo systemctl status postgresql

# 检查数据库连接
PGPASSWORD=adhd_password_2024 psql -h localhost -U adhd_user -d adhd_db -c "SELECT version();"
```

### 日志查看
```bash
# PostgreSQL 日志
sudo tail -f /var/log/postgresql/postgresql-*.log

# 应用日志
pm2 logs adhd-backend
```

### 性能监控
```bash
# 查看数据库大小
PGPASSWORD=adhd_password_2024 psql -h localhost -U adhd_user -d adhd_db -c "SELECT pg_size_pretty(pg_database_size('adhd_db'));"

# 查看表大小
PGPASSWORD=adhd_password_2024 psql -h localhost -U adhd_user -d adhd_db -c "SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname='public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## 🆚 方案对比

| 方案 | 成本 | 复杂度 | 控制权 | 推荐度 |
|------|------|--------|--------|--------|
| **本地 PostgreSQL** | 零成本 | 简单 | 完全控制 | ⭐⭐⭐⭐⭐ |
| 腾讯云 PostgreSQL | 月费 | 中等 | 部分控制 | ⭐⭐⭐ |

## 🚨 注意事项

### 安全配置
1. **修改默认密码**：部署后立即修改数据库密码
2. **防火墙设置**：确保只允许本地访问
3. **定期备份**：设置自动备份策略
4. **监控告警**：监控磁盘空间和性能

### 性能优化
1. **内存配置**：根据服务器内存调整 PostgreSQL 配置
2. **连接池**：配置合适的连接池大小
3. **索引优化**：为常用查询添加索引
4. **定期维护**：定期执行 VACUUM 和 ANALYZE

## 🔧 故障排除

### 常见问题

1. **连接失败**
   ```bash
   # 检查服务状态
   sudo systemctl status postgresql
   
   # 检查端口监听
   sudo netstat -tlnp | grep 5432
   ```

2. **权限错误**
   ```bash
   # 重新配置认证
   sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf
   sudo systemctl restart postgresql
   ```

3. **磁盘空间不足**
   ```bash
   # 清理旧备份
   find /var/backups/adhd-db -name "*.sql.gz" -mtime +7 -delete
   
   # 清理日志
   sudo journalctl --vacuum-time=7d
   ```

## 📞 技术支持

- **Prisma 文档**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **PostgreSQL 文档**: [https://www.postgresql.org/docs](https://www.postgresql.org/docs)
- **项目文档**: 查看 `README.md` 和代码注释 