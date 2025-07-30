import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HabitFormProps {
  onHabitAdded: () => void;
}

export default function HabitForm({ onHabitAdded }: HabitFormProps) {
  const [name, setName] = useState('');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [frequency, setFrequency] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name,
        schedule_type: scheduleType,
        schedule_frequency: frequency,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating habit",
        description: error.message,
      });
    } else {
      toast({
        title: "Habit created!",
        description: `${name} has been added to your habits.`,
      });
      setName('');
      setScheduleType('daily');
      setFrequency(1);
      onHabitAdded();
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              type="text"
              placeholder="e.g., Drink water, Read, Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule-type">Schedule</Label>
            <Select value={scheduleType} onValueChange={(value: 'daily' | 'weekly') => setScheduleType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">
              Frequency ({scheduleType === 'daily' ? 'times per day' : 'times per week'})
            </Label>
            <Input
              id="frequency"
              type="number"
              min="1"
              max={scheduleType === 'daily' ? "10" : "7"}
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Habit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}