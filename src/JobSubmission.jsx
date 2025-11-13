import React, { useState } from "react";
import "./JobSubmission.css";
import BennyFront from "./assets/BennyFront.png";
import BennyBack from "./assets/BennyBack.png";

function JobSubmission() {
  const [jobType, setJobType] = useState("Imposition");

  const handleSubmit = (e) => {
    e.preventDefault();
    // later this will call the backend
    console.log("Submitting job with type:", jobType);
    alert(`Job submitted as: ${jobType}`);
  };

  return (
    <div className="job-submission-page">
      <h1 className="job-submission-title">File Upload</h1>

      <div className="job-submission-content">
        {/* LEFT: file preview */}
        <div className="job-preview-card">
          <div className="job-preview-inner">
            <img
              src={BennyFront}
              alt="Front of business card"
              className="job-preview-image"
            />
            <img
              src={BennyBack}
              alt="Back of business card"
              className="job-preview-image"
            />
          </div>
          <p className="job-preview-caption">Your file</p>
        </div>

        {/* RIGHT: form */}
        <form className="job-form" onSubmit={handleSubmit}>
          <label className="job-form-label">
            Select Job Type
            <select
              className="job-type-select"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="Imposition">Imposition</option>
              <option value="Color Correction">Color Correction</option>
              <option value="Proofing">Proofing</option>
              <option value="Finishing">Finishing</option>
            </select>
          </label>

          <button type="submit" className="job-submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobSubmission;
