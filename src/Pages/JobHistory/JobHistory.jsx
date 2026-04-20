import wrongDB from "../../assets/wrong_db.jpeg";
import "../App/App.css";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import "./JobHistory.css";
import * as statusMethods from "../JobStatus/JobStatusUtils.js";  
import { Printer, CheckCircle2, Clock3, XCircle, CalendarDays, FileText, Copy, ReceiptText, RotateCcw, Trash2} from "lucide-react";
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
          id: job.id,
          displayId: `Job-${job.jobNumber}`,
          title: job.originalFile || job.files || "No file",
          file: job.originalFile || job.files || "No file",
          dbStatus: job.status,
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
      }catch (err) {
        if (err?.status === 404 || err?.message?.includes("User not found")) {
          setJobHistory([]);  
          setError("");       
          setError(err.message || "Failed to load job history");
        }
      }finally {
        setLoading(false);
      }
    };


    fetchJobs();
    const interval = setInterval(fetchJobs, 10000000);
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


  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    

    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [filteredJobs, currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const handleViewReceipt = (job) => {
  console.log("opening modal for", job);
  setSelectedJob(job);
  setOpenModal(true);
};

  const handleViewDelete = (job) => {
    setSelectedJob(job);
    setOpenDeleteModal(true); 
  }

  const handleRerunJob = (job) => {
    console.log(`Rerunning job ID: ${job.id}`);
    navigate("/file-upload");
  }

  const closeModal = () => {
    setOpenModal(false);
    setSelectedJob(null);
  }
  
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
  switch(job){
    case "success":
      return {
        label: "Completed",
        icon: <CheckCircle2 size={22} strokeWidth={2.2} />,
        badgeClass: "status-badge badge-success",
        iconWrapClass: "job-icon success",
        actionType: "receipt"
      }

    case "error":
      return {
        label: "Failed",
        icon: <XCircle size={22} strokeWidth={2.2} />,
        badgeClass: "status-badge badge-error",
        iconWrapClass: "job-icon error",
        actionType: "rerun"
      };
    default:
      return {
        label: "In Progress",
        icon: <Clock3 size={22} strokeWidth={2.2} />,
        badgeClass: "status-badge badge-pending",
        iconWrapClass: "job-icon pending",
        actionType: "rerun"
      };

  }
    // if (job.status === "success") {
    //   return <FaCheckCircle color="green" size="1.2em" />;
    // }
    // if (job.status === "error") {
    //   return <FaTimesCircle color="red" size="1.2em" />;
    // }
    // return <FaClock color="orange" size="1.2em" />;
  };


  //loading jobs
  if (loading) {
    return (<p>Loading jobs...</p>);
  }
  if (error) {
    return <p>No job history available</p>;
  }

  const stats = {
    total: jobHistory.length,
    completed: jobHistory.filter((j) => j.dbStatus === "FINISHED").length,
    inProgress: jobHistory.filter(
      (j) => j.dbStatus === "IN_PROGRESS" || j.dbStatus === "CREATED"
    ).length,
    failed: jobHistory.filter((j) => j.dbStatus === "FAILED").length,
};



  return (
    <div className="job-history-container">
      <div className="job-history-inner">
      <div className="history-header">
        <h1>Job History</h1>
        <p>Review your past print jobs, check their status, and manage them all in one place.</p>
        <button
          className="submit-btn"
          onClick={() => navigate("/file-upload")}
        >
          Submit New Job
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon"><Printer size={20} /></div>
          <h2>{stats.total}</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><Printer size={20} /></div>
          <h2>{stats.completed}</h2>
          <p>Completed</p>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><Printer size={20} /></div>
          <h2>{stats.inProgress}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card red">
          <div className="stat-icon"><Printer size={20} /></div>
          <h2>{stats.failed}</h2>
          <p>Failed</p>
        </div>
      </div>
      <div className="history-filters">
        <button
          type="button"
          className={`filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
          onClick={() => setStatusFilter("ALL")}
        >
          All
        </button>

        <button
          type="button"
          className={`filter-btn ${statusFilter === "COMPLETED" ? "active" : ""}`}
          onClick={() => setStatusFilter("COMPLETED")}
        >
          Completed
        </button>

        <button
          type="button"
          className={`filter-btn ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        >
          In Progress
        </button>

        <button
          type="button"
          className={`filter-btn ${statusFilter === "FAILED" ? "active" : ""}`}
          onClick={() => setStatusFilter("FAILED")}
        >
          Failed
        </button>
      </div>
      <div className="job-history-content">
        <div className="jobs-panel">
          <div className="jobs-list">
            {currentItems.length === 0 ? (
              <div className="empty-history">No jobs found for the selected filter.</div>
            ) : (
              currentItems.map((job) => {
                const statusConfig = renderStatusIcon(job.status);

                return (
                  <article key={job.id} className="job-card">
                    <div className={statusConfig.iconWrapClass}>
                      {statusConfig.icon}
                    </div>

                    <div className="job-main">
                      <h3 className="job-name">{job.title}</h3>
                      <p className="job-id">{job.displayId}</p>

                      <div className="job-meta">
                        <span>
                          <CalendarDays size={17} />
                          {job.date
                            ? new Date(job.date).toLocaleDateString("en-CA")
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="job-side">
                      <span className={statusConfig.badgeClass}>
                        {statusConfig.label}
                      </span>

                      {statusConfig.actionType === "receipt" ? (
                        <button
                          type="button"
                          className="action-btn receipt-btn"
                          onClick={() => handleViewReceipt(job)}
                        >
                          <ReceiptText size={18} />
                          View Receipt
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="action-btn rerun-btn"
                          onClick={() => handleRerunJob(job)}
                        >
                          <RotateCcw size={18} />
                          Rerun
                        </button>
                      )}

                      <button
                        type="button"
                        className="icon-delete-btn"
                        onClick={() => handleViewDelete(job)}
                        aria-label={`Delete ${job.displayId}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="paginations">
        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              className={`page-number ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      </div>

      {openModal && selectedJob && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h2>Receipt for {selectedJob.displayId}</h2>
            </div>

            <div className="receipt-details">
              <p><strong>Job ID:</strong> {selectedJob.displayId}</p>
              <p><strong>File:</strong> {selectedJob.file}</p>
              <p><strong>Status:</strong> {selectedJob.dbStatus}</p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedJob.date ? new Date(selectedJob.date).toLocaleString() : "N/A"}
              </p>

              <div className="receipt-amount">
                <p><strong>Amount Paid:</strong> $50.00</p>
              </div>
            </div>

            <div className="custom-modal-footer">
              <button className="print-receipt-btn">Print Receipt</button>
              <button className="download-receipt-btn">Download PDF</button>
              <button className="cancelDelete" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {openDeleteModal && selectedJob && (
        <div className="delete-modal-overlay" onClick={deleteCloseModal}>
          <div
            className="delete-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Are you sure you want to delete</h3>
            <div className="job-delete-title">{selectedJob.displayId}?</div>

            <div className="button-div">
              <button className="cancelDelete" onClick={deleteCloseModal}>
                Cancel
              </button>
              <button className="confirmDelete" onClick={deleteJobHelper}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    
    </div>  

  );
}