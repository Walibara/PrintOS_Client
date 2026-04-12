import React from "react";
import "./Dashboard.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as statusMethods from "../JobStatus/JobStatusUtils.js";

export default function Dashboard() {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Grab the jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await statusMethods.getJobs();

        const mappedJobs = data.map((job) => ({
          id: `Job-${job.id}`,
          file: job.originalFile || job.files || "No file",
          status: mapStatus(job.status),
          date: job.createdAt,
        }));


        // // Sort jobs by date (newest first)   
        // mappedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestThree = mappedJobs.slice(0, 3);

        // Update state with the latest three jobs
        setJobHistory(latestThree);

      } catch (err) {
        setError(err.message || "Failed to load job history");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);


  const mapStatus = (dbStatus) => {
  switch (dbStatus) {
    case "FINISHED":
      return "success";
    case "FAILED":
      return "error";
    case "CREATED":
    case "IN_PROGRESS":
      return "pending";
    default:
      return "pending";
  }
};

  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <button 
        className="submit-btn"
        onClick={() => navigate("/file-upload")}
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
