import { Navigate } from "react-router-dom";

const OtpRoute = ({ children }) => {
  const isAllowed = localStorage.getItem("otp-flow") === "true";

  if (!isAllowed) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default OtpRoute;
