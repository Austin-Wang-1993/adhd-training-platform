const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { adminOperations, userOperations, scoreOperations, configOperations, activityOperations } = require('../database');

const router = express.Router();

// JWT密钥
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-admin-secret-key';

// 验证管理员身份的中间件
const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证token'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      });
    }
    
    console.error('管理员认证失败:', error);
    res.status(500).json({
      success: false,
      message: '认证失败'
    });
  }
};

// 管理员登录
router.post('/login', [
  body('username')
    .notEmpty().withMessage('用户名不能为空'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { username, password } = req.body;

    // 查找管理员
    const admin = await adminOperations.findByUsername(username);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: admin.role },
      ADMIN_JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          createdAt: admin.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('管理员登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请重试'
    });
  }
});

// 获取用户列表
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const result = await userOperations.getUsers(
      parseInt(page),
      parseInt(limit),
      search
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户列表失败'
    });
  }
});

// 删除用户
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await userOperations.deleteUser(id);

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败'
    });
  }
});

// 获取成绩统计
router.get('/stats/scores', authenticateAdmin, async (req, res) => {
  try {
    const stats = await scoreOperations.getScoreStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取成绩统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取成绩统计失败'
    });
  }
});

// 删除成绩记录
router.delete('/scores/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await scoreOperations.deleteScore(id);

    res.json({
      success: true,
      message: '成绩记录删除成功'
    });
  } catch (error) {
    console.error('删除成绩记录失败:', error);
    res.status(500).json({
      success: false,
      message: '删除成绩记录失败'
    });
  }
});

// 获取系统配置
router.get('/config/:key', authenticateAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    
    const value = await configOperations.getConfig(key);

    res.json({
      success: true,
      data: { key, value }
    });
  } catch (error) {
    console.error('获取系统配置失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统配置失败'
    });
  }
});

// 设置系统配置
router.post('/config', authenticateAdmin, [
  body('key')
    .notEmpty().withMessage('配置键不能为空'),
  body('value')
    .notEmpty().withMessage('配置值不能为空')
], async (req, res) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { key, value, description } = req.body;
    
    const config = await configOperations.setConfig(key, value, description);

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('设置系统配置失败:', error);
    res.status(500).json({
      success: false,
      message: '设置系统配置失败'
    });
  }
});

// 获取用户活动日志
router.get('/activities/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await activityOperations.getUserActivities(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('获取用户活动日志失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户活动日志失败'
    });
  }
});

// 创建管理员（仅超级管理员可用）
router.post('/admins', authenticateAdmin, [
  body('username')
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20位'),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6, max: 20 }).withMessage('密码长度6-20位'),
  body('role')
    .optional()
    .isIn(['admin', 'super_admin']).withMessage('角色必须是 admin 或 super_admin')
], async (req, res) => {
  try {
    // 检查权限
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { username, password, role = 'admin' } = req.body;

    // 加密密码
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    // 创建管理员
    const admin = await adminOperations.createAdmin(username, passwordHash, role);

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('创建管理员失败:', error);
    res.status(500).json({
      success: false,
      message: error.message || '创建管理员失败'
    });
  }
});

module.exports = router; 