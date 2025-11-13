import React from "react";
import "./Dashboard.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const jobHistory = [
    { id: "Job-144", file: "Imposition.business_cards.pdf", status: "success" },
    { id: "Job-145", file: "Imposition.photo_cards.pdf", status: "error" },
    { id: "Job-146", file: "Imposition.photo_cards.pdf", status: "pending" },
  ];

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <button 
        className="submit-btn"
        onClick={() => navigate("/job-submission")}
      >
        Submit New Job
      </button>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs Today</h3>
          <hr />
          <h1>36</h1>
          <p>^ 12% from yesterday</p>
        </div>
        <div className="stat-card">
          <h3>Processing</h3>
          <hr />
          <h1>33</h1>
          <p>Jobs in Progress</p>
        </div>
        <div className="stat-card">
          <h3>Needs Review</h3>
          <hr />
          <h1>3</h1>
          <p>Retry Attempts: 3</p>
        </div>
      </div>

      <div className="history-section">
        <h2>View Recent Job History:</h2>
        <div className="history-list">
          {jobHistory.map((job) => (
            <div key={job.id} className="history-item">
              <div className={`status-dot ${job.status}`}></div>
              <span className="job-id">{job.id}</span>
              <span className="job-file">{job.file}</span>
              <span className="status-icon">
                {job.status === "success" && <FaCheckCircle color="green" size="1.2em" />}
                {job.status === "error" && <FaTimesCircle color="red" size="1.2em" />}
                {job.status === "pending" && <FaClock color="orange" size="1.2em" />}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
