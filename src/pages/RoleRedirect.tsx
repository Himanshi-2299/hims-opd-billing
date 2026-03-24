import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

export function RoleRedirect() {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  useEffect(() => {
    // Redirect based on role
    if (currentRole === "superadmin") {
      navigate("/masters", { replace: true });
    } else if (currentRole === "admin") {
      navigate("/billing-history", { replace: true });
    } else if (currentRole === "frontdesk") {
      navigate("/dashboard", { replace: true });
    }
  }, [currentRole, navigate]);

  // Return null or a loading indicator while redirecting
  return null;
}

export default RoleRedirect;
