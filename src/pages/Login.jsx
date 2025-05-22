import { useState } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        setLoading(true);
        setError("");

        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            if (
                err.code === "auth/invalid-credential" ||
                err.code === "auth/wrong-password" ||
                err.code === "auth/user-not-found"
            ) {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    const loginWithGoogle = async () => {
        setLoading(true);
        setError("");

        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (err) {
            if (err.code === "auth/popup-closed-by-user") {
                setError("Popup closed before completing sign in.");
            } else if (err.code === "auth/popup-blocked") {
                setError("Popup was blocked. Please allow popups and try again.");
            } else {
                setError("Google sign-in failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h1>Sign in to <span className="highlight">MyEzJobs</span></h1>
                <p className="subtext">
                    or <a href="/signup">create an account</a>
                </p>

                {error && <div className="error-msg">{error}</div>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="auth-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <a className="forgot-link" href="/forgot">Forgot password?</a>
                    </div>

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={!email || !password || loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <button className="google-btn" onClick={loginWithGoogle} disabled={loading}>
                    <img src="/google-icon.svg" alt="Google icon" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

export default Login;
