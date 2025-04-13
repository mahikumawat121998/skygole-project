import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import { toast } from "react-toastify";

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = inputs;
    console.log("inputs", inputs);
    if (!email || !password) {
      toast.error("email and password are required.");
      return;
    }

    try {
      const loginResult = await login(inputs);
      console.log("🚀 ~ handleLogin ~ loginResult:", loginResult);
      localStorage.setItem("otp-flow", false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data || "Login failed");
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/signup">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
