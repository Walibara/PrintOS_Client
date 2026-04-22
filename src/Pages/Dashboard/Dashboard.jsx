import React from "react";
import "./Dashboard.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as statusMethods from "../JobStatus/JobStatusUtils.js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Printer, SquareCheck, Clock8, CircleX, TrendingUp, Calendar } from 'lucide-react';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, updatePassword, deleteUser } from 'aws-amplify/auth';


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
  const [jobsByDate, setJobsByDate] = useState({});
  const [completedJobs, setCompletedJobs] = useState(0); 
  const [failedJobPercent, setFailedJobPercent] = useState(0); 
  const [progressJobPercent, setProgressJobPercent] = useState(0); 

  const donutData = [
    { name: "Completed", value: finishedJobs },
    { name: "In Progress", value: inProgressJobs },
    { name: "Failed", value: failedJobs },
  ];

  const COLORS = ["#d698f8", "#90c6fc", "#fec18b"];

  const trendData = Object.entries(jobsByDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => ({ date, count }));

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
        for (const job of data) {
          if (!job.createdAt) continue;
            const dateKey = formatDay(job.createdAt);
          if (!jobsByDate[dateKey]) jobsByDate[dateKey] = 0;
            jobsByDate[dateKey]++;
        }

        const todayCount = jobsByDate[todayKey] || 0;
        const yesterdayCount = jobsByDate[yesterdayKey] || 0;

        setJobsToday(todayCount);
        setJobsYesterday(yesterdayCount);
        setJobsByDate(jobsByDate);

        let percentChange = 0;
        if (yesterdayCount === 0 && todayCount > 0) {
          percentChange = 100;
        } else if (yesterdayCount > 0) {
          percentChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
        }
        setJobsPercentChange(percentChange);

        mappedJobs.sort((one, two) => {
          const jobOneHasADate = !!one.date;
          const jobTwoHasADate = !!two.date;
          if (jobOneHasADate && !jobTwoHasADate) return -1;
          if (!jobOneHasADate && jobTwoHasADate) return 1;
          if (jobOneHasADate && jobTwoHasADate) return new Date(two.date) - new Date(one.date);
          return two.id - one.id;
        });

        setJobHistory(mappedJobs.slice(0, 3));

        const total = data.length;
        let inProgress = 0, failed = 0, finished = 0;

        for (const job of data) {
          switch (job.status) {
            case "IN_PROGRESS": inProgress++; break;
            case "FAILED": failed++; break;
            case "FINISHED": finished++; break;
            default: break;
          }
        }

        setCompletedJobs(total !== 0 ? (finished / total) * 100 : 0);
        setFailedJobPercent(total !== 0 ? (failed / total) * 100 : 0);
        setProgressJobPercent(total !== 0 ? (inProgress / total) * 100 : 0);
        setTotalJobs(total);
        setInprogressJobs(inProgress);
        setFailedJobs(failed);
        setFinishedJobs(finished);

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
      <h1>Dashboard</h1>
      <p className="printjobs">Here's what's happening with your print jobs.</p> 
      <div className="stats-grid">
        <div className="stat-card">
          <div className="grid-icon-printer">
            <Printer size={50} />
          </div>
          <span className="top-of-card">{jobsPercentChange >= 0 ? "↑" : "↓"} {Math.abs(jobsPercentChange).toFixed(1)}%</span>
          <h1>{totalJobs}</h1>  
          <p>Total Jobs</p>        
        </div>
        <div className="stat-card">
          <div className="grid-icon-timer">
            <Clock8 size={50} />
          </div>
          <span className="top-of-card">{progressJobPercent.toFixed(2)}%</span>
          <h1>{inProgressJobs}</h1>
          <p>Jobs in Progress</p>
        </div>
        <div className="stat-card">
          <div className="grid-icon-failed">
            <CircleX size={50} />
          </div>
          <span className="top-of-card">{failedJobPercent.toFixed(2)}%</span>
          <h1>{failedJobs}</h1>
          <p>Jobs Failed </p>
        </div>
        <div className="stat-card">
          <div className="grid-icon-check">
            <SquareCheck size={50} /> 
          </div>
          <span className="top-of-card">{completedJobs.toFixed(2)}%</span>
          <h1>{finishedJobs}</h1>
          <p>Jobs Completed</p>
        </div>
      </div>

      <div className="statistics">
        <div className="donut-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".5rem"}}>
            <div className="grid-icon-trending">
              <TrendingUp size={50} />
            </div>
            <h4>Print Status Distribution</h4>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {donutData.map((entry, i) => (
              <span key={entry.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], display: "inline-block" }} />
                {entry.name} — {entry.value}
              </span>
            ))}
          </div>

          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={0} dataKey="value">
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none"
            }}>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{totalJobs}</div>
              <div style={{ fontSize: 11, color: "#888" }}>total</div>
            </div>
          </div>
        </div>

        
        <div className="graph-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".5rem"}}>
            <div className="grid-icon-calendar">
              <Calendar size={50} />
            </div>
            <h4>Print Volume Trend</h4>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#534AB7"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="db-history-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem"}}>
          <h4>Recent Print Jobs:</h4>
          <button className="submit-btn" onClick={() => navigate("/file-upload")}>Submit New Job</button>
        </div>
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
