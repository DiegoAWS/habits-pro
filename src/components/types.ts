export interface Habit {
    id: string;
    name: string;
    schedule_type: 'daily' | 'weekly';
    target_frequency: number;
    color_rgb: string;
    created_at: string;
}

export interface HabitWithCounts {
    id: string;
    name: string;
    schedule_type: 'daily' | 'weekly';
    target_frequency: number;
    color_rgb: string;
    created_at: string;
    user_id: string;
    daily_count: number | null;
    weekly_count: number | null;
}

export interface CreateHabitData {
    name: string;
    schedule_type: 'daily' | 'weekly';
    target_frequency: number;
    color_rgb: string;
}


// Habit marks interface
export interface HabitMark {
    id: string;
    habit_id: string;
    created_at: string;
}

// Habit creation data interface
export interface HabitCreationData {
    name: string;
    schedule_type: 'daily' | 'weekly';
    target_frequency: number;
    color_rgb: string;
}

export interface PasswordResetModalProps {
    onClose: () => void;
}

export interface StreakVisualizerProps {
    streak: number;
    bestStreak: number;
} 