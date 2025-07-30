import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StreakVisualizer from './StreakVisualizer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

interface Habit {
  id: string;
  name: string;
  schedule_type: string;
  schedule_frequency: number;
  current_streak: number;
  best_streak: number;
  last_completed_date: string | null;
}

interface HabitCardProps {
  habit: Habit;
  completedToday: boolean;
  onUpdate: () => void;
}

export default function HabitCard({ habit, completedToday, onUpdate }: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!user || completedToday) return;

    setLoading(true);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Add completion record
    const { error: completionError } = await supabase
      .from('habit_completions')
      .insert({
        user_id: user.id,
        habit_id: habit.id,
        completed_date: today,
      });

    if (completionError) {
      toast({
        variant: "destructive",
        title: "Error marking habit complete",
        description: completionError.message,
      });
      setLoading(false);
      return;
    }

    // Calculate new streak
    const newStreak = calculateNewStreak(habit, today);
    const newBestStreak = Math.max(habit.best_streak, newStreak);

    // Update habit with new streak
    const { error: updateError } = await supabase
      .from('habits')
      .update({
        current_streak: newStreak,
        best_streak: newBestStreak,
        last_completed_date: today,
      })
      .eq('id', habit.id);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Error updating streak",
        description: updateError.message,
      });
    } else {
      toast({
        title: "Habit completed!",
        description: `Great job! Your streak is now ${newStreak} days.`,
      });
      onUpdate();
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habit.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting habit",
        description: error.message,
      });
    } else {
      toast({
        title: "Habit deleted",
        description: `${habit.name} has been removed.`,
      });
      onUpdate();
    }
    
    setLoading(false);
  };

  const calculateNewStreak = (habit: Habit, today: string): number => {
    const todayDate = new Date(today);
    const lastCompletedDate = habit.last_completed_date ? new Date(habit.last_completed_date) : null;
    
    if (!lastCompletedDate) {
      return 1; // First completion
    }
    
    const diffTime = todayDate.getTime() - lastCompletedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return habit.current_streak + 1; // Consecutive day
    } else {
      return 1; // Reset streak
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{habit.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {habit.schedule_frequency}x {habit.schedule_type}
          </Badge>
          {completedToday && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              ✓ Completed today
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <StreakVisualizer 
          streak={habit.current_streak} 
          bestStreak={habit.best_streak}
        />
        
        <Button
          onClick={handleComplete}
          disabled={loading || completedToday}
          className={`w-full ${
            completedToday 
              ? 'bg-green-100 text-green-800 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          variant={completedToday ? "secondary" : "default"}
        >
          {loading ? (
            'Updating...'
          ) : completedToday ? (
            <>
              <FiCheck className="w-4 h-4 mr-2" />
              Completed Today
            </>
          ) : (
            'Mark Complete'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}