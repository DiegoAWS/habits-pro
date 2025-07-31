-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.habit_completions CASCADE;
DROP TABLE IF EXISTS public.habit_marks CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_habits_with_counts(UUID);
DROP FUNCTION IF EXISTS public.get_daily_habit_count(UUID, DATE);
DROP FUNCTION IF EXISTS public.get_weekly_habit_count(UUID, DATE);
DROP FUNCTION IF EXISTS public.check_habit_mark_rate();

-- Create habits table with final structure
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly')),
  target_frequency INTEGER NOT NULL DEFAULT 1 CHECK (target_frequency >= 1 AND target_frequency <= 100),
  color_rgb TEXT NOT NULL DEFAULT '138,43,226' CHECK (color_rgb ~ '^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create habit_marks table for individual completion tracking
CREATE TABLE public.habit_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_marks ENABLE ROW LEVEL SECURITY;


-- Create RLS policies for habits
CREATE POLICY "Users can view their own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for habit_marks
CREATE POLICY "Users can view their own marks" ON public.habit_marks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own marks" ON public.habit_marks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marks" ON public.habit_marks
  FOR DELETE USING (auth.uid() = user_id);



-- Create function for rate limiting habit marks
CREATE OR REPLACE FUNCTION public.check_habit_mark_rate()
RETURNS TRIGGER AS $$
DECLARE
  recent_marks_count INTEGER;
  max_marks_per_minute INTEGER := 10; -- Maximum 10 marks per minute per user
BEGIN
  -- Check marks created in the last minute
  SELECT COUNT(*) INTO recent_marks_count
  FROM public.habit_marks
  WHERE user_id = NEW.user_id 
    AND created_at >= now() - INTERVAL '1 minute';
  
  IF recent_marks_count >= max_marks_per_minute THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum % marks per minute', max_marks_per_minute;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rate limiting
CREATE TRIGGER enforce_habit_mark_rate
  BEFORE INSERT ON public.habit_marks
  FOR EACH ROW
  EXECUTE FUNCTION public.check_habit_mark_rate();


-- Create main function to get all habits with their daily and weekly counts
CREATE OR REPLACE FUNCTION public.get_habits_with_counts(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  schedule_type TEXT,
  target_frequency INTEGER,
  color_rgb TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  daily_count BIGINT,
  weekly_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.schedule_type,
    h.target_frequency,
    h.color_rgb,
    h.created_at,
    h.user_id,
    -- Daily count: marks for today, adjusted for timezone
    COALESCE((
      SELECT COUNT(*)
      FROM public.habit_marks hm
      WHERE hm.habit_id = h.id
        AND hm.created_at AT TIME ZONE 'UTC-3' >= CURRENT_DATE
        AND hm.created_at AT TIME ZONE 'UTC-3' < CURRENT_DATE + INTERVAL '1 day'
    ), 0) AS daily_count,
    -- Weekly count: marks for current week (Monday to Sunday)
    COALESCE((
      SELECT COUNT(*)
      FROM public.habit_marks hm
      WHERE hm.habit_id = h.id
        AND hm.created_at >= date_trunc('week', CURRENT_DATE::timestamp)
        AND hm.created_at < date_trunc('week', CURRENT_DATE::timestamp) + INTERVAL '7 days'
    ), 0) AS weekly_count
  FROM public.habits h
  WHERE (user_uuid IS NULL OR h.user_id = user_uuid)
    AND (user_uuid IS NULL OR h.user_id = auth.uid()) -- RLS: users can only see their own habits
  ORDER BY h.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_habits_with_counts(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.habits IS 'User habits with schedule and color information';
COMMENT ON TABLE public.habit_marks IS 'Individual habit completion marks with timestamp tracking';
COMMENT ON FUNCTION public.get_habits_with_counts(UUID) IS 'Get all habits with their daily and weekly completion counts';
COMMENT ON COLUMN public.habits.color_rgb IS 'RGB color values as comma-separated string (e.g., "255,128,64") for the habit card appearance'; 
