import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../contexts/redux/actions/authActions"; // your action
import { auth, db } from "../../configs/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { showToast } from "../../constants/ShowToast";
import "../SignUpPage/SignUpPage.css";
import axios from "axios";
import { api } from "../../api";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async () => {
        if (!email || !password) {
            showToast("error", "Incomplete Form", "Please fill in both email and password.");
            return;
        }

        setLoading(true);

        try {
            console.log("Attempting to sign in with email:", email, "and password length:", password.length);

            // ✅ FIX: only 3 args (auth, email, password)
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            const user = userCredential.user;

            // Ensure latest user info
            await user.reload();

            if (!user.emailVerified) {
                showToast("info", "Verify Email", "Please check your inbox before logging in.");
                return;
            }

            // 🔎 Retrieve additional user info from Firestore
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                showToast("error", "Account Incomplete", "Your account exists in Firebase but no profile data was found.");
                return;
            }

            const userData = userDoc.data();

            console.log("Fetched user data from Firestore:", userData.gender);

            // ✅ Dispatch user info to Redux
            // dispatch(setUser({
            //     id: user.uid,
            //     name: user.displayName || userData.name,
            //     email: user.email,
            //     role: userData.role,
            //     gender: userData.gender
            // }));

            // Fetch extra info from your backend
            await fetchDriverUserID(user, userData);

            showToast("success", "Login Successful", `Welcome back, ${userData.name || user.displayName}!`);
            navigate("/", { replace: true });

        } catch (error) {
            console.error(error);
            console.log("Error Code:", error.code);
            console.log("Error Message:", error.message);

            let friendlyMessage = "Something went wrong. Please try again.";
            switch (error.code) {
                case "auth/invalid-email":
                    friendlyMessage = "Invalid email address format.";
                    break;
                case "auth/user-not-found":
                    friendlyMessage = "No account found with this email. Please register.";
                    break;
                case "auth/wrong-password":
                    friendlyMessage = "Incorrect password.";
                    break;
                case "auth/user-disabled":
                    friendlyMessage = "This account has been disabled.";
                    break;
            }

            showToast("error", "Login Failed", friendlyMessage);
        } finally {
            setLoading(false);
        }
    };


    const fetchDriverUserID = async (user, userData) => {
        try {
            console.log("Fetching driver profile for email:", user.email);

            const response = await axios.post(api + 'login', {
                email: user.email,
            });

            const user_id = response.data.id;
            console.log("driver profile picture:", response.data || "N/A");

            //   setUser_Id(user_id);

            // Dispatch updated user data to Redux with user_id and userData (role)
            dispatch(setUser({
                name: user.displayName,
                email: user.email,
                id: user.uid,
                role: userData.role,
                user_id: user_id,
                profile_picture: response.data.profile_picture || "N/A",
                gender: userData.gender

            }));
        } catch (error) {
            console.error("Error fetching driver id:", error);
        }
    };

    return (
        <div className="signup-card-container">
            <div className="signup-card">
                <div className="signup-card-header">
                    <div className="signup-card-gradient">
                        <div className="signup-card-placeholder"></div>
                    </div>
                    <div className="signup-card-text-container">
                        <h1 className="signup-card-title">Welcome Back</h1>
                        <p className="signup-card-subtitle">Log in to continue</p>
                    </div>
                </div>

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

                    {/* Password Input */}
                    <div className="signup-card-input-field">
                        <label className="signup-card-input-label">Password</label>
                        <div className="signup-card-input-container signup-card-password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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

                    {/* Login Button */}
                    <button
                        className="signup-card-button"
                        onClick={login}
                        disabled={loading}
                    >
                        {loading ? <div className="signup-card-loading-spinner"></div> : "Log In"}
                    </button>

                    {/* Sign Up Link */}
                    <div className="signup-card-login-container">
                        <span className="signup-card-login-text">Don't have an account?</span>
                        <span
                            className="signup-card-login-link"
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </span>
                    </div>

                    {/* Forgot Password */}
                    <div className="signup-card-login-container">
                        <span
                            className="signup-card-login-link"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
