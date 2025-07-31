import { useCallback, useEffect, useState } from "react";
import { HabitWithCounts } from "./types";
import { addHabitMark, createHabit, deleteHabit, getHabitsWithCounts, removeHabitMark } from "@/services/habitsService";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";

const Habits = () => {
    const [habits, setHabits] = useState<HabitWithCounts[]>([]);

    const fetchHabits = useCallback(async () => {
        const habits = await getHabitsWithCounts();
        setHabits(habits);
    }, []);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);


    const handleMarkDone = async (habitId: string) => {
        setHabits(prevHabits => prevHabits
            .map(habit => habit.id === habitId ?
                habit.schedule_type === 'daily' ?
                    { ...habit, daily_count: habit.daily_count + 1 }
                    : { ...habit, weekly_count: habit.weekly_count + 1 }
                : habit));

        await addHabitMark(habitId);
        await fetchHabits();
    }

    const handleUndoLast = async (habitId: string) => {
        setHabits(prevHabits => prevHabits
            .map(habit => habit.id === habitId ?
                habit.schedule_type === 'daily' ?
                    { ...habit, daily_count: habit.daily_count - 1 }
                    : { ...habit, weekly_count: habit.weekly_count - 1 }
                : habit));

        await removeHabitMark(habitId);
        await fetchHabits();
    }

    const handleDeleteHabit = async (habitId: string) => {
        setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
        await deleteHabit(habitId);
        await fetchHabits();
    }

    const onHabitAdded = async (habit) => {
        setHabits(prevHabits => [{ id: "optimistic" + Date.now(), ...habit, daily_count: 0, weekly_count: 0 }, ...prevHabits]);
        await createHabit(habit);
        await fetchHabits();
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <HabitForm onHabitAdded={onHabitAdded} />
            </div>

            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Habits</h2>
                    <p className="text-gray-600">Track your progress and build consistent habits</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onMarkDone={() => handleMarkDone(habit.id)}
                            onUndoLast={() => handleUndoLast(habit.id)}
                            onDeleteHabit={() => handleDeleteHabit(habit.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Habits;