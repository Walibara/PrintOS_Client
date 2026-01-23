import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import trustme from "../../Assets/trust-me-bro.jpeg";
import "./AmplifyHome.css";

function AmplifyHome() {
  const [message, setMessage] = useState("Loading...");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let baseUrl = import.meta.env.VITE_API_URL;

    if (!baseUrl) {
      if (window.location.hostname.includes("amplifyapp.com")) {
        baseUrl = "https://dkdavnbhgrmho.cloudfront.net";
      } else {
        baseUrl = "http://localhost:8080";
      }
    }

    baseUrl = baseUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/hello`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Failed to connect to backend"));
  }, []);

  return (
    <div className="home-container">
      <div className="home-card">

        <img src={trustme} className="home-meme-top" />

        <h1 className="home-title">
          Welcome To HP PrintOS Orchestration Application
        </h1>

        <p className="home-sub">
          Hello User, select any action below of your choosing.
        </p>

        <div className="system-banner">
          <div>
            <strong>System Status: All Services Online</strong>
            <p className="system-sub">
              All backend services are connected and running normally.
            </p>
            <p className="api-status">
              Backend says: {message}
            </p>
          </div>
        </div>

        <div className="home-grid">

          <Link to="/dashboard" className="home-grid-item">
            <div className="grid-text">
              <h3>Dashboard</h3>
              <p>Overview of job activity</p>
            </div>
          </Link>

          <Link to="/my-jobs/status" className="home-grid-item">
            <div className="grid-text">
              <h3>Job Status</h3>
              <p>Track active, in progress, or completed jobs</p>
            </div>
          </Link>

          <Link to="/my-jobs/history" className="home-grid-item">
            <div className="grid-text">
              <h3>Job History</h3>
              <p>View current and past submissions</p>
            </div>
          </Link>

          <Link to="/my-account" className="home-grid-item">
            <div className="grid-text">
              <h3>My Account</h3>
              <p>Manage profile settings</p>
            </div>
          </Link>

        </div>

        <div className="footer-section">
          System Version: v0.0.0
        </div>

        <button className="hidden-debug-btn" onClick={() => setCount(count + 1)}>
          count is {count}
        </button>

        <p className="home-note">
          This section is only used for verifying the Amplify → Backend connection.
        </p>

      </div>
    </div>
  );
}

export default AmplifyHome;
