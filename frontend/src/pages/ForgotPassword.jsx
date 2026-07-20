import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later you'll call your backend API here

    setMessage("A password reset link has been sent to your email.");
    setEmail("");
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        <h1>Forgot Password?</h1>

        <p>
          Enter your email address and we'll send you a password reset link.
        </p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="forgot-btn">
            Send Reset Link
          </button>

        </form>

        <div className="back-login">
          <Link to="/login">← Back to Login</Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;