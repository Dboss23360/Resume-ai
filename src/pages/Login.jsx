import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/"); // redirect to homepage after login
        } catch (err) {
            alert(err.message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to MyEzJobs</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
            <button onClick={loginWithGoogle}>Login with Google</button>
        </div>
    );
}

export default Login;