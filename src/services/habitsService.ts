import { supabase } from '@/integrations/supabase/client';
import { CreateHabitData, HabitWithCounts } from '@/components/types';


export async function getHabitsWithCounts(): Promise<HabitWithCounts[]> {
    // Call the PostgreSQL function using RPC
    const { data, error } = await supabase
        .rpc('get_habits_with_counts');

    if (error) {
        console.error('Error fetching habits with counts:', error);
        return [];
    }

    if (!data) return [];

    // Transform the data to match our TypeScript interface
    return data.map(habit => ({
        id: habit.id,
        name: habit.name,
        schedule_type: habit.schedule_type as 'daily' | 'weekly',
        target_frequency: habit.target_frequency,
        color_rgb: habit.color_rgb,
        created_at: habit.created_at,
        user_id: habit.user_id,
        daily_count: Number(habit.daily_count),
        weekly_count: Number(habit.weekly_count)
    }));
}

/**
 * Create a new habit
 */
export async function createHabit(habitData: CreateHabitData): Promise<HabitWithCounts> {
    const { data, error } = await supabase
        .from('habits')
        .insert({
            ...habitData,
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        name: data.name,
        schedule_type: data.schedule_type as 'daily' | 'weekly',
        target_frequency: data.target_frequency,
        color_rgb: data.color_rgb,
        created_at: data.created_at || '',
        user_id: data.user_id,
        daily_count: 0,
        weekly_count: 0
    };
}

/**
 * Delete a habit
 */
export async function deleteHabit(habitId: string): Promise<void> {
    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

    if (error) throw error;
}

/**
 * Add a habit mark (completion)
 */
export async function addHabitMark(habitId: string): Promise<void> {
    const { error } = await supabase
        .from('habit_marks')
        .insert({
            habit_id: habitId
        });

    if (error) throw error;
}

/**
 * Remove a habit mark (undo completion)
 */
export async function removeHabitMark(habitId: string): Promise<void> {
    // Get the most recent mark for this habit today
    const today = new Date().toISOString().split('T')[0];

    const { data: marks, error: fetchError } = await supabase
        .from('habit_marks')
        .select('id')
        .eq('habit_id', habitId)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })
        .limit(1);

    if (fetchError) throw fetchError;

    if (marks && marks.length > 0) {
        const { error: deleteError } = await supabase
            .from('habit_marks')
            .delete()
            .eq('id', marks[0].id);

        if (deleteError) throw deleteError;
    }
} 