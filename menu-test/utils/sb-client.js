import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://smwkypyopkqyrzqwfoyq.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd2t5cHlvcGtxeXJ6cXdmb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUwMDgsImV4cCI6MjA1ODE4MTAwOH0.WLto0_jltEz4jUER2nkTJvnAudfTRYlgj5InEDnP30w'; // Replace with your Supabase public anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

export { supabase };