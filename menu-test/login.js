import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://smwkypyopkqyrzqwfoyq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd2t5cHlvcGtxeXJ6cXdmb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUwMDgsImV4cCI6MjA1ODE4MTAwOH0.WLto0_jltEz4jUER2nkTJvnAudfTRYlgj5InEDnP30w')

console.log('Supabase Instance: ', supabase)

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    messageDiv.textContent = `Error: ${error.message}`;
    messageDiv.style.color = 'red';
  } else {
    messageDiv.textContent = 'Login successful! Redirecting...';
    messageDiv.style.color = 'green';
    // Redirect to a dashboard or private page after successful login
    window.location.href = '/menu-test/add-menu-item.html';
  }
});