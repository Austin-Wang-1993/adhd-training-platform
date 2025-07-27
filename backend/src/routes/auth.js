const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { userOperations } = require('../database');

const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 验证用户名格式
const validateUsername = (value) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!regex.test(value)) {
    throw new Error('用户名长度3-20位，只允许字母、数字、下划线');
  }
  return true;
};

// 验证密码格式
const validatePassword = (value) => {
  const regex = /^[a-zA-Z0-9_]{6,20}$/;
  if (!regex.test(value)) {
    throw new Error('密码长度6-20位，只允许字母、数字、下划线');
  }
  return true;
};

// 注册路由
router.post('/register', [
  body('username')
    .notEmpty().withMessage('用户名不能为空')
    .custom(validateUsername),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .custom(validatePassword),
  body('confirmPassword')
    .notEmpty().withMessage('确认密码不能为空')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('两次输入的密码不一致');
      }
      return true;
    }),
  body('agreeToTerms')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('必须同意隐私条款');
      }
      return true;
    })
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

    // 检查用户名是否已存在
    const existingUser = await userOperations.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 加密密码
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    // 创建用户
    const user = await userOperations.createUser(username, passwordHash);

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
        },
        token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请重试'
    });
  }
});

// 登录路由
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

    // 查找用户
    const user = await userOperations.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请重试'
    });
  }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
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

    const user = await userOperations.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      });
    }
    
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

module.exports = router; 