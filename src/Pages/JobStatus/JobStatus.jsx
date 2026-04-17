import unemployed from "../../assets/unemployed.jpg";
import "../App/App.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./JobStatus.css";
import ActionButton from "../ActionButton/ActionButton.jsx"; 
import { useNavigate } from "react-router-dom";
import * as statusMethods from "./JobStatusUtils.js";  
import { useState, useEffect } from "react"; 
 import { fetchAuthSession } from 'aws-amplify/auth';


export default function JobStatus() {

  const[openModal, setOpenModal] = useState(false);
  const[openDeleteModal, setOpenDeleteModal] = useState(false); 
  const[selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  
  //Grab the jobs
  useEffect(() => {
      const fetchJobs = async () => {
        const session = await fetchAuthSession(); 
        const userId = session.tokens.idToken.payload.sub;
        const data = await statusMethods.getJobs(userId); 
        const selectColumns = data.map((job) => ({
          id: job.id,
          jobNumber: job.jobNumber,
          file: job.originalFile,
          status: job.status,
          date: job.createdAt
        }));
        setJobs(selectColumns);
      };
      fetchJobs();
      const interval = setInterval(fetchJobs, 5000);
      return () => clearInterval(interval);
  }, []);

  // tallying the jobs by status
  // create lists and counts for each status
  const completedJobsList = jobs.filter((job) => job.status === "FINISHED");
  const inProgressJobsList = jobs.filter((job) => job.status === "IN_PROGRESS");
  const failedJobsList = jobs.filter((job) => job.status === "FAILED");


  // handlers for action buttons
  const handleViewReceipt = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  }

  const handleViewDelete = (job) => {
    setSelectedJob(job);
    setOpenDeleteModal(true); 
  }

  const handleRerunJob = (job) => {
    console.log(`Rerunning job ID: ${job.id}`);
    alert(`Rerunning job ID: ${job.id}`);
  }

  const closeModal = () => {
    setOpenModal(false);
    setSelectedJob(null);
  }
  
  const deleteCloseModal = () => {
    setOpenDeleteModal(false);
    setSelectedJob(null); 
  }

  const deleteJobHelper = () => {
    statusMethods.deleteJob(selectedJob); 
    setOpenDeleteModal(false);
    setSelectedJob(null); 
  }

  const navigate = useNavigate();

  
  return (
    <div className="job-status-container">
      <h1 style={{ color: "black" }}>Job Status</h1>
      <button className="submit-btn" onClick={() => navigate("/file-upload")}>Submit New Job</button>
        

        {/*  Completed Jobs */}
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="jobs-list">
            {completedJobsList.map((job) => (
              <div key={job.id} className="job-item">
                <div className={`status-dot ${job.status}`}></div>
                <span className="job-id">{"Job #" + job.jobNumber}</span>
                <span className="job-file">{job.file}</span> 
                <ActionButton 
                  job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
              />
                <span className="job-date">{job.date ? new Date(job.date).toLocaleDateString("en-US", {year: "numeric",month: "2-digit",day: "2-digit"}) : "N/A"}</span>
                <FaCheckCircle color="green"style={{ marginRight: "60px" }} size="1.9em"/>
                <div className="delete" onClick={()=>handleViewDelete(job)}>x</div>
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
                <span className="job-id">{"Job #" + job.jobNumber}</span>
                <span className="job-file">{job.file}</span>
                <ActionButton 
                job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
                /> 
                <span className="job-date">{job.date ? new Date(job.date).toLocaleDateString("en-US", {year: "numeric",month: "2-digit",day: "2-digit"}) : "N/A"}</span>
                <FaClock color="orange" style={{ marginRight: "60px" }} size="1.9em" />
                <div className="delete" onClick={()=>handleViewDelete(job)}>x</div>
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
                <span className="job-id">{"Job #" + job.jobNumber}</span>
                <span className="job-file">{job.file}</span> 
                <ActionButton 
                job={job}
                  onViewReceipt={handleViewReceipt}
                  onRerunJob={handleRerunJob}
              />
                <span className="job-date">{job.date ? new Date(job.date).toLocaleDateString("en-US", {year: "numeric",month: "2-digit",day: "2-digit"}) : "N/A"}</span>
                <FaTimesCircle color="red" style={{ marginRight: "60px" }} size="1.9em" />
                <div className="delete" onClick={()=>handleViewDelete(job)}>x</div>
              </div>
            ))}
          </div>
        </div>


        {/*  The Modal for Receipt */}
        {openModal&& (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
              <h2>Receipt for {selectedJob.jobNumber}</h2>
            </div>
            <div className="receipt-details">
              {selectedJob && (
                <>
                  <p><strong>Job ID:</strong> {selectedJob.jobNumber}</p>
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


        {/*Open Delete Modal*/}
        {openDeleteModal&&(
          <div className="delete-modal-overlay" onClick={deleteCloseModal}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Are you sure you want to delete</h3>
              <div className="job-delete-title">Job {selectedJob.jobNumber}?</div>
              <div className="button-div">
                <button className="cancelDelete" onClick={deleteCloseModal}>Cancel</button>
                <button className= "confirmDelete" onClick={deleteJobHelper}>Delete</button>
              </div>
            </div>
          </div>
        )}
    </div>

  );
}
