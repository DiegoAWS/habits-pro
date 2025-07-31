import { useState } from 'react';
import { Plus, Minus, Trash2, Target, CheckCircle } from 'lucide-react';
import { HabitWithCounts } from './types';

type HabitCardProps = {
  habit: HabitWithCounts;
  onMarkDone: () => void;
  onUndoLast: () => void;
  onDeleteHabit: () => void;
}

export default function HabitCard({ habit, onMarkDone, onUndoLast, onDeleteHabit }: HabitCardProps) {
  const [showAnimation, setShowAnimation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showGoalAchieved, setShowGoalAchieved] = useState(false);

  const isGoalAchieved = habit.schedule_type === 'daily' ? habit.daily_count >= habit.target_frequency : habit.weekly_count >= habit.target_frequency;
  const overAchievement = habit.schedule_type === 'daily' ? habit.daily_count - habit.target_frequency : habit.weekly_count - habit.target_frequency;
  const progressPercentage = habit.schedule_type === 'daily' ? (habit.daily_count / habit.target_frequency) * 100 : (habit.weekly_count / habit.target_frequency) * 100;
  const currentCount = habit.schedule_type === 'daily' ? habit.daily_count : habit.weekly_count;

  // Wrapped handlers to trigger animations
  const handleMarkDone = () => {
    onMarkDone();
    setShowAnimation(1);

    // Check if goal was just achieved
    const wasGoalAchieved = habit.schedule_type === 'daily' ?
      (habit.daily_count + 1) >= habit.target_frequency :
      (habit.weekly_count + 1) >= habit.target_frequency;

    if (wasGoalAchieved && !isGoalAchieved) {
      setShowGoalAchieved(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setShowGoalAchieved(false), 2000);
    }

    setTimeout(() => setShowAnimation(0), 1000);
  };

  const handleUndoLast = () => {
    onUndoLast();
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteHabit();
    }, 300);
  };

  // Confetti component
  const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)]
          }}
        >
          {['✨', '🎉', '⭐', '💫', '🌟'][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`relative w-full max-w-sm mx-auto transition-all duration-300 ${isDeleting ? 'opacity-0 scale-95 -translate-y-2' : ''}`}>
      {/* Confetti overlay */}
      {showConfetti && <Confetti />}

      {/* Enhanced animation overlay with star trails */}
      {showAnimation ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          {/* Main +1/-1 text with enhanced effects */}
          <div className={`text-6xl font-black animate-bounce ${showAnimation > 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-2xl relative`}>
            {showAnimation > 0 ? '+1' : '-1'}
            {/* Glowing effect */}
            <div className={`absolute inset-0 blur-sm animate-pulse ${showAnimation > 0 ? 'text-emerald-100' : 'text-red-300'}`}>
              {showAnimation > 0 ? '+1' : '-1'}
            </div>
          </div>

        </div>
      ) : null}

      {/* Goal achieved glow effect */}
      {showGoalAchieved && (
        <div className="absolute inset-0 rounded-xl animate-pulse bg-gradient-to-r from-emerald-400/20 via-purple-400/20 to-blue-400/20 pointer-events-none z-10" />
      )}

      {/* Main card container */}
      <div className={`relative w-full h-40 rounded-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-lg hover:shadow-xl ${showGoalAchieved ? 'ring-2 ring-emerald-400/50 shadow-emerald-200' : ''}`}>

        {/* Integrated undo button - top left corner within card */}
        <button
          onClick={handleUndoLast}
          disabled={currentCount === 0}
          className="absolute top-2 left-2 z-40 w-7 h-7 bg-gray-100/80 hover:bg-gray-200/90 backdrop-blur-sm border border-gray-300/50 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400"
          title="Undo last mark"
          aria-label="Undo last mark"
        >
          <Minus className="h-3.5 w-3.5 text-gray-600" />
        </button>

        {/* Integrated delete button - top right corner within card */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 z-40 w-7 h-7 bg-red-50/80 hover:bg-red-100/90 backdrop-blur-sm border border-red-300/50 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Delete habit"
          aria-label="Delete habit"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </button>

        {/* Main clickable area */}
        <button
          onClick={handleMarkDone}
          className="relative w-full h-full p-4 text-gray-800 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Mark habit as done"
        >
          {/* Main content with clean layout */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Header with adjusted spacing for integrated buttons */}
            <div className="flex items-start justify-between pt-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="text-sm  line-clamp-2 text-gray-900">{habit.name}</div>
              </div>
              <div className="flex items-center gap-2">
                {isGoalAchieved && overAchievement > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-1 text-xs font-bold animate-pulse">
                    +{overAchievement}
                  </span>
                )}
                <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs font-medium">
                  {habit.schedule_type}
                </span>
              </div>
            </div>

            {/* Progress section */}
            <div className="space-y-3">
              {/* Progress bar with clean design */}
              <div
                className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress: ${currentCount} out of ${habit.target_frequency}`}
              >
                <div
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{
                    width: `${Math.min(progressPercentage, 100)}%`,
                    background: isGoalAchieved
                      ? 'linear-gradient(to right, #10b981, #34d399)'
                      : 'linear-gradient(to right, #3b82f6, #60a5fa)',
                    boxShadow: isGoalAchieved
                      ? '0 0 8px rgba(16, 185, 129, 0.3)'
                      : '0 0 8px rgba(59, 130, 246, 0.3)'
                  }}
                />
              </div>

              {/* Stats and action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-xl font-bold leading-none text-gray-900">
                      {currentCount}/{habit.target_frequency}
                    </div>
                    <div className="text-xs text-gray-600">
                      {habit.schedule_type === 'daily' ? 'today' : 'this week'}
                    </div>
                  </div>
                  {isGoalAchieved && (
                    <div className="text-xs text-emerald-600 font-medium animate-pulse">
                      ✨ Complete!
                    </div>
                  )}
                </div>

                {/* Enhanced checkmark button with animations */}
                <div
                  className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 hover:scale-110 ${isGoalAchieved
                    ? 'bg-emerald-100 border border-emerald-300 shadow-emerald-200'
                    : 'bg-blue-50 border border-blue-200'
                    } ${showAnimation > 0 ? 'animate-bounce' : ''}`}
                >
                  {isGoalAchieved ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  ) : (
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
