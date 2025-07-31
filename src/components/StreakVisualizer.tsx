import { FiLink, FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';
import { StreakVisualizerProps } from './types';

export default function StreakVisualizer({ streak, bestStreak }: StreakVisualizerProps) {
  const getStreakIcon = (streakCount: number) => {
    if (streakCount === 0) {
      return <FiLink className="w-5 h-5 text-gray-400" />;
    } else if (streakCount < 7) {
      return <FiTrendingUp className="w-5 h-5 text-blue-500" />;
    } else if (streakCount < 30) {
      return <FiAward className="w-5 h-5 text-green-500" />;
    } else {
      return <FiStar className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount === 0) return 'text-gray-500';
    if (streakCount < 7) return 'text-blue-600';
    if (streakCount < 30) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStreakMessage = (streakCount: number) => {
    if (streakCount === 0) return 'Start your streak!';
    if (streakCount < 7) return 'Building momentum';
    if (streakCount < 30) return 'Great consistency!';
    return 'Legendary streak!';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {getStreakIcon(streak)}
        <div className="text-center">
          <div className={`text-lg font-bold ${getStreakColor(streak)}`}>
            {streak}
          </div>
          <div className="text-xs text-gray-500">current</div>
        </div>
      </div>

      {bestStreak > 0 && (
        <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
          <FiAward className="w-4 h-4 text-orange-500" />
          <div className="text-center">
            <div className="text-sm font-semibold text-orange-600">
              {bestStreak}
            </div>
            <div className="text-xs text-gray-500">best</div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 font-medium">
        {getStreakMessage(streak)}
      </div>
    </div>
  );
}