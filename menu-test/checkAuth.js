import { supabase } from './utils/sb-client.js';

const { data, error } = await supabase.auth.getSession();
const { session } = data; // Destructure session from data

if (error || !session) {
  // Redirect to login if no session or an error occurred
  window.location.href = '/login';
} else {
  console.log('User is authenticated:', session.user);
}