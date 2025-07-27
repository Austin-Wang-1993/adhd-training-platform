const { PrismaClient } = require('@prisma/client');

// 创建 Prisma 客户端实例
const prisma = new PrismaClient();

// 初始化数据库
async function initDatabase() {
  try {
    // 测试数据库连接
    await prisma.$connect();
    console.log('PostgreSQL数据库连接成功');
    
    // 检查数据库表是否存在
    const userCount = await prisma.user.count();
    console.log(`数据库初始化完成，当前用户数: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    throw error;
  }
}

// 用户相关操作
const userOperations = {
  // 创建用户
  createUser: async (username, passwordHash) => {
    try {
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash
        },
        select: {
          id: true,
          username: true,
          createdAt: true
        }
      });
      
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('用户名已存在');
      }
      throw error;
    }
  },

  // 根据用户名查找用户
  findByUsername: async (username) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // 根据ID查找用户
  findById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          createdAt: true
        }
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户列表（管理端用）
  getUsers: async (page = 1, limit = 10, search = '') => {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        username: {
          contains: search,
          mode: 'insensitive'
        }
      } : {};
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            username: true,
            createdAt: true,
            _count: {
              select: { scores: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);
      
      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  },

  // 删除用户（管理端用）
  deleteUser: async (id) => {
    try {
      await prisma.user.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

// 成绩相关操作
const scoreOperations = {
  // 创建成绩记录
  createScore: async (userId, gameType, score, time, difficulty = 'easy') => {
    try {
      const scoreRecord = await prisma.score.create({
        data: {
          userId,
          gameType,
          score,
          time,
          difficulty
        }
      });
      
      return scoreRecord;
    } catch (error) {
      throw error;
    }
  },

  // 获取游戏排行榜
  getLeaderboard: async (gameType, difficulty = 'easy', limit = 10) => {
    try {
      const leaderboard = await prisma.score.findMany({
        where: {
          gameType,
          difficulty
        },
        include: {
          user: {
            select: {
              username: true
            }
          }
        },
        orderBy: [
          { time: 'asc' },
          { createdAt: 'asc' }
        ],
        take: limit
      });
      
      return leaderboard.map(score => ({
        ...score,
        username: score.user.username
      }));
    } catch (error) {
      throw error;
    }
  },

  // 获取用户成绩
  getUserScores: async (userId, gameType, difficulty = 'easy') => {
    try {
      const scores = await prisma.score.findMany({
        where: {
          userId,
          gameType,
          difficulty
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return scores;
    } catch (error) {
      throw error;
    }
  },

  // 获取成绩统计（管理端用）
  getScoreStats: async () => {
    try {
      const stats = await prisma.score.groupBy({
        by: ['gameType', 'difficulty'],
        _count: {
          id: true
        },
        _avg: {
          time: true,
          score: true
        },
        _min: {
          time: true
        },
        _max: {
          time: true
        }
      });
      
      return stats;
    } catch (error) {
      throw error;
    }
  },

  // 删除成绩记录（管理端用）
  deleteScore: async (id) => {
    try {
      await prisma.score.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

// 管理端相关操作
const adminOperations = {
  // 创建管理员
  createAdmin: async (username, passwordHash, role = 'admin') => {
    try {
      const admin = await prisma.admin.create({
        data: {
          username,
          passwordHash,
          role
        },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });
      
      return admin;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('管理员用户名已存在');
      }
      throw error;
    }
  },

  // 管理员登录
  findByUsername: async (username) => {
    try {
      const admin = await prisma.admin.findUnique({
        where: { username }
      });
      
      return admin;
    } catch (error) {
      throw error;
    }
  }
};

// 系统配置操作
const configOperations = {
  // 获取配置
  getConfig: async (key) => {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key }
      });
      
      return config?.value;
    } catch (error) {
      throw error;
    }
  },

  // 设置配置
  setConfig: async (key, value, description = null) => {
    try {
      const config = await prisma.systemConfig.upsert({
        where: { key },
        update: { value, description },
        create: { key, value, description }
      });
      
      return config;
    } catch (error) {
      throw error;
    }
  }
};

// 用户活动日志操作
const activityOperations = {
  // 记录用户活动
  logActivity: async (userId, action, details = null, ipAddress = null, userAgent = null) => {
    try {
      const activity = await prisma.userActivity.create({
        data: {
          userId,
          action,
          details,
          ipAddress,
          userAgent
        }
      });
      
      return activity;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户活动日志（管理端用）
  getUserActivities: async (userId, page = 1, limit = 20) => {
    try {
      const skip = (page - 1) * limit;
      
      const [activities, total] = await Promise.all([
        prisma.userActivity.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.userActivity.count({ where: { userId } })
      ]);
      
      return {
        activities,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }
};

// 关闭数据库连接
async function closeDatabase() {
  try {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('关闭数据库连接失败:', error.message);
  }
}

module.exports = {
  initDatabase,
  userOperations,
  scoreOperations,
  adminOperations,
  configOperations,
  activityOperations,
  closeDatabase,
  prisma
}; 