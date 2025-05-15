import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const signup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Create a MyEzJobs Account</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signup}>Sign Up</button>
        </div>
    );
}

export default Signup;