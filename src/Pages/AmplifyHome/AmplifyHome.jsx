import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import trustme from "../../assets/trust-me-bro.jpeg";
import "./AmplifyHome.css";
import { SquareUser, LayoutDashboard, Files, History } from 'lucide-react';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, updatePassword, deleteUser } from 'aws-amplify/auth';

function AmplifyHome() {
  const [message, setMessage] = useState("Loading...");
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");


  useEffect(() => {
    let baseUrl = import.meta.env.VITE_API_URL;

    if (!baseUrl) {
      if (window.location.hostname.includes("amplifyapp.com")) {
        baseUrl = "https://dkdavnbhgrmho.cloudfront.net"
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

  
    useEffect(() => {
      const loadUser = async () => {
        try {
          const currentUser = await getCurrentUser();
          const currentAttributes = await fetchUserAttributes(); 
          setName(currentAttributes.name || "");   
        } catch (error) {
          console.error("Could not load Cognito username", error);
        }
      };
  
      loadUser();
    }, []);

  return (
    <div className="home-container">
      <div className="home-card">

        {/*<img src={trustme} className="home-meme-top" /> MEME*/}

        <h1 className="home-title">
          HP PrintOS Application
        </h1>
        <p className="welcome-friend">Welcome {name}! Where would you like to go?</p>

       {/*} <div className="system-banner">
          <div>
            <strong>System Status: All Services Online</strong>
            <p className="system-sub">
              All backend services are connected and running normally.
            </p>
            <p className="api-status">
              Backend says: {message}
            </p>
          </div>
        </div>*/}

        <div className="home-grid">

          <Link to="/my-account" className="home-grid-item">
            <div className="grid-text">
              <div className="grid-icon">
                <SquareUser size={58} />
              </div>
              <h3>My Account</h3>
              <p>Manage profile settings</p>
            </div>
          </Link>

          <Link to="/dashboard" className="home-grid-item">
            <div className="grid-text">
              <div className="grid-icon-dashboard">
                <LayoutDashboard size={58} />  
              </div> 
              <h3>Dashboard</h3>
              <p>Overview of job activity</p>
            </div>
          </Link>

          <Link to="/my-library" className="home-grid-item">
            <div className="grid-text">
              <div className="grid-icon-library">
                <Files size={58} />
              </div>
              <h3>Library</h3>
              <p>View your files or access free files</p>
            </div>
          </Link>

          <Link to="/my-jobs/history" className="home-grid-item">
            <div className="grid-text">
              <div className="grid-icon-history">
                <History size={58} />
              </div>
              <h3>Job History</h3>
              <p>Track active, in progress, or completed jobs</p>
            </div>
          </Link>


        </div>

        <button className="hidden-debug-btn" onClick={() => setCount(count + 1)}>
          count is {count}
        </button>

      </div>
    </div>
  );
}

export default AmplifyHome;
