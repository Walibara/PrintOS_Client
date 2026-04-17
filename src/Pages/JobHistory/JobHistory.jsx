import wrongDB from "../../assets/wrong_db.jpeg";
import "../App/App.css";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import "./JobHistory.css";
import * as statusMethods from "../JobStatus/JobStatusUtils.js";  
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import ActionButton from "../ActionButton/ActionButton.jsx";
import { fetchAuthSession } from "aws-amplify/auth";

export default function JobHistory() {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  

  // Grab the jobs
  useEffect(() => {
    const fetchJobs = async (userId) => {
      try {
        setLoading(true);
        setError("");
        const data = await statusMethods.getJobs(userId);

        const mappedJobs = data.map((job) => ({
          id: `Job-${job.id}`,
          displayId: `Job-${job.id}`,
          file: job.originalFile || job.files || "No file",
          status: mapStatus(job.status),
          date: job.createdAt,
        }));

        // Sort jobs by date (newest first)
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

    const filteredJobs = jobHistory.filter((job) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "COMPLETED") return job.dbStatus === "FINISHED";
    if (statusFilter === "IN_PROGRESS") {
      return job.dbStatus === "IN_PROGRESS" || job.dbStatus === "CREATED";
    }
    if (statusFilter === "FAILED") return job.dbStatus === "FAILED";
    return true;
  });

  //calculateing the total pages


  const totalPages = Math.max(1, Math.ceil(jobHistory.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = jobHistory.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [jobHistory, currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewReceipt = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const handleViewDelete = (job) => {
    setSelectedJob(job);
    setOpenDeleteModal(true);
  };

  const handleRerunJob = (job) => {
    console.log(`Rerunning job ID: ${job.id}`);
    alert(`Rerunning job ID: ${job.id}`);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedJob(null);
  };

   const deleteCloseModal = () => {
    setOpenDeleteModal(false);
    setSelectedJob(null);
  };

  const deleteJobHelper = async () => {
    try {
      await statusMethods.deleteJob(selectedJob.id);
      setJobHistory((prev) => prev.filter((job) => job.id !== selectedJob.id));
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert(err.message || "Failed to delete job.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedJob(null);
    }
  };
 const renderStatusIcon = (job) => {
    if (job.status === "success") {
      return <FaCheckCircle color="green" size="1.2em" />;
    }
    if (job.status === "error") {
      return <FaTimesCircle color="red" size="1.2em" />;
    }
    return <FaClock color="orange" size="1.2em" />;
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
        <button type="button" className="pagination-button" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button type="button" key={page} className={`page-number ${currentPage === page ? "active" : ""}`} onClick={() => handlePageChange(page)}>{page}</button>
          ))}

        </div>
        <button type="button" className="pagination-button" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>

      </div>
    
    </div>  

  );
}