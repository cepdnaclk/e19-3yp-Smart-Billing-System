import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const navigate = useNavigate();

    const redirectToRoot = () => {
        navigate("/");
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);

        if (!isValidEmail) {
            setIsEmailValid(false);
            return;
        }

        if (password !== confirmPassword) {
            setIsPasswordMatch(false);
            return;
        }

        console.log("Sign-up submitted:", {
            fullName,
            email,
            username,
            password,
        });

        setFullName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsEmailValid(true);
        setIsPasswordMatch(true);
    };

    return (
        <div className="signin-container">
            <div className="header-bar ">
                <h2 style={{ color: "white", textAlign: "left" }}>
                    <b>SMART</b>{" "}
                    <span className="thin-text">BILLING SYSTEM</span>
                </h2>
            </div>
            <div className="form-container">
                <div className="image-container"></div>
                <div className="formsignin">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <div>
                            <label htmlFor="fullName">Full Name:</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIsEmailValid(true);
                                }}
                                required
                            />
                            {!isEmailValid && (
                                <p className="error-text">
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setIsPasswordMatch(true);
                                }}
                                required
                            />
                            {!isPasswordMatch && (
                                <p className="error-text">
                                    Passwords do not match
                                </p>
                            )}
                        </div>
                        <div>
                            <button
                                className="login_button"
                                type="submit"
                                onClick={redirectToRoot}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="footer-bar ">
                <h6 style={{ color: "white", textAlign: "center" }}>
                    <span className="thin-text">
                        @2023 Smart Billing System. All right reserved.
                    </span>
                </h6>
            </div>
        </div>
    );
};

export default Signup;
