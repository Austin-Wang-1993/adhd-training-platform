const fs = require('fs');
const path = require('path');

console.log('🔍 检查ADHD训练平台项目设置...\n');

// 检查必要的文件是否存在
const requiredFiles = [
  'package.json',
  'frontend/package.json',
  'backend/package.json',
  'frontend/src/App.tsx',
  'backend/src/index.js',
  'README.md',
  '.gitignore'
];

const requiredDirs = [
  'frontend/src',
  'frontend/public',
  'backend/src',
  'backend/data',
  '.github/workflows'
];

let allGood = true;

console.log('📁 检查必要文件:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 缺失`);
    allGood = false;
  }
});

console.log('\n📂 检查必要目录:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - 缺失`);
    allGood = false;
  }
});

// 检查package.json内容
console.log('\n📦 检查package.json配置:');
try {
  const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  
  console.log(`✅ 根目录package.json - 脚本: ${Object.keys(rootPackage.scripts).join(', ')}`);
  console.log(`✅ 前端package.json - 依赖: ${Object.keys(frontendPackage.dependencies).length}个`);
  console.log(`✅ 后端package.json - 依赖: ${Object.keys(backendPackage.dependencies).length}个`);
} catch (error) {
  console.log(`❌ package.json解析失败: ${error.message}`);
  allGood = false;
}

// 检查环境配置
console.log('\n⚙️ 检查环境配置:');
if (fs.existsSync('backend/env.example')) {
  console.log('✅ 环境变量示例文件存在');
} else {
  console.log('❌ 环境变量示例文件缺失');
  allGood = false;
}

// 检查GitHub Actions
console.log('\n🚀 检查GitHub Actions:');
if (fs.existsSync('.github/workflows/deploy.yml')) {
  console.log('✅ GitHub Actions部署配置存在');
} else {
  console.log('❌ GitHub Actions部署配置缺失');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 项目设置检查完成！所有必要文件都存在。');
  console.log('\n📋 下一步操作:');
  console.log('1. 运行 npm run install:all 安装依赖');
  console.log('2. 复制 backend/env.example 到 backend/.env 并配置');
  console.log('3. 运行 npm run dev 启动开发服务器');
  console.log('4. 访问 http://localhost:3000 查看前端');
  console.log('5. 访问 http://localhost:5000/api/health 检查后端');
} else {
  console.log('⚠️ 项目设置检查发现问题，请检查上述缺失的文件和目录。');
}

console.log('\n📚 更多信息请查看 README.md 文件'); 