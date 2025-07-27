#!/bin/bash
set -e

echo "开始安装 PostgreSQL..."

# 更新系统包
sudo apt update

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 检查服务状态
echo "PostgreSQL 服务状态："
sudo systemctl status postgresql --no-pager

# 切换到 postgres 用户创建数据库和用户
echo "创建数据库和用户..."
sudo -u postgres psql << EOF
CREATE DATABASE adhd_db;
CREATE USER adhd_user WITH PASSWORD 'adhd_password_2024';
GRANT ALL PRIVILEGES ON DATABASE adhd_db TO adhd_user;
ALTER USER adhd_user CREATEDB;
\q
EOF

# 配置 PostgreSQL 允许本地连接
echo "配置 PostgreSQL 连接..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/*/main/postgresql.conf

# 配置认证方式
sudo sed -i 's/local   all             postgres                                peer/local   all             postgres                                md5/' /etc/postgresql/*/main/pg_hba.conf
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf

# 重启 PostgreSQL 服务
sudo systemctl restart postgresql

# 测试连接
echo "测试数据库连接..."
PGPASSWORD=adhd_password_2024 psql -h localhost -U adhd_user -d adhd_db -c "SELECT version();"

echo "✅ PostgreSQL 安装完成！"
echo ""
echo "📋 数据库连接信息："
echo "   主机: localhost"
echo "   端口: 5432"
echo "   数据库: adhd_db"
echo "   用户名: adhd_user"
echo "   密码: adhd_password_2024"
echo ""
echo "🔗 连接字符串："
echo "   postgresql://adhd_user:adhd_password_2024@localhost:5432/adhd_db"
echo ""
echo "📝 请将这些信息添加到环境变量中" 