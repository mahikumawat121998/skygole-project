import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.scss";
import { toast } from "react-toastify";
import { validateInputs } from "../../utils/validation";

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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const username = String(`${Math.floor(Math.random() * 10000)}`);
  const handleClick = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // If errors exist, stop the form submission
    }

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
          <h2>SkyGoal A Tech Gaint.</h2>
          <p>
            SkyGoal Technologies is a next-generation IT solutions provider,
            dedicated to empowering businesses with cutting-edge digital
            transformation strategies. From innovative web and mobile
            applications to cloud-based enterprise systems and advanced
            cybersecurity solutions, we blend creativity, technology, and
            business intelligence to deliver excellence.
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
            {errors.firstName && <p className="error">{errors.firstName}</p>}

            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              type="text"
              placeholder="Mobile"
              name="mobile"
              onChange={handleChange}
            />
            {errors.mobile && <p className="error">{errors.mobile}</p>}

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
