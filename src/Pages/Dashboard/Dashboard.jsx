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
        mappedJobs.sort((one, two) => {
          const jobOneHasADate = !!one.date;
          const jobTwoHasADate = !!two.date;

          //if one job has a date and the other doesn't, the one with the date is there first
          if (jobOneHasADate&& !jobTwoHasADate) return -1;
          if (!jobOneHasADate&& jobTwoHasADate) return 1;

          //if both have dates, sort by date
          if (jobOneHasADate && jobTwoHasADate) {
            return new Date(two.date) - new Date(one.date);
          }
          //sorting the job by descinging id 

          const jobOneId = Number(String(one.id).replace("Job-", ""));
          const jobTwoId = Number(String(two.id).replace("Job-", ""));

          return jobTwoId - jobOneId;
        });

        const latestJobs = mappedJobs.slice(0, 3);

        // Update state with the latest three jobs
        setJobHistory(latestJobs);

      } catch (err) {
        setError(err.message || "Failed to load job history");
      } finally {
        setLoading(false);
      }

      //counting the data
      const data = await statusMethods.getJobs();
      const total = data.length;
      let inProgress = 0;
      let failed = 0;
      let finished = 0;

      //grouping the jobs by status and counting them
      for (const job of data) {
        switch (job.status) {
          case "IN_PROGRESS":
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
          <h1>{totalJobs}</h1>
          <p>^ 12% from yesterday</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <hr />
          <h1>{inProgressJobs}</h1>
          <p>Jobs in Progress</p>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <hr />
          <h1>{failedJobs}</h1>
          <p>Retry Attempts: 3</p>
        </div>
        <div className="stat-card">
          <h3>Finished</h3>
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
