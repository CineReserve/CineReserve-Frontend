import { useEffect } from "react";
import { useNavigate } from "react-router";

type Props = {
  token: string | null;
  role: string | null;
  allowedRoles?: string[]; // e.g., ["Owner"] or ["Staff"]
  setToken: (token: string | null) => void; // from given example
  children: React.ReactNode;
};

export default function ProtectedRoute({
  token,
  role,
  allowedRoles,
  setToken,
  children,
}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    //-----API CALL TO GET ROLE FROM BACKEND CAN BE IMPLEMENTED HERE IF NEEDED-----
    
    //console.log("User role:", role + ", Token:", token);
    //console.log("Allowed roles:", allowedRoles);
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (allowedRoles && role) {
      const isRoleAllowed = allowedRoles.includes(role);
      if (!isRoleAllowed) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [token, role, allowedRoles, navigate, setToken]);

  if (!token) return null; // Prevent rendering while redirecting
  if (allowedRoles && role) {
    const hasPermission = allowedRoles.includes(role);
    if (!hasPermission) return null;
  }

  return <>{children}</>;
}
