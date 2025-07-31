import { useState } from 'react';
import { Plus, Minus, Trash2, Target } from 'lucide-react';
import { HabitWithCounts } from './types';

type HabitCardProps = {
  habit: HabitWithCounts;
  onMarkDone: () => void;
  onUndoLast: () => void;
  onDeleteHabit: () => void;
}

export default function HabitCard({ habit, onMarkDone, onUndoLast, onDeleteHabit }: HabitCardProps) {
  const [showAnimation, setShowAnimation] = useState(0);
  const isGoalAchieved = habit.schedule_type === 'daily' ? habit.daily_count >= habit.target_frequency : habit.weekly_count >= habit.target_frequency;

  const overAchievement = habit.schedule_type === 'daily' ? habit.daily_count - habit.target_frequency : habit.weekly_count - habit.target_frequency;
  const progressPercentage = habit.schedule_type === 'daily' ? (habit.daily_count / habit.target_frequency) * 100 : (habit.weekly_count / habit.target_frequency) * 100;
  const currentCount = habit.schedule_type === 'daily' ? habit.daily_count : habit.weekly_count;
  const targetFrequency = habit.schedule_type === 'daily' ? habit.target_frequency : habit.target_frequency * 7;

  // Wrapped handlers to trigger animations
  const handleMarkDone = () => {
    onMarkDone();
    setShowAnimation(1);
    setTimeout(() => setShowAnimation(0), 1000);
  };

  const handleUndoLast = () => {
    onUndoLast();
    setShowAnimation(-1);
    setTimeout(() => setShowAnimation(0), 1000);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Animation overlay with futuristic scale animation */}
      {showAnimation ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className={`text-5xl font-bold animate-[scale-up_0.5s_ease-out] ${showAnimation > 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-2xl`}>
            {showAnimation > 0 ? '+1' : '-1'}
          </div>
        </div>
      ) : null}

      {/* Main card container */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-lg hover:shadow-xl">

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
          onClick={onDeleteHabit}
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
                <h3 className="font-sans font-bold text-base sm:text-lg line-clamp-2 text-gray-900">{habit.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                {isGoalAchieved && overAchievement > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-1 text-xs font-bold">
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
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(to right, #3b82f6, #60a5fa)`,
                    boxShadow: `0 0 8px rgba(59, 130, 246, 0.3)`
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
                    <div className="text-xs text-emerald-600 font-medium">
                      ✨ Complete!
                    </div>
                  )}
                </div>

                {/* Clean + icon in subtle orb */}
                <div
                  className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-300 hover:scale-110 bg-blue-50 border border-blue-200"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
