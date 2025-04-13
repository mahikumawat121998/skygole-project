// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
         const decoded = jwtDecode(token);
    if (!decoded.username) {
      return <Navigate to="/login" replace />;
    }
  }, []);
  return children;
};

export default ProtectedRoute;
