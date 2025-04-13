import * as React from "react";
import Box from "@mui/material/Box";

import UserDetails from "../UserDetails/UserDetails";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";


function Dashboard() {
  
  const [userData, setUserData] = React.useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
        console.log("Fetched user data:", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  
  

  return (
    <>
      <Navbar />
      <Box>
        <UserDetails user={userData?.data} />
      </Box>
    </>
  );
}
export default Dashboard;
