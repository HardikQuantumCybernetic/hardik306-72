import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "@/components/auth/PatientDashboard";

const PatientDashboardPage = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
    }
  }, [isSignedIn, navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <div className="text-dental-blue">Loading...</div>
      </div>
    );
  }

  return <PatientDashboard user={user} onLogout={handleLogout} />;
};

export default PatientDashboardPage;