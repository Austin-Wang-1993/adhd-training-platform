@echo off
echo 启动ADHD训练平台开发环境...
echo.

echo 检查Node.js版本...
node --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js 16+
    pause
    exit /b 1
)

echo.
echo 安装依赖...
call npm run install:all
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 启动开发服务器...
call npm run dev

pause 