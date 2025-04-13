// App.js or Routes.js
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import Login from "./component/Login/Login";
import Signup from "./component/Signup/Signup";
import Dashboard from "./component/Dashboard/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import OtpRoute from "./component/ProtectedRoute/OtpRoute";
import { AuthProvider } from "./context/AuthContext";
import VerifyOTP from "./component/VerifyOTP/VerifyOtp";

import "./app.scss";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/verify-otp"
            element={
              <OtpRoute>
                <VerifyOTP />
              </OtpRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
