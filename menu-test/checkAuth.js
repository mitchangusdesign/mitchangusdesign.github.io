import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://smwkypyopkqyrzqwfoyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd2t5cHlvcGtxeXJ6cXdmb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUwMDgsImV4cCI6MjA1ODE4MTAwOH0.WLto0_jltEz4jUER2nkTJvnAudfTRYlgj5InEDnP30w')

console.log('Supabase Instance: ', supabase)

const { data, error } = await supabase.auth.getSession()

if (error || !session) {
        // Redirect to login if no session or an error occurred
        navigate('menu-test/login.html'); 
      } else {
        setLoading(false); // Allow access if authenticated
      }