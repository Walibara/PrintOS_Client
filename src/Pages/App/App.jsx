import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react'

import './App.css'
import "../Login/Auth.css";
import './indexResize.css'
import hpLogo from '../../assets/HP_logo_2012.svg'
import AmplifyHome from '../AmplifyHome/AmplifyHome.jsx'// we can remove this later
import Dashboard from '../Dashboard/Dashboard.jsx'
import MyAccount from '../Account/MyAccount.jsx'
import MyJobs from '../MyJobs/MyJobs.jsx'
import JobStatus from '../JobStatus/JobStatus.jsx'
import JobHistory from '../JobHistory/JobHistory.jsx'
import JobSubmission from '../JobSubmission/JobSubmission.jsx'
import FileUpload from '../FileUpload/FileUpload.jsx'
import FileRendering from '../FileRendering/FileRendering.jsx'
import MyLibrary from '../MyLibrary/MyLibrary.jsx'
import AboutUs from '../AboutUs/AboutUs.jsx'
import React, { useState, useEffect } from 'react'
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import LoginPage from '../Login/LoginPage.jsx'


function App() {

  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [firstName, setName] = useState(""); 
  const [userEmail, setUserEmail] = useState("");
 


    useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        const currentAttributes = await fetchUserAttributes();
  
        setUserName(currentAttributes['cognito:username'] || currentAttributes.email?.split('@')[0] || currentUser.username);
        setUserEmail(currentAttributes.email || "");
        setName(currentAttributes.name || ""); 
  
      } catch (error) {
        console.error("Could not load Cognito username", error);
      }
    };
  
    loadUser();
    }, []);

  return (
    <Authenticator.Provider>
      <LoginPage>
        <Authenticator
          signUpAttributes={['email']}
          formFields={{
            signUp: {
              name: {                       
                order: 1,
                placeholder: 'Enter your first name',
                label: 'First Name',
                isRequired: true,
              },
              username: {
                order: 1,
                placeholder: 'Choose a username',
              },
              email: {
                order: 2,
                placeholder: 'Enter your email',
              },
              password: {
                order: 3,
              },
              confirm_password: {
                order: 4,
              },
            },
          }}
    >
          {({ signOut, user }) => {                                      
              const displayName = firstName || user?.attributes?.name || "";

          return (
  <BrowserRouter>
          <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
              <Link to="/dashboard">
                <img
                  src={hpLogo}
                  alt="HP Logo"
                  className="hp-logo"
                  style={{ cursor: "pointer" }}
                />
              </Link>

              <nav className="nav-menu">
                <Link to="/" className="nav-item">
                  Home
                </Link>

                <Link to="/my-account" className="nav-item">
                  My Account
                </Link>

                <Link to="/dashboard" className="nav-item">
                  Dashboard
                </Link>

              <div className="dropdown">
                <div className="nav-item" onClick={() => setIsOpen(!isOpen)}>My Jobs</div>
                {isOpen && (
                  <ul className="nav-submenu">
                    <li>
                      <Link to="/file-upload">Job Submission</Link>
                    </li>
                    {/* <li>
                      <Link to="/my-jobs/status">Job Status</Link>
                    </li> */}
                    <li>
                      <Link to="/my-jobs/history">Job History</Link>
                    </li>
                  </ul>
                )}
              </div>
                
                <Link to="/my-library" className="nav-item">
                  My Library
                </Link>

                <Link to="/about-us" className="nav-item">
                  About Us
                </Link>

                <button onClick={signOut} className="logout">Log out</button>
              </nav>
            </aside>

            {/* Main content */}
            <main className="main-content">

              <header className="topbar">
                <span>Welcome{displayName ? `, ${displayName}` : ""}</span>
              </header>

              <section className="content">
                <Routes>
                  <Route path="/" element={<AmplifyHome />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-account" element={<MyAccount />} />
                  <Route path="/my-jobs" element={<MyJobs />} />
                  <Route path="/my-jobs/status" element={<JobHistory />} />
                  <Route path="/my-jobs/history" element={<JobHistory />} />
                  <Route path="/my-jobs/submit" element={<JobSubmission />} />
                  <Route path="/job-submission" element={<JobSubmission />} />
                  <Route path="/file-upload" element={<FileUpload/>}/>
                  <Route path="/file-rendering" element={<FileRendering/>}/> 
                  <Route path="/about-us" element={<AboutUs/>}/>
                  <Route path="/my-library" element={<MyLibrary />} />

                </Routes>
              </section>
            </main>
          </div>
        </BrowserRouter>
        
      ); 
        }}
    </Authenticator>
    </LoginPage>
  </Authenticator.Provider>
  )
}

export default App
