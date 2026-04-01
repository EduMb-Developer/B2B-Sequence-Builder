import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ybxffgbcrkkdfngyczxd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieGZmZ2JjcmtrZGZuZ3ljenhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU3NjksImV4cCI6MjA4OTU3MTc2OX0.0EekR9-83_eWMMtqlgORp3-rdpA_7VRAEjt4S2uLHcs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
