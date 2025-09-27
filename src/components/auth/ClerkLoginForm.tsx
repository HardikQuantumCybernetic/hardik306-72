import { SignIn, SignUp, useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Calendar, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ClerkLoginForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Handle URL parameter based routing for Clerk components
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'signup') {
      setActiveTab("signup");
    } else {
      setActiveTab("login");
    }
  }, []);

  // Redirect to patient dashboard when user signs in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/patient-dashboard');
    }
  }, [isSignedIn, navigate]);

  // If user is signed in, show dashboard
  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-dental-blue-light shadow-dental-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground font-inter">
              Welcome Back!
            </CardTitle>
            <div className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4 text-dental-gray" />
              <p className="text-dental-gray">
                {user?.firstName ? `Hello, ${user.firstName}!` : user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-16 h-16",
                    userButtonPopoverCard: "bg-white border-dental-blue-light",
                    userButtonPopoverActionButton: "text-dental-gray hover:bg-dental-blue-light"
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="dental"
                size="lg"
                className="w-full font-inter flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/booking'}
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full font-inter flex items-center justify-center space-x-2 border-dental-blue-light hover:bg-dental-blue-light"
                onClick={() => window.location.href = '/patient-dashboard'}
              >
                <Settings className="w-4 h-4" />
                <span>Patient Dashboard</span>
              </Button>
            </div>
            
            <div className="text-center">
              <Link to="/" className="text-dental-blue hover:underline text-sm flex items-center justify-center space-x-1">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Website</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-dental-blue-light shadow-dental-card">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground font-inter">
            Patient Portal
          </CardTitle>
          <p className="text-dental-gray">
            Secure access to your dental records and appointments
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-dental-blue data-[state=active]:text-white"
                onClick={() => window.history.pushState({}, '', '/login?mode=signin')}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-dental-blue data-[state=active]:text-white"
                onClick={() => window.history.pushState({}, '', '/login?mode=signup')}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="flex justify-center w-full">
                <div className="w-full max-w-sm">
                  <SignIn 
                    signUpUrl="/login?mode=signup"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "border-0 shadow-none bg-transparent w-full",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-dental-blue-light hover:bg-dental-blue-light transition-colors w-full",
                        formButtonPrimary: "bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90 transition-all w-full",
                        footerActionLink: "text-dental-blue hover:text-dental-blue/80",
                        formFieldInput: "border-dental-blue-light focus:border-dental-blue transition-colors",
                        identityPreviewText: "text-dental-gray",
                        formFieldLabel: "text-dental-gray font-medium"
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="flex justify-center w-full">
                <div className="w-full max-w-sm">
                  <SignUp 
                    signInUrl="/login?mode=signin"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "border-0 shadow-none bg-transparent w-full",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "border-dental-blue-light hover:bg-dental-blue-light transition-colors w-full",
                        formButtonPrimary: "bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-blue/90 hover:to-dental-mint/90 transition-all w-full",
                        footerActionLink: "text-dental-blue hover:text-dental-blue/80",
                        formFieldInput: "border-dental-blue-light focus:border-dental-blue transition-colors",
                        identityPreviewText: "text-dental-gray",
                        formFieldLabel: "text-dental-gray font-medium"
                      }
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-xs text-dental-gray mb-3">
              Secure authentication powered by Clerk
            </p>
            <p className="text-xs text-dental-gray mb-3">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <Link to="/" className="text-dental-blue hover:underline text-sm flex items-center justify-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClerkLoginForm;