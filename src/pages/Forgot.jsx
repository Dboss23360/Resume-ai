import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../pages/Login.css";
import { Link } from "react-router-dom";

function Forgot() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setSubmitted(true);
        } catch (error) {
            console.error("Reset error:", error);
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h1>Reset your password</h1>
                <p className="subtext">Enter your email to receive a reset link.</p>

                {submitted ? (
                    <div className="subtext">
                        ✅ A reset link has been sent.<br />
                        Check your inbox (and spam folder).
                        <br /><br />
                        <Link to="/login" className="back-link">Back to login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="primary-btn" type="submit" disabled={!email}>
                            Send reset link
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Forgot;
