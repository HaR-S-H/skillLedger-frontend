// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
