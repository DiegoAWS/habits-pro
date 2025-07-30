import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import HabitCard from './HabitCard';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  name: string;
  schedule_type: string;
  schedule_frequency: number;
  current_streak: number;
  best_streak: number;
  last_completed_date: string | null;
}

interface HabitListProps {
  refreshTrigger: number;
}

export default function HabitList({ refreshTrigger }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch today's completions
      const today = new Date().toISOString().split('T')[0];
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      if (completionsError) throw completionsError;

      setHabits(habitsData || []);
      setCompletions(new Set(completionsData?.map(c => c.habit_id) || []));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading habits",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No habits yet</h3>
        <p className="text-gray-500">Add your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completedToday={completions.has(habit.id)}
          onUpdate={fetchHabits}
        />
      ))}
    </div>
  );
}