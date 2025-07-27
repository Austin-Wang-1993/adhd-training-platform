const fs = require('fs');
const path = require('path');

// 数据文件路径
const dataDir = path.join(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');
const scoresFile = path.join(dataDir, 'scores.json');

// 内存存储（用于缓存）
let users = new Map();
let scores = new Map();

// 生成UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 从文件加载数据
function loadData() {
  try {
    if (fs.existsSync(usersFile)) {
      const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      users = new Map(Object.entries(usersData));
    }
    
    if (fs.existsSync(scoresFile)) {
      const scoresData = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
      scores = new Map(Object.entries(scoresData));
    }
  } catch (error) {
    console.error('加载数据失败:', error.message);
    // 如果文件损坏，使用空数据
    users = new Map();
    scores = new Map();
  }
}

// 保存数据到文件
function saveData() {
  try {
    ensureDataDir();
    
    // 将 Map 转换为对象
    const usersObj = Object.fromEntries(users);
    const scoresObj = Object.fromEntries(scores);
    
    fs.writeFileSync(usersFile, JSON.stringify(usersObj, null, 2));
    fs.writeFileSync(scoresFile, JSON.stringify(scoresObj, null, 2));
  } catch (error) {
    console.error('保存数据失败:', error.message);
  }
}

// 初始化数据库
function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      ensureDataDir();
      loadData();
      console.log('文件数据库初始化完成');
      console.log(`用户数据文件: ${usersFile}`);
      console.log(`成绩数据文件: ${scoresFile}`);
      resolve();
    } catch (error) {
      console.error('数据库初始化失败:', error.message);
      reject(error);
    }
  });
}

// 用户相关操作
const userOperations = {
  // 创建用户
  createUser: (username, passwordHash) => {
    return new Promise((resolve, reject) => {
      try {
        const id = generateId();
        const user = {
          id,
          username,
          password_hash: passwordHash,
          created_at: new Date().toISOString()
        };
        
        users.set(id, user);
        saveData();
        
        resolve({ id, username });
      } catch (error) {
        reject(error);
      }
    });
  },

  // 根据用户名查找用户
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      try {
        for (const user of users.values()) {
          if (user.username === username) {
            resolve(user);
            return;
          }
        }
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  },

  // 根据ID查找用户
  findById: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const user = users.get(id);
        if (user) {
          resolve({
            id: user.id,
            username: user.username,
            created_at: user.created_at
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};

// 成绩相关操作
const scoreOperations = {
  // 创建成绩记录
  createScore: (userId, gameType, score, time, difficulty = 'easy') => {
    return new Promise((resolve, reject) => {
      try {
        const id = generateId();
        const scoreRecord = {
          id,
          user_id: userId,
          game_type: gameType,
          score,
          time, // 存储毫秒级时间
          difficulty,
          created_at: new Date().toISOString()
        };
        
        scores.set(id, scoreRecord);
        saveData();
        
        resolve({ id, userId, gameType, score, time, difficulty });
      } catch (error) {
        reject(error);
      }
    });
  },

  // 获取游戏排行榜
  getLeaderboard: (gameType, difficulty = 'easy', limit = 10) => {
    return new Promise((resolve, reject) => {
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
        const result = gameScores.map(score => {
          const user = users.get(score.user_id);
          return {
            ...score,
            username: user ? user.username : '未知用户'
          };
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },

  // 获取用户成绩
  getUserScores: (userId, gameType, difficulty = 'easy') => {
    return new Promise((resolve, reject) => {
      try {
        const userScores = Array.from(scores.values())
          .filter(score => score.user_id === userId && score.game_type === gameType && score.difficulty === difficulty)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        resolve(userScores);
      } catch (error) {
        reject(error);
      }
    });
  }
};

// 关闭数据库连接
function closeDatabase() {
  try {
    saveData();
    console.log('数据已保存到文件');
  } catch (error) {
    console.error('保存数据失败:', error.message);
  }
}

module.exports = {
  initDatabase,
  userOperations,
  scoreOperations,
  closeDatabase
}; 