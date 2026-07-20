import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Login() {
  const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

   const data = await response.json();

if (!response.ok) {
  setError(data.message);
  return;
}

localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

navigate("/");
  } catch (error) {
    console.error(error);
    alert("Login failed.");
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">
          Sign in to continue shopping with TerraVita.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
  <label>Password</label>

  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <span
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>

         <div className="forgot-password">
            <Link to="/forgot-password">
                Forgot Password?
            </Link>
            </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;