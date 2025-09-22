import { supabase } from './utils/sb-client.js';

async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      // Handle the error (e.g., display an error message to the user)
    } else {
      console.log('User signed out successfully.');
      // Perform actions after successful sign-out (e.g., redirect to login page)
      window.location.href = '/menu-test';
    }
  } catch (err) {
    console.error('An unexpected error occurred during sign-out:', err);
  }
}

// Call the function to sign out the user
document.getElementById("logout").addEventListener("click", function (){
    signOutUser();
});

