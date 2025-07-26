// 简单的内存数据库实现
// 注意：这只是用于开发测试，生产环境应该使用真实的数据库

// 内存存储
const users = new Map();
const scores = new Map();

// 生成UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 初始化数据库
function initDatabase() {
  console.log('内存数据库初始化完成');
  console.log('注意：这是开发模式，数据不会持久化保存');
}

// 用户相关操作
const userOperations = {
  // 创建用户
  createUser: (username, passwordHash) => {
    try {
      const id = generateId();
      const user = {
        id,
        username,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      };
      users.set(id, user);
      return { id, username };
    } catch (error) {
      throw error;
    }
  },

  // 根据用户名查找用户
  findByUsername: (username) => {
    try {
      for (const user of users.values()) {
        if (user.username === username) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // 根据ID查找用户
  findById: (id) => {
    try {
      const user = users.get(id);
      if (user) {
        return {
          id: user.id,
          username: user.username,
          created_at: user.created_at
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};

// 成绩相关操作
const scoreOperations = {
  // 创建成绩记录
  createScore: (userId, gameType, score, time, difficulty = 'easy') => {
    try {
      const id = generateId();
      const scoreRecord = {
        id,
        user_id: userId,
        game_type: gameType,
        score,
        time, // 现在存储毫秒级时间
        difficulty,
        created_at: new Date().toISOString()
      };
      scores.set(id, scoreRecord);
      return { id, userId, gameType, score, time, difficulty };
    } catch (error) {
      throw error;
    }
  },

  // 获取游戏排行榜
  getLeaderboard: (gameType, difficulty = 'easy', limit = 10) => {
    try {
      const gameScores = Array.from(scores.values())
        .filter(score => score.game_type === gameType && score.difficulty === difficulty)
        .sort((a, b) => {
          // 按时间升序，时间相同时按创建时间升序
          if (a.time !== b.time) {
            return a.time - b.time;
          }
          return new Date(a.created_at) - new Date(b.created_at);
        })
        .slice(0, limit);

      // 添加用户名信息
      return gameScores.map(score => {
        const user = users.get(score.user_id);
        return {
          ...score,
          username: user ? user.username : '未知用户'
        };
      });
    } catch (error) {
      throw error;
    }
  },

  // 获取用户成绩
  getUserScores: (userId, gameType, difficulty = 'easy') => {
    try {
      return Array.from(scores.values())
        .filter(score => score.user_id === userId && score.game_type === gameType && score.difficulty === difficulty)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  initDatabase,
  userOperations,
  scoreOperations
}; 