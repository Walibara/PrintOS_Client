import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'

import './App.css'
import hpLogo from './assets/HP_logo_2012.svg'
import AmplifyHome from './AmplifyHome.jsx'// we can remove this later
import Dashboard from './Dashboard.jsx'
import MyAccount from './MyAccount.jsx'
import MyJobs from './MyJobs.jsx'
import JobStatus from './JobStatus.jsx'
import JobHistory from './JobHistory.jsx'

function App() {
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
              Amplify Home
            </Link>

            <Link to="/my-account" className="nav-item">
              My Account
            </Link>

            <Link to="/dashboard" className="nav-item">
              Dashboard
            </Link>

            <div className="nav-item">My Jobs</div>
            <ul className="nav-submenu">
              <li>
                <Link to="/my-jobs/status">Job Status</Link>
              </li>
              <li>
                <Link to="/my-jobs/history">Job History</Link>
              </li>
            </ul>

            <div className="logout">Log out</div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <header className="topbar">
            <span>Welcome, John Doe</span>
          </header>

          <section className="content">
            <Routes>
              <Route path="/" element={<AmplifyHome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/my-jobs" element={<MyJobs />} />
              <Route path="/my-jobs/status" element={<JobStatus />} />
              <Route path="/my-jobs/history" element={<JobHistory />} />
            </Routes>
          </section>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
