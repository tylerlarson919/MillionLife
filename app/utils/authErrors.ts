export const getAuthErrorMessage = (error: any) => {
  const errorCode = error.code || "";

  switch (errorCode) {
    // From sign-in
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    
    // Google Sign-In specific
    case "auth/operation-not-allowed":
      return "Sign-in with Google is not enabled. Please contact support.";
    case "auth/popup-blocked-by-browser":
      return "Popup blocked by browser. Please allow popups for this site.";
    case "auth/popup-closed-by-user":
      return "The login popup was closed before completing. Please try again.";

    // From sign-up
    case "auth/email-already-in-use":
      return "This email is already in use by another account.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";

    default:
      return "An unexpected error occurred. Please try again.";
  }
}; 