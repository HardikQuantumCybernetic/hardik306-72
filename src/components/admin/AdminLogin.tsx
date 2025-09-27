import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === "hard30hardik") {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
      onLogin(true);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
      onLogin(false);
    }
    
    setIsLoading(false);
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-dental-blue-light shadow-dental-card">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground font-inter">
            Admin Login
          </CardTitle>
          <p className="text-dental-gray">
            Please enter your password to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-dental-gray font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10 border-dental-blue-light focus:border-dental-blue"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-dental-gray" />
                  ) : (
                    <Eye className="h-4 w-4 text-dental-gray" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="dental"
              size="lg"
              className="w-full font-inter"
              disabled={isLoading || !password}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-dental-gray">
              Hardik Dental Practice Management System
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;