import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgifxyzpsdhsdmbnkztj.supabase.co';
// The anon key is safe to be exposed in a client-side app.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnaWZ4eXpwc2Roc2RtYm5renRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTAxMDAsImV4cCI6MjA3ODA2NjEwMH0.LswQSru5qSawR3c-VVr9YCaxLjrUhm87jMh6gDG4m8Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
