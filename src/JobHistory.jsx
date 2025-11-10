import wrongDB from "./assets/wrong_db.jpeg";
import "./App.css";
import { useState } from "react";
import "./JobHistory.css";


export default function JobHistory() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  //the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //calculateing the total pages

  const totalPages = Math.ceil(jobHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = jobHistory.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


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
              <span className="job-date">{formatDate(job.date)}</span>
              <span className="status-icon">
                {job.status === "success" && "✅"}
                {job.status === "error" && "❌"}
                {job.status === "pending" && "⏳"}
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
