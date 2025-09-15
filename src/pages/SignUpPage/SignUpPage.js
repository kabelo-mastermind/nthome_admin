import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../configs/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import axios from "axios";
import { api } from "../../api";
import { showToast } from "../../constants/ShowToast";
import "./SignUpPage.css"; // Changed CSS file name
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const signUp = async () => {
    if (!email || !password || !name || !confirmPassword) {
      showToast("error", "Incomplete form", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showToast("error", "Password mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(response.user, { displayName: name });

      const userRef = doc(db, "users", response.user.uid);
      await setDoc(userRef, {
        name,
        email,
        role: "driver",
        createdAt: new Date().toISOString(),
      });

      await axios.post(api + "register", {
        name,
        email,
        password,
        role: "driver",
        user_uid: response.user.uid,
      });

      await sendEmailVerification(response.user);

      showToast(
        "success",
        "Account created successfully",
        "Please verify your email before logging in."
      );

      await signOut(auth);

      navigate("/login", { replace: true });
    } catch (error) {
      let friendlyMessage =
        "Something went wrong while creating your account. Please try again.";

      if (error.code === "auth/weak-password") {
        friendlyMessage = "Your password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        friendlyMessage = "The email you entered is not valid. Please check and try again.";
      } else if (error.code === "auth/email-already-in-use") {
        friendlyMessage = "This email is already linked to another account.";
      }

      showToast("error", "Sign up failed", friendlyMessage);
    } finally {
      setLoading(false);
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
              <h1 className="signup-card-title">Create Account</h1>
              <p className="signup-card-subtitle">Join our driver community today</p>
            </div>
          </div>

          {/* Form */}
          <div className="signup-card-form">
            {/* Name Input */}
            <div className="signup-card-input-field">
              <label className="signup-card-input-label">Full Name</label>
              <div className="signup-card-input-container">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="signup-card-input"
                />
              </div>
            </div>

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

            {/* Password Input */}
            <div className="signup-card-input-field">
              <label className="signup-card-input-label">Password</label>
              <div className="signup-card-input-container signup-card-password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-card-input"
                />
                <button
                  type="button"
                  className="signup-card-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="signup-card-input-field">
              <label className="signup-card-input-label">Confirm Password</label>
              <div className="signup-card-input-container signup-card-password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="signup-card-input"
                />
                <button
                  type="button"
                  className="signup-card-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              className={`signup-card-button ${!isChecked ? "signup-card-button-disabled" : ""}`}
              onClick={signUp}
              disabled={!isChecked || loading}
            >
              {loading ? <div className="signup-card-loading-spinner"></div> : "Create Account"}
            </button>

            {/* Terms */}
            <div className="signup-card-checkbox-container">
              <div className="signup-card-checkbox" onClick={() => setIsChecked(!isChecked)}>
                <div className={`signup-card-checkbox-box ${isChecked ? "signup-card-checkbox-checked" : ""}`}>
                  {isChecked && <span className="signup-card-checkbox-tick">✓</span>}
                </div>
                <span className="signup-card-checkbox-label">
                  I agree to the{" "}
                  <span className="signup-card-terms-link" onClick={() => navigate("/terms")}>
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="signup-card-terms-link" onClick={() => navigate("/privacy")}>
                    Privacy Policy
                  </span>
                </span>
              </div>
            </div>

            <div className="signup-card-or-container">
              <div className="signup-card-separator"></div>
              <span className="signup-card-or-text">Or sign up with</span>
            </div>

            <div className="signup-card-social-buttons">
              <button className="signup-card-social-button" disabled>
                <img
                  src={require('../../assets/img/google.png')}
                  alt="Google"
                  className="social-icon"
                />
              </button>
              <button className="signup-card-social-button" disabled>
                <img
                  src={require('../../assets/img/facebook.png')}
                  alt="Facebook"
                  className="social-icon"
                />
              </button>
            </div>


            {/* Already Have an Account */}
            <div className="signup-card-login-container">
              <span className="signup-card-login-text">Already have an account?</span>
              <span className="signup-card-login-link" onClick={() => navigate("/login")}>
                Log in
              </span>
            </div>
          </div>
        </div>
      </div>

  );
};

export default SignUpPage;