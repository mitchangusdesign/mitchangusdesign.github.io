const SUPABASE_URL = 'https://smwkypyopkqyrzqwfoyq.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtd2t5cHlvcGtxeXJ6cXdmb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDUwMDgsImV4cCI6MjA1ODE4MTAwOH0.WLto0_jltEz4jUER2nkTJvnAudfTRYlgj5InEDnP30w'; // Replace with your Supabase public anon key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password',
})

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // const { data, error } = await supabase.auth.signInWithPassword({
    //     email: email,
    //     password: password,
    // });

    if (error) {
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = 'Login successful!';
        messageDiv.style.color = 'green';
        // Redirect or perform other actions upon successful login
        console.log('User logged in:', data.user);
    }
});