const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 创建超级管理员
    const adminPassword = 'admin123456';
    const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
    
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'super_admin'
      }
    });
    
    console.log('✅ 超级管理员创建成功');
    console.log(`   用户名: ${admin.username}`);
    console.log(`   密码: ${adminPassword}`);
    console.log(`   角色: ${admin.role}`);
    
    // 创建一些系统配置
    const configs = [
      {
        key: 'site_name',
        value: 'ADHD训练平台',
        description: '网站名称'
      },
      {
        key: 'site_description',
        value: '专为ADHD儿童设计的注意力训练平台',
        description: '网站描述'
      },
      {
        key: 'contact_email',
        value: 'contact@adhd-training.com',
        description: '联系邮箱'
      },
      {
        key: 'privacy_policy_version',
        value: '1.0',
        description: '隐私条款版本'
      }
    ];
    
    for (const config of configs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: { value: config.value, description: config.description },
        create: config
      });
    }
    
    console.log('✅ 系统配置初始化完成');
    
    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📋 管理端登录信息：');
    console.log(`   地址: http://localhost:5000/api/admin/login`);
    console.log(`   用户名: admin`);
    console.log(`   密码: ${adminPassword}`);
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('\n✅ 初始化脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 初始化脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 