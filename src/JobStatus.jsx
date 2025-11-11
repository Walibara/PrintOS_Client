import unemployed from "./assets/unemployed.jpg";
import "./App.css";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import "./JobStatus.css";

export default function JobStatus() {

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


  
  return (
    <div className="job-status-container">
      <h1>Job Status</h1>
      <div className="job-status-image-wrapper">
        <img
          src={unemployed}
          alt="Unemployed"
          className="job-status-image"
        />
      </div>

      <h2 className="job-status-bigtext">"Ai is NOT taking our JOBS!! its OUTSOURCING!!!" ...  I scream as they drag me to the asylum. </h2>
 
      <button className="submit-btn">Submit New Job</button>
        

        {/*  Completed Jobs */}
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="jobs-list">
            {completedJobsList.map((job) => (
              <div key={job.id} className="job-item">
                <div className={`status-dot ${job.status}`}></div>
                <span className="job-id">{job.id}</span>
                <span className="job-file">{job.file}</span> 
                <span className="job-date">{job.date}</span>
                <FaCheckCircle color="green" size="1.2em" />
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
                <span className="job-date">{job.date}</span>
                <FaClock color="orange" size="1.2em" />
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
                <span className="job-date">{job.date}</span>
                <FaTimesCircle color="red" size="1.2em" />
              </div>
            ))}
          </div>
        </div>

    
    </div>

  );
}
