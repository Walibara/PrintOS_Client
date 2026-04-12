import wrongDB from "../../assets/wrong_db.jpeg";
import "../App/App.css";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import "./JobHistory.css";
import * as statusMethods from "../JobStatus/JobStatusUtils.js";  
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';


export default function JobHistory() {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

        // Sort jobs by date (newest first)
        mappedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setJobHistory(mappedJobs);
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

  //calculateing the total pages

  const totalPages = Math.ceil(jobHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = jobHistory.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //loading jobs
  if (loading) {
    return (<p>Loading jobs...</p>);
  }
  if (error) {
    return (<p>An Error has occurred: {error}</p>);
  }

  return (
    <div className="job-history-container">
      <div className="history-section">
        <h1>Job History</h1>
        <div className="history-list">
          {currentItems.map((job) => (
            <div key={job.id} className="history-item">
              <div className={`status-dot ${job.status}`}></div>
              <span className="job-id">{job.id}</span>
              <span className="job-file">{job.file}</span>
              <span className="job-date">{job.date ? new Date(job.date).toLocaleDateString("en-US", {year: "numeric",month: "2-digit",day: "2-digit"}) : "N/A"}</span>
              <span className="status-icon">
                {job.status === "success" && <FaCheckCircle color="green" size="1.2em" />}
                {job.status === "error" &&  <FaTimesCircle color="red" size="1.2em" />}
                {job.status === "pending" && <FaClock color="orange" size="1.2em" />}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="paginations">
        <button className="pagination-button" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button className={ `page-number ${currentPage === page ? 'active' : ''}`} onClick={() =>handlePageChange(page)}>{page}</button>
          ))}

        </div>
        <button className="pagination-button" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>

      </div>
    
    </div>  

  );
}
