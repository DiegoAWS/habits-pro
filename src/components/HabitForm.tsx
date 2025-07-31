import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, Target, Calendar, Zap, Sparkles, Edit3, X } from 'lucide-react';
import { createHabit } from '@/services/habitsService';

const frequencyOptions = [
  { value: 1, label: 'Once', description: 'Once per day' },
  { value: 2, label: 'Twice', description: 'Twice per day' },
  { value: 3, label: '3 times', description: 'Three times per day' },
  { value: 4, label: '4 times', description: 'Four times per day' },
  { value: 5, label: '5 times', description: 'Five times per day' },
];

const weeklyFrequencyOptions = [
  { value: 1, label: 'Once', description: 'Once per week' },
  { value: 2, label: 'Twice', description: 'Twice per week' },
  { value: 3, label: '3 times', description: 'Three times per week' },
  { value: 4, label: '4 times', description: 'Four times per week' },
  { value: 5, label: '5 times', description: 'Five times per week' },
  { value: 6, label: '6 times', description: 'Six times per week' },
  { value: 7, label: 'Daily', description: 'Every day of the week' },
];

export default function HabitForm({
  onHabitAdded
}) {
  const [name, setName] = useState('');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [frequency, setFrequency] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFrequency, setCustomFrequency] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const finalFrequency = showCustomInput ? parseInt(customFrequency) : frequency;

    if (showCustomInput && (!customFrequency || finalFrequency < 1 || finalFrequency > 100)) {
      toast({
        variant: "destructive",
        title: "Invalid frequency",
        description: "Please enter a number between 1 and 100.",
      });
      return;
    }

    // Additional frontend validation
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid habit name",
        description: "Please enter a habit name.",
      });
      return;
    }

    if (trimmedName.length > 100) {
      toast({
        variant: "destructive",
        title: "Habit name too long",
        description: "Habit name must be 100 characters or less.",
      });
      return;
    }

    // Check for invalid characters
    const validNameRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
    if (!validNameRegex.test(trimmedName)) {
      toast({
        variant: "destructive",
        title: "Invalid characters",
        description: "Habit name contains invalid characters. Use only letters, numbers, spaces, and basic punctuation.",
      });
      return;
    }

    setLoading(true);

    // Generate better random RGB color (25-255 range to avoid very dark colors)
    const randomR = Math.floor(Math.random() * 230) + 25; // 25-255
    const randomG = Math.floor(Math.random() * 230) + 25; // 25-255
    const randomB = Math.floor(Math.random() * 230) + 25; // 25-255
    const randomColorRgb = `${randomR},${randomG},${randomB}`;

    const habitData = {
      name: trimmedName,
      schedule_type: scheduleType,
      target_frequency: finalFrequency,
      color_rgb: randomColorRgb,
    };

    try {


      toast({
        title: "Habit created! 🎉",
        description: `${trimmedName} has been added to your habits.`,
      });

      // Reset form
      setName('');
      setScheduleType('daily');
      setFrequency(1);
      setShowCustomInput(false);
      setCustomFrequency('');

      // Call callback if provided

      onHabitAdded(habitData);

    } catch (error) {
      // Handle specific database errors
      let errorMessage = "An unexpected error occurred.";

      if (error.message) {
        if (error.message.includes('Maximum number of habits')) {
          errorMessage = "You've reached the maximum number of habits (50). Please delete some habits before creating new ones.";
        } else if (error.message.includes('Rate limit exceeded')) {
          errorMessage = "You're creating habits too quickly. Please wait a moment before creating another habit.";
        } else if (error.message.includes('already exists')) {
          errorMessage = "A habit with this name already exists. Please choose a different name.";
        } else if (error.message.includes('habits_name_length')) {
          errorMessage = "Habit name must be between 1 and 100 characters.";
        } else if (error.message.includes('habits_name_format')) {
          errorMessage = "Habit name contains invalid characters. Use only letters, numbers, spaces, and basic punctuation.";
        } else if (error.message.includes('habits_frequency_range')) {
          errorMessage = "Frequency must be between 1 and 100.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Error creating habit",
        description: errorMessage,
      });
    }

    setLoading(false);
  };

  const handleFrequencySelect = (value: number) => {
    if (value === -1) {
      // Custom option selected
      setShowCustomInput(true);
      setFrequency(-1);
    } else {
      setShowCustomInput(false);
      setFrequency(value);
      setCustomFrequency('');
    }
  };

  const currentOptions = scheduleType === 'daily' ? frequencyOptions : weeklyFrequencyOptions;
  const displayFrequency = showCustomInput ? parseInt(customFrequency) || 0 : frequency;

  // Validation for custom frequency
  const customFrequencyNum = parseInt(customFrequency) || 0;
  const isCustomFrequencyValid = customFrequencyNum >= 1 && customFrequencyNum <= 100;
  const showCustomError = showCustomInput && customFrequency && !isCustomFrequencyValid;

  return (
    <Card className="w-full bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">Create New Habit</CardTitle>
        <p className="text-sm text-gray-600">Build a habit that sticks with you</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name Input */}
          <div className="space-y-3">
            <Label htmlFor="habit-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              What habit do you want to build?
            </Label>
            <Input
              id="habit-name"
              type="text"
              placeholder="e.g., Drink 8 glasses of water, Read 30 minutes, Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          {/* Schedule Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              How often do you want to do this?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScheduleType('daily')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${scheduleType === 'daily'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
              >
                <div className="text-center">
                  <div className="font-medium">Daily</div>
                  <div className="text-xs opacity-75">Every day</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('weekly')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${scheduleType === 'weekly'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
              >
                <div className="text-center">
                  <div className="font-medium">Weekly</div>
                  <div className="text-xs opacity-75">Per week</div>
                </div>
              </button>
            </div>
          </div>

          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              How many times {scheduleType === 'daily' ? 'per day' : 'per week'}?
            </Label>

            <div className="grid grid-cols-3 gap-2">
              {currentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFrequencySelect(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${frequency === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                    }`}
                >
                  <div className="text-center">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs opacity-75">{option.description}</div>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleFrequencySelect(-1)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${frequency === -1
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
              >
                <div className="text-center">
                  {showCustomInput ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="1-100"
                          value={customFrequency}
                          onChange={(e) => setCustomFrequency(e.target.value)}
                          className={`h-8 text-center text-sm border-purple-300 focus:border-purple-500 focus:ring-purple-500 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${showCustomError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                            }`}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCustomInput(false);
                            setFrequency(1);
                            setCustomFrequency('');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </div>
                      <div className="text-xs opacity-75">times {scheduleType === 'daily' ? 'per day' : 'per week'}</div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-sm flex items-center justify-center gap-1">
                        <Edit3 className="h-3 w-3" />
                        Custom
                      </div>
                      <div className="text-xs opacity-75">Your own number</div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Summary */}
          {name && displayFrequency > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-gray-800">Your Habit Summary</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{name}</span> - {displayFrequency} time{displayFrequency > 1 ? 's' : ''} {scheduleType === 'daily' ? 'per day' : 'per week'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3"
            disabled={loading || !name || (showCustomInput && (!customFrequency || parseInt(customFrequency) < 1 || parseInt(customFrequency) > 100))}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Habit...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Habit
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}