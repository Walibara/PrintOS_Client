import unemployed from "../../assets/unemployed.jpg";
import "../App/App.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./JobStatus.css";
import ActionButton from "../ActionButton/ActionButton.jsx"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function JobStatus() {

  const[openModal, setOpenModal] = useState(false);
  const[selectedJob, setSelectedJob] = useState(null);

      const jobHistory = [
    { id: "Job-144", file: "Imposition.business_cards.pdf", status: "success",  date: "2024-02-15" },
    { id: "Job-145", file: "Imposition.photo_cards.pdf", status: "success",  date: "2024-02-15" },
    { id: "Job-146", file: "Imposition.photo_cards.pdf", status: "pending",  date: "2024-01-15" },
    { id: "Job-147", file: "Imposition.business_cards.pdf", status: "success",  date: "2024-01-13" },
    { id: "Job-148", file: "Imposition.photo_cards.pdf", status: "error",  date: "2024-01-13" },
    { id: "Job-149", file: "Imposition.photo_cards.pdf", status: "error",  date: "2023-12-10"},
    { id: "Job-150", file: "Imposition.business_cards.pdf", status: "success",  date: "2023-12-11" },
    { id: "Job-151", file: "Imposition.photo_cards.pdf", status: "error",  date: "2023-12-11" },
    { id: "Job-152", file: "Imposition.photo_cards.pdf", status: "pending",  date: "2023-12-11" },
    
  ];


  // tallying the jobs by status
  // create lists and counts for each status
  const completedJobsList = jobHistory.filter((job) => job.status === "success");
  const inProgressJobsList = jobHistory.filter((job) => job.status === "pending");
  const failedJobsList = jobHistory.filter((job) => job.status === "error");


  // handlers for action buttons
  const handleViewReceipt = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  }

  const handleRerunJob = (job) => {
    console.log(`Rerunning job ID: ${job.id}`);
    alert(`Rerunning job ID: ${job.id}`);
  }

  const closeModal = () => {
    setOpenModal(false);
    setSelectedJob(null);
  }

  const navigate = useNavigate();

  
  return (
    <div className="job-status-container">
      <h1 style={{ color: "black" }}>Job Status</h1>
      <div className="job-status-image-wrapper">
        <img
          src={unemployed}
          alt="Unemployed"
          className="job-status-image"
        />
      </div>

      <h2 className="job-status-bigtext" style={{color:"black"}}>"Ai is NOT taking our JOBS!! its OUTSOURCING!!!" ...  I scream as they drag me to the asylum. </h2>

      <button className="submit-btn" onClick={() => navigate("/file-upload")}>Submit New Job
      </button>
        

        {/*  Completed Jobs */}
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="jobs-list">
            {completedJobsList.map((job) => (
              <div key={job.id} className="job-item">
                <div className={`status-dot ${job.status}`}></div>
                <span className="job-id">{job.id}</span>
                <span className="job-file">{job.file}</span> 
                <ActionButton 
                  job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
              />
                <span className="job-date">{job.date}</span>
                <FaCheckCircle color="green"style={{ marginRight: "60px" }} size="1.9em"/>
              </div>
            ))}
          </div>
        </div>

        {/*  In Progress Jobs */}
        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="jobs-list">
            {inProgressJobsList.map((job) => (
              <div key={job.id} className="job-item">
                <div className={`status-dot ${job.status}`}></div>
                <span className="job-id">{job.id}</span>
                <span className="job-file">{job.file}</span>
                <ActionButton 
                job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
              /> 
                <span className="job-date">{job.date}</span>
                <FaClock color="orange" style={{ marginRight: "60px" }} size="1.9em" />
              </div>
            ))}
          </div>
        </div>

        {/*  Failed Jobs */}
        <div className="stat-card">
          <h3>Failed</h3>
          <div className="jobs-list">
            {failedJobsList.map((job) => (
              <div key={job.id} className="job-item">
                <div className={`status-dot ${job.status}`}></div>
                <span className="job-id">{job.id}</span>
                <span className="job-file">{job.file}</span> 
                <ActionButton 
                job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
              />
                <span className="job-date">{job.date}</span>
                <FaTimesCircle color="red" style={{ marginRight: "60px" }} size="1.9em" />
              </div>
            ))}
          </div>
        </div>


        {/*  The Modal for Receipt */}

        {openModal&& (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
              <h2>Receipt for {selectedJob.id}</h2>
              <button className="close-modal-btn" onClick={closeModal}>X</button>
            </div>
            <div className="receipt-details">
              {selectedJob && (
                <>
                  <p><strong>Job ID:</strong> {selectedJob.id}</p>
                  <p><strong>File:</strong> {selectedJob.file}</p>
                  <p><strong>Status:</strong> {selectedJob.status}</p>
                  <p><strong>Date:</strong> {selectedJob.date}</p>
                <div className="receipt-amount">
                  <p><strong>Amount Paid:</strong> $50.00</p>
                </div>
            </>
            )}
          </div>
          <div className="modal-footer">
            <button className="print-receipt-btn">Print Receipt</button>
            <button className="download-receipt-btn">Download PDF</button>
          </div>
          </div>
          </div>
        )}
    </div>

  );
}
