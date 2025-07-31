import { useState } from 'react';
import { Plus, Minus, Trash2, Target } from 'lucide-react';
import { HabitWithCounts } from './types';
import { createColorVariations } from '@/lib/utils';


type HabitCardProps = {
  habit: HabitWithCounts;
  onMarkDone: () => void;
  onUndoLast: () => void;
  onDeleteHabit: () => void;
}
export default function HabitCard({ habit, onMarkDone, onUndoLast, onDeleteHabit }: HabitCardProps) {
  const colors = createColorVariations(habit.color_rgb);
  const [showAnimation, setShowAnimation] = useState(0);
  const isGoalAchieved = habit.schedule_type === 'daily' ? habit.daily_count >= habit.target_frequency : habit.weekly_count >= habit.target_frequency;

  const overAchievement = habit.schedule_type === 'daily' ? habit.daily_count - habit.target_frequency : habit.weekly_count - habit.target_frequency;
  const progressPercentage = habit.schedule_type === 'daily' ? (habit.daily_count / habit.target_frequency) * 100 : (habit.weekly_count / habit.target_frequency) * 100;
  const currentCount = habit.schedule_type === 'daily' ? habit.daily_count : habit.weekly_count;

  return (
    <div className="relative w-full">

      {/* Animation overlay */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className={`text-6xl font-bold animate-bounce ${showAnimation > 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
            {showAnimation > 0 ? '+1' : '-1'}
          </div>
        </div>
      )}

      {/* Undo button - top left corner */}
      <button
        onClick={onUndoLast}
        disabled={currentCount === 0}
        className="absolute -top-2 -left-2 z-40 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
        title="Undo last mark"
      >
        <Minus className="h-3 w-3 text-gray-700" style={{ filter: 'drop-shadow(0 0.5px 1px rgba(255,255,255,0.8))' }} />
      </button>

      {/* Delete button - top right corner */}
      <button
        onClick={onDeleteHabit}
        className="absolute -top-2 -right-2 z-40 w-8 h-8 bg-red-50 hover:bg-red-100 backdrop-blur-sm border border-red-200 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
        title="Delete habit"
      >
        <Trash2 className="h-3 w-3 text-red-600" style={{ filter: 'drop-shadow(0 0.5px 1px rgba(255,255,255,0.8))' }} />
      </button>

      {/* Main Mark Done Button */}
      <button
        onClick={onMarkDone}
        className="relative w-full h-32 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] border border-white/20 backdrop-blur-sm"
        style={{
          background: isGoalAchieved
            ? `linear-gradient(135deg, rgb(${colors.achieved}), rgb(${colors.lighter}), rgb(255, 215, 0))`
            : `linear-gradient(135deg, rgb(${colors.base}), rgb(${colors.lighter}), rgb(${colors.darker}))`,
          boxShadow: `0 25px 50px -12px rgba(${colors.base}, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)`
        }}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${15 + i * 10}%`,
                top: `${20 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
          {/* Header with habit name and badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-white/90 drop-shadow-lg" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)', filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.8))' }} />
              <h3 className="font-bold text-lg truncate max-w-32 drop-shadow-lg" style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
              }}>{habit.name}</h3>
            </div>

            <div className="flex items-center gap-2">
              {isGoalAchieved && overAchievement > 0 && (
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                  <span className="text-xs font-bold text-yellow-200 drop-shadow-lg" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                    WebkitTextStroke: '0.3px rgba(0,0,0,0.4)'
                  }}>+{overAchievement}</span>
                </div>
              )}
              <span className="bg-white/20 rounded-full px-2 py-1 text-xs font-medium drop-shadow-lg" style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                WebkitTextStroke: '0.3px rgba(0,0,0,0.2)'
              }}>
                {habit.schedule_type}
              </span>
            </div>
          </div>

          {/* Progress section */}
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full transition-all duration-700 ease-out bg-gradient-to-r from-white/80 to-white"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Stats and action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="text-2xl font-bold leading-none drop-shadow-lg" style={{
                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.4)'
                  }}>
                    {currentCount}/{habit.target_frequency}
                  </div>
                  <div className="text-xs text-white/80 drop-shadow-lg" style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    WebkitTextStroke: '0.2px rgba(0,0,0,0.3)'
                  }}>
                    {habit.schedule_type === 'daily' ? 'today' : 'this week'}
                  </div>
                </div>
                {isGoalAchieved && (
                  <div className="text-right">
                    <div className="text-xs text-yellow-200 font-medium drop-shadow-lg" style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                      WebkitTextStroke: '0.3px rgba(0,0,0,0.3)'
                    }}>
                      ✨ Complete!
                    </div>
                  </div>
                )}
              </div>

              {/* Mark Done icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
                <Plus className="h-6 w-6 text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3)) drop-shadow(0 0 1px rgba(0,0,0,0.8))' }} />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}