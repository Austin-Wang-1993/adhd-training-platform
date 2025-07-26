
import { Link } from 'react-router-dom';
import { Brain, Target, Users, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到ADHD儿童注意力训练平台
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          专为注意力缺陷多动障碍（ADHD）儿童设计的科学训练平台，
          通过有趣的游戏帮助孩子们提升注意力、专注力和认知能力。
        </p>
      </div>

      {/* 什么是ADHD */}
      <div className="card">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Brain className="h-12 w-12 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">什么是ADHD？</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                <strong>注意力缺陷多动障碍（ADHD）</strong>是一种神经发育障碍，
                主要表现为注意力不集中、冲动和多动。ADHD儿童在学习和日常生活中
                常常面临注意力难以集中、容易分心、难以完成任务等挑战。
              </p>
              <p className="text-gray-700">
                通过科学的训练和干预，ADHD儿童可以显著改善注意力水平，
                提升学习效率和日常生活质量。我们的平台正是为此而设计。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 平台特色 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Target className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">科学训练</h3>
          <p className="text-gray-600">
            基于认知科学和神经心理学原理设计的训练游戏，
            有效提升注意力集中能力。
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">个性化体验</h3>
          <p className="text-gray-600">
            根据每个孩子的特点和进度，提供个性化的训练方案，
            确保训练效果最大化。
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Award className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">趣味性强</h3>
          <p className="text-gray-600">
            将训练融入有趣的游戏中，让孩子们在快乐中提升能力，
            保持长期参与的动力。
          </p>
        </div>
      </div>

      {/* 训练游戏介绍 */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">训练游戏</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">数字顺序游戏</h3>
            <p className="text-gray-600 mb-4">
              在5x5的方格中按顺序点击数字1-25，训练视觉注意力和空间记忆能力。
              游戏会记录完成时间，帮助追踪进步。
            </p>
            <Link
              to="/number-game"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              开始游戏
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">更多游戏开发中</h3>
            <p className="text-gray-600 mb-4">
              我们正在开发更多有趣的训练游戏，包括听觉注意力训练、
              工作记忆训练等，敬请期待！
            </p>
            <span className="text-gray-500 text-sm">即将推出</span>
          </div>
        </div>
      </div>

      {/* 使用建议 */}
      <div className="card bg-primary-50 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">使用建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">训练频率</h3>
            <p className="text-gray-700">
              建议每天进行15-30分钟的训练，保持规律性。
              可以根据孩子的具体情况调整训练时长。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">环境要求</h3>
            <p className="text-gray-700">
              选择安静、无干扰的环境进行训练，确保孩子能够专注。
              建议在固定时间进行训练，培养良好的习惯。
            </p>
          </div>
        </div>
      </div>

      {/* 开始训练 */}
      <div className="text-center">
        <Link
          to="/number-game"
          className="btn-primary inline-flex items-center text-lg px-8 py-3"
        >
          开始注意力训练
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
} 