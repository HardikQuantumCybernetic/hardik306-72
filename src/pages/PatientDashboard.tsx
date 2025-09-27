import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "@/components/auth/PatientDashboard";

const PatientDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For now, allow access without authentication
    // This can be updated when proper auth is implemented
  }, [navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  // Mock user for now - this should be replaced with actual auth
  const mockUser = {
    fullName: "Demo Patient",
    firstName: "Demo",
    lastName: "Patient",
    emailAddresses: [{ emailAddress: "demo@example.com" }],
    phoneNumbers: [{ phoneNumber: "(555) 123-4567" }]
  };

  return <PatientDashboard user={mockUser} onLogout={handleLogout} />;
};

export default PatientDashboardPage;