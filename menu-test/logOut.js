
async function logOut() {
const { error } = await supabase.auth.signOut()
if (error) {
    messageDiv.textContent = `Error: ${error.message}`;
    messageDiv.style.color = 'red';
  } else {
    messageDiv.textContent = 'Log Out successful! Redirecting...';
    messageDiv.style.color = 'green';
    // Redirect to a dashboard or private page after successful login
    window.location.href = '/menu-test';
  }
}