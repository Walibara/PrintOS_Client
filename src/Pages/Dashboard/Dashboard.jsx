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

  const [totalJobs, setTotalJobs] = useState(0);
  const [inProgressJobs, setInprogressJobs] = useState(0);
  const [failedJobs, setFailedJobs] = useState(0);
  const [finishedJobs, setFinishedJobs] = useState(0);
  const [jobsToday, setJobsToday] = useState(0);
  const [jobsYesterday, setJobsYesterday] = useState(0);
  const [jobsPercentChange, setJobsPercentChange] = useState(0);

  // Grab the jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await statusMethods.getJobs();

        const mappedJobs = data.map((job) => ({
          id: job.id,
          jobNumber: job.jobNumber,
          file: job.originalFile || job.files || "No file",
          status: mapStatus(job.status),
          date: job.createdAt,
        }));

        // Format date helper
        const formatDay = (dateValue) => {
          const date = new Date(dateValue);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayKey = formatDay(today);
        const yesterdayKey = formatDay(yesterday);

        const jobsByDate = {};

        // Count jobs per day
        for (const job of data) {
          if (!job.createdAt) continue;
          const dateKey = formatDay(job.createdAt);
          if (!jobsByDate[dateKey]) {
            jobsByDate[dateKey] = 0;
          }
          jobsByDate[dateKey]++;
        }

        const todayCount = jobsByDate[todayKey] || 0;
        const yesterdayCount = jobsByDate[yesterdayKey] || 0;

        setJobsToday(todayCount);
        setJobsYesterday(yesterdayCount);

        // Calculate percentage change
        let percentChange = 0;
        if (yesterdayCount === 0 && todayCount > 0) {
          percentChange = 100;
        } else if (yesterdayCount > 0) {
          percentChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
        }
        setJobsPercentChange(percentChange);

        // Count jobs by status
        const total = data.length;
        let inProgress = 0;
        let failed = 0;
        let finished = 0;

        for (const job of data) {
          switch (job.status) {
            case "IN_PROGRESS":
            case "CREATED":
              inProgress++;
              break;
            case "FAILED":
              failed++;
              break;
            case "FINISHED":
              finished++;
              break;
            default:
              break;
          }
        }

        setTotalJobs(total);
        setInprogressJobs(inProgress);
        setFailedJobs(failed);
        setFinishedJobs(finished);

        // Sort jobs by date (newest first)
        mappedJobs.sort((one, two) => {
          const jobOneHasADate = !!one.date;
          const jobTwoHasADate = !!two.date;

          if (jobOneHasADate && !jobTwoHasADate) return -1;
          if (!jobOneHasADate && jobTwoHasADate) return 1;

          if (jobOneHasADate && jobTwoHasADate) {
            return new Date(two.date) - new Date(one.date);
          }

          return two.id - one.id;
        });

        const latestJobs = mappedJobs.slice(0, 3);
        setJobHistory(latestJobs);

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
          <h2>Jobs Today</h2>
          <hr />
          <h1>{totalJobs}</h1>
          <p>{jobsPercentChange >= 0 ? "↑" : "↓"} {Math.abs(jobsPercentChange).toFixed(1)}% from yesterday</p>
        </div>
        <div className="stat-card">
          <h2>In Progress</h2>
          <hr />
          <h1>{inProgressJobs}</h1>
          <p>Jobs in Progress</p>
        </div>
        <div className="stat-card">
          <h2>Failed</h2>
          <hr />
          <h1>{failedJobs}</h1>
          <p>Jobs Failed</p>
        </div>
        <div className="stat-card">
          <h2>Finished</h2>
          <hr />
          <h1>{finishedJobs}</h1>
          <p>Jobs Completed</p>
        </div>
      </div>

      <div className="history-section">
        <h2>View Recent Job History:</h2>
        <div className="history-list">
          {jobHistory.map((job) => (
            <div key={job.id} className="history-item">
              <div className={`status-dot ${job.status}`}></div>
              <span className="job-id">{"Job #" + job.jobNumber}</span>
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