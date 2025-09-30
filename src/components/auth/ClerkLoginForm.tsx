import { SignIn } from "@clerk/clerk-react";

const ClerkLoginForm = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
      <SignIn 
        routing="path" 
        path="/login"
        signUpUrl="/signup"
        afterSignInUrl="/patient-dashboard"
      />
    </div>
  );
};

export default ClerkLoginForm;
