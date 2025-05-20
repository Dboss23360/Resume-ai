import React from "react";
import "./AccountSettings.css";
import { useTheme } from "../context/ThemeContext";
import Layout from "../components/Layout";

function AccountSettings() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Layout>
            <div className="settings-page">
                <h1>Account Settings</h1>

                <div className="setting-item">
                    <span>Current Theme:</span>
                    <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>
                </div>

                <div className="setting-item">
                    <span>Toggle Theme:</span>
                    <button onClick={toggleTheme}>
                        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default AccountSettings;
