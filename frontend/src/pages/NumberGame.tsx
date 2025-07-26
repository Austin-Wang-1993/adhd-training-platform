import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Clock, AlertCircle, Target, Zap, Brain } from 'lucide-react';
import { api } from '../lib/api';
import { formatTime } from '../lib/utils';
import { GameScore, GameDifficulty } from '../types';

interface GameState {
  numbers: number[];
  currentNumber: number;
  isPlaying: boolean;
  startTime: number | null;
  endTime: number | null;
  error: string | null;
  leaderboard: GameScore[];
  difficulty: GameDifficulty;
}

const DIFFICULTY_CONFIG = {
  easy: {
    name: '简单',
    description: '点击后数字会被标记，查找范围逐渐减少',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  medium: {
    name: '中等',
    description: '点击后数字不会标记，需要全局寻找',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  hard: {
    name: '困难',
    description: '每次点击后所有数字重新排列',
    icon: Brain,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

export default function NumberGame() {
  const [gameState, setGameState] = useState<GameState>({
    numbers: [],
    currentNumber: 1,
    isPlaying: false,
    startTime: null,
    endTime: null,
    error: null,
    leaderboard: [],
    difficulty: 'easy',
  });

  // 实时计时状态
  const [currentTime, setCurrentTime] = useState(0);

  // 生成随机数字数组
  const generateNumbers = useCallback(() => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    // Fisher-Yates 洗牌算法
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }, []);

  // 开始游戏
  const startGame = () => {
    const numbers = generateNumbers();
    setGameState(prev => ({
      ...prev,
      numbers,
      currentNumber: 1,
      isPlaying: true,
      startTime: Date.now(),
      endTime: null,
      error: null,
    }));
  };

  // 重置游戏
  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      numbers: [],
      currentNumber: 1,
      isPlaying: false,
      startTime: null,
      endTime: null,
      error: null,
    }));
  };

  // 切换难度
  const changeDifficulty = (difficulty: GameDifficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
    }));
    fetchLeaderboard(difficulty);
  };

  // 处理数字点击
  const handleNumberClick = async (clickedNumber: number) => {
    if (!gameState.isPlaying) return;

    if (clickedNumber === gameState.currentNumber) {
      // 正确点击
      let newNumbers = [...gameState.numbers];
      
      if (gameState.difficulty === 'easy') {
        // 简单模式：标记已点击的数字
        newNumbers = newNumbers.map(num => 
          num === clickedNumber ? 0 : num
        );
      } else if (gameState.difficulty === 'hard') {
        // 困难模式：重新排列所有数字
        newNumbers = generateNumbers();
      }
      // 中等模式：不做任何标记
      
      if (gameState.currentNumber === 25) {
        // 游戏完成
        const endTime = Date.now();
        const duration = endTime - gameState.startTime!; // 使用毫秒为单位
        
        try {
          // 提交成绩
          await api.post('/scores', {
            gameType: 'number-game',
            score: 25,
            time: duration,
            difficulty: gameState.difficulty,
          });
          
          // 获取最新排行榜
          const response = await api.get(`/scores/number-game?difficulty=${gameState.difficulty}`);
          setGameState(prev => ({
            ...prev,
            numbers: newNumbers,
            currentNumber: 26,
            isPlaying: false,
            endTime,
            leaderboard: response.data.data,
          }));
        } catch (error) {
          console.error('提交成绩失败:', error);
          setGameState(prev => ({
            ...prev,
            numbers: newNumbers,
            currentNumber: 26,
            isPlaying: false,
            endTime,
            error: '提交成绩失败，请重试',
          }));
        }
      } else {
        // 继续游戏
        setGameState(prev => ({
          ...prev,
          numbers: newNumbers,
          currentNumber: prev.currentNumber + 1,
        }));
      }
    } else {
      // 错误点击
      setGameState(prev => ({
        ...prev,
        error: `错误！应该点击 ${prev.currentNumber}，而不是 ${clickedNumber}`,
      }));
      
      // 3秒后清除错误
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          error: null,
        }));
      }, 3000);
    }
  };

  // 获取排行榜
  const fetchLeaderboard = async (difficulty: GameDifficulty = gameState.difficulty) => {
    try {
      const response = await api.get(`/scores/number-game?difficulty=${difficulty}`);
      setGameState(prev => ({
        ...prev,
        leaderboard: response.data.data,
      }));
    } catch (error) {
      console.error('获取排行榜失败:', error);
    }
  };

  // 实时计时器
  useEffect(() => {
    let interval: number;
    
    if (gameState.isPlaying && gameState.startTime) {
      interval = window.setInterval(() => {
        setCurrentTime(Date.now() - gameState.startTime!);
      }, 10); // 10毫秒更新一次，实现毫秒级精度
    } else {
      setCurrentTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.isPlaying, gameState.startTime]);

  // 组件挂载时获取排行榜
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const currentConfig = DIFFICULTY_CONFIG[gameState.difficulty];
  const IconComponent = currentConfig.icon;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 标题和难度选择 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">数字顺序游戏</h1>
        <p className="text-gray-600 mb-6">按顺序点击数字 1-25，测试你的注意力集中能力</p>
        
        {/* 难度选择器 */}
        <div className="flex justify-center space-x-4 mb-6">
          {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((difficulty) => {
            const config = DIFFICULTY_CONFIG[difficulty];
            const Icon = config.icon;
            const isActive = gameState.difficulty === difficulty;
            
            return (
              <button
                key={difficulty}
                onClick={() => changeDifficulty(difficulty)}
                disabled={gameState.isPlaying}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isActive 
                    ? `${config.borderColor} ${config.bgColor} ${config.color}` 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                } ${gameState.isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{config.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* 当前难度说明 */}
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${currentConfig.bgColor} ${currentConfig.borderColor} border`}>
          <IconComponent className={`h-5 w-5 ${currentConfig.color}`} />
          <span className={`text-sm font-medium ${currentConfig.color}`}>
            {currentConfig.description}
          </span>
        </div>
      </div>

      {/* 游戏状态 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-1 sm:gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-base sm:text-lg font-semibold font-mono">
              {gameState.isPlaying
                ? formatTime(currentTime)
                : gameState.endTime && gameState.startTime
                ? formatTime(gameState.endTime - gameState.startTime)
                : '00:00.00'}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            <span className="text-base sm:text-lg font-semibold">
              目标: {Math.min(gameState.currentNumber, 25)}/25
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end">
          {!gameState.isPlaying && gameState.currentNumber === 1 && (
            <button
              onClick={startGame}
              className="btn-primary inline-flex items-center text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            >
              <Play className="mr-2 h-4 w-4" />
              开始游戏
            </button>
          )}
          {gameState.isPlaying && (
            <button
              onClick={resetGame}
              className="btn-secondary inline-flex items-center text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              重置
            </button>
          )}
          {gameState.currentNumber > 25 && (
            <button
              onClick={startGame}
              className="btn-primary inline-flex items-center text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2"
            >
              <Play className="mr-2 h-4 w-4" />
              重新开始
            </button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {gameState.error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 animate-pulse">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{gameState.error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* 游戏完成提示 */}
      {gameState.currentNumber > 25 && (
        <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">恭喜完成！</h3>
            <p className="text-green-700 font-mono">
              用时: {gameState.startTime && gameState.endTime 
                ? formatTime(gameState.endTime - gameState.startTime)
                : '00:00.00'}
            </p>
          </div>
        </div>
      )}

      {/* 游戏网格 */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-5 gap-1 w-80 h-80">
          {gameState.numbers.map((number, index) => (
            <button
              key={index}
              onClick={() => handleNumberClick(number)}
              disabled={!gameState.isPlaying || number === 0}
              className={`
                w-full h-full rounded-lg text-lg font-bold transition-all
                ${number === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : gameState.isPlaying 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95' 
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {number === 0 ? '✓' : number}
            </button>
          ))}
        </div>
      </div>

      {/* 排行榜 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentConfig.name}难度排行榜
          </h2>
          <button
            onClick={() => fetchLeaderboard()}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            刷新
          </button>
        </div>
        {gameState.leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无记录</p>
        ) : (
          <div className="space-y-2">
            {gameState.leaderboard.map((score, index) => (
              <div
                key={score.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                {/* 移动端分三行，大屏原样 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-0">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium break-all text-sm sm:text-base">{score.username}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-mono mb-1 sm:mb-0">
                    {formatTime(score.time)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {new Date(score.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 