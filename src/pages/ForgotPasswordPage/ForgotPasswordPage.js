import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../configs/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { showToast } from "../../constants/ShowToast";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../SignUpPage/SignUpPage.css"; // reuse signup styles

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!email) {
      showToast("error", "Error", "Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showToast(
        "success",
        "Password Reset Sent",
        "Check your email (including spam) for the reset link.",
        { duration: 5000 } // duration in milliseconds (3 seconds)
      );

      navigate("/login");
    } catch (error) {
      showToast("error", "Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-card-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-card-header">
          <div className="signup-card-gradient">
            <div className="signup-card-placeholder"></div>
          </div>
          <div className="signup-card-text-container">
            <h1 className="signup-card-title">Forgot Password</h1>
            <p className="signup-card-subtitle">
              Enter your email to reset your password
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="signup-card-form">
          {/* Email Input */}
          <div className="signup-card-input-field">
            <label className="signup-card-input-label">Email Address</label>
            <div className="signup-card-input-container">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-card-input"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="signup-card-button"
            onClick={handlePasswordReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="signup-card-loading-spinner"></div>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {/* Back to Login */}
          <div className="signup-card-login-container">
            <span className="signup-card-login-text">Remembered your password?</span>
            <span
              className="signup-card-login-link"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
