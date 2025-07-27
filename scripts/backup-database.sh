#!/bin/bash
set -e

# 备份配置
BACKUP_DIR="/var/backups/adhd-db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="adhd_db_backup_$DATE.sql"
RETENTION_DAYS=7

echo "开始备份 ADHD 数据库..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "执行数据库备份..."
PGPASSWORD=adhd_password_2024 pg_dump -h localhost -U adhd_user -d adhd_db > "$BACKUP_DIR/$BACKUP_FILE"

# 压缩备份文件
echo "压缩备份文件..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "✅ 数据库备份成功: $BACKUP_DIR/$BACKUP_FILE.gz"
    
    # 显示备份文件大小
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)
    echo "📊 备份文件大小: $BACKUP_SIZE"
else
    echo "❌ 数据库备份失败"
    exit 1
fi

# 清理旧备份文件
echo "清理旧备份文件（保留 $RETENTION_DAYS 天）..."
find $BACKUP_DIR -name "adhd_db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# 显示当前备份文件列表
echo ""
echo "📋 当前备份文件列表："
ls -lh $BACKUP_DIR/adhd_db_backup_*.sql.gz 2>/dev/null || echo "暂无备份文件"

echo ""
echo "🎉 数据库备份完成！" 