
import { useState, useEffect } from "react";
import DentalNavbar from "@/components/DentalNavbar";
import DentalFooter from "@/components/DentalFooter";
import AdminPanel from "@/components/AdminPanel";
import AdminLogin from "@/components/admin/AdminLogin";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const authenticated = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <div className="text-dental-blue">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16">
        <AdminPanel onLogout={handleLogout} />
      </div>
      <DentalFooter />
    </div>
  );
};

export default Admin;
