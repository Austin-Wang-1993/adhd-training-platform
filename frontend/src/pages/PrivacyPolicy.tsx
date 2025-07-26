import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, FileText } from 'lucide-react';

// 隐私条款配置 - 可以在这里维护内容
const PRIVACY_CONTENT = {
  title: '隐私条款',
  lastUpdated: '2024年1月1日',
  sections: [
    {
      title: '1. 信息收集',
      icon: Eye,
      content: `
        <p>我们收集以下信息：</p>
        <ul>
          <li>用户名和密码（用于账号注册和登录）</li>
          <li>游戏成绩和训练数据（用于个人进度追踪和排行榜）</li>
          <li>使用时间和频率（用于改善用户体验）</li>
        </ul>
      `
    },
    {
      title: '2. 信息使用',
      icon: Users,
      content: `
        <p>我们使用收集的信息用于：</p>
        <ul>
          <li>提供个性化训练服务</li>
          <li>生成训练报告和进度分析</li>
          <li>维护排行榜功能</li>
          <li>改善平台功能和用户体验</li>
        </ul>
      `
    },
    {
      title: '3. 信息保护',
      icon: Lock,
      content: `
        <p>我们采取以下措施保护您的信息：</p>
        <ul>
          <li>使用加密技术保护数据传输和存储</li>
          <li>定期更新安全措施</li>
          <li>限制员工访问个人信息的权限</li>
        </ul>
      `
    },
    {
      title: '4. 信息共享',
      icon: Shield,
      content: `
        <p>我们不会向第三方出售、交易或转让您的个人信息，除非：</p>
        <ul>
          <li>获得您的明确同意</li>
          <li>法律要求或政府机构要求</li>
          <li>保护我们的权利和财产</li>
        </ul>
      `
    },
    {
      title: '5. 儿童隐私',
      icon: FileText,
      content: `
        <p>本平台专为ADHD儿童设计，我们特别重视儿童隐私保护：</p>
        <ul>
          <li>只收集必要的训练数据</li>
          <li>不收集儿童的个人身份信息</li>
          <li>家长可以随时查看和删除儿童数据</li>
        </ul>
      `
    },
    {
      title: '6. 您的权利',
      icon: Users,
      content: `
        <p>您有权：</p>
        <ul>
          <li>查看我们收集的您的信息</li>
          <li>更正不准确的信息</li>
          <li>删除您的账号和数据</li>
          <li>退出某些数据收集</li>
        </ul>
      `
    },
    {
      title: '7. 联系我们',
      icon: FileText,
      content: `
        <p>如果您对本隐私条款有任何疑问，请联系我们：</p>
        <p>邮箱：privacy@adhd-training.com</p>
      `
    }
  ]
};

export default function PrivacyPolicy() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 获取来源页面，默认为登录页面
  const from = location.state?.from || '/login';
  
  const handleBack = () => {
    navigate(from);
  };
  
  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>返回</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">隐私条款</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题和更新时间 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {PRIVACY_CONTENT.title}
            </h1>
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">
                最后更新时间：{PRIVACY_CONTENT.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* 隐私条款内容 */}
        <div className="space-y-6">
          {PRIVACY_CONTENT.sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div 
                      className="prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                重要提示
              </h3>
              <p className="text-blue-800">
                使用本平台即表示您同意本隐私条款。我们可能会不时更新此条款，
                更新后的条款将在平台上发布。建议您定期查看本条款的最新版本。
              </p>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center mt-8">
          <button
            onClick={handleBack}
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </button>
        </div>
      </div>
    </div>
  );
} 