const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { scoreOperations } = require('../database');

const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证用户身份的中间件
const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证token'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      });
    }
    
    console.error('认证失败:', error);
    res.status(500).json({
      success: false,
      message: '认证失败'
    });
  }
};

// 提交游戏成绩
router.post('/', [
  authenticateUser,
  body('gameType')
    .notEmpty().withMessage('游戏类型不能为空')
    .isString().withMessage('游戏类型必须是字符串'),
  body('score')
    .notEmpty().withMessage('分数不能为空')
    .isInt({ min: 0 }).withMessage('分数必须是正整数'),
  body('time')
    .notEmpty().withMessage('时间不能为空')
    .isFloat({ min: 0.001 }).withMessage('时间必须是正数（支持毫秒精度）'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard']).withMessage('难度必须是 easy、medium 或 hard')
], (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { gameType, score, time, difficulty = 'easy' } = req.body;
    const userId = req.user.userId;

    // 创建成绩记录
    const newScore = scoreOperations.createScore(userId, gameType, score, time, difficulty);

    res.json({
      success: true,
      data: {
        id: newScore.id,
        userId: newScore.userId,
        gameType: newScore.gameType,
        score: newScore.score,
        time: newScore.time,
        difficulty: newScore.difficulty,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('提交成绩失败:', error);
    res.status(500).json({
      success: false,
      message: '提交成绩失败，请重试'
    });
  }
});

// 获取游戏排行榜
router.get('/:gameType', (req, res) => {
  try {
    const { gameType } = req.params;
    const { difficulty = 'easy', limit: limitParam } = req.query;
    const limit = parseInt(limitParam) || 10;

    // 验证游戏类型
    const validGameTypes = ['number-game'];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({
        success: false,
        message: '无效的游戏类型'
      });
    }

    // 验证难度
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: '无效的难度级别'
      });
    }

    // 获取排行榜
    const leaderboard = scoreOperations.getLeaderboard(gameType, difficulty, limit);

    res.json({
      success: true,
      data: leaderboard.map(score => ({
        id: score.id,
        userId: score.user_id,
        username: score.username,
        gameType: score.game_type,
        score: score.score,
        time: score.time,
        difficulty: score.difficulty,
        createdAt: score.created_at
      }))
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      success: false,
      message: '获取排行榜失败，请重试'
    });
  }
});

// 获取用户个人成绩
router.get('/user/:gameType', [
  authenticateUser
], (req, res) => {
  try {
    const { gameType } = req.params;
    const { difficulty = 'easy' } = req.query;
    const userId = req.user.userId;

    // 验证游戏类型
    const validGameTypes = ['number-game'];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({
        success: false,
        message: '无效的游戏类型'
      });
    }

    // 验证难度
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: '无效的难度级别'
      });
    }

    // 获取用户成绩
    const userScores = scoreOperations.getUserScores(userId, gameType, difficulty);

    res.json({
      success: true,
      data: userScores.map(score => ({
        id: score.id,
        userId: score.user_id,
        gameType: score.game_type,
        score: score.score,
        time: score.time,
        difficulty: score.difficulty,
        createdAt: score.created_at
      }))
    });
  } catch (error) {
    console.error('获取用户成绩失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户成绩失败，请重试'
    });
  }
});

module.exports = router; 