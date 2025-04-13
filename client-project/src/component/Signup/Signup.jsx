import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.scss";
import { toast } from 'react-toastify';


const Signup = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const username = String(`${Math.floor(Math.random() * 10000)}`);
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/registration`,
        { ...inputs, username }
      );
      //  const data = await response.json();
      //  console.log("🚀 ~ handleClick ~ data:", data)
      console.log("🚀 ~ handleClick ~ response:", response);

      if (response.status == 201) {
        // ✅ OTP sent — redirect to OTP verification page
        localStorage.setItem("otp-flow", "true");
        localStorage.setItem("userEmail", response.data.data.email); // or phone
        toast.success("Signup successful!");
        navigate("/verify-otp");
      } else {
        alert("Hello");
      }
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
      setErr(err?.response?.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>SkyGole A Tech Gaint.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="mobile"
              name="mobile"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />

            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
