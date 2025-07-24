// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifoefxdbxuhyxmetvgzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb2VmeGRieHVoeXhtZXR2Z3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDEwMDAsImV4cCI6MjA2ODkxNzAwMH0.HyMQVFcXeyvMlzhXVY_deLnYe0c4WL7K8hG7O3y58WI';

export const supabase = createClient(supabaseUrl, supabaseKey);
