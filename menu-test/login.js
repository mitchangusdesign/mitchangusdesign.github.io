import { supabase } from './utils/sb-client.js';

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

export { supabase };