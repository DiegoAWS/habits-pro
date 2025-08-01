// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwpoeqeydffxqaytslcq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cG9lcWV5ZGZmeHFheXRzbGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTM0NDAsImV4cCI6MjA2OTQ4OTQ0MH0.78zeTz_0iD2pImZdQZdECuufvfOY4-yZotkntoi6YsY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});