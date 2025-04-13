import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.username) {
          setUser({ username: decoded.username });
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  const login = async (inputs) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/login`,
        inputs
      );
      if (response.data.status === 201) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        setUser({ username: response.data.data.username });
        toast.success("Login successful!");
        return response.data;
      }
      if (response.data.status === 401) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (err) {
      console.log("🚀 ~ login ~ err:", err)
      
      toast.error(err?.response?.data?.message || "Login failed");
      throw err; // 🔴 VERY IMPORTANT: rethrow the error
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
