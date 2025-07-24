// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvjotifptermfxaxgffn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2am90aWZwdGVybWZ4YXhnZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzk5NjIsImV4cCI6MjA2ODkxNTk2Mn0.qvzYphfjX59zMT2cghaM-Gibd_UcVn7luZFKetIMw80';

export const supabase = createClient(supabaseUrl, supabaseKey);
