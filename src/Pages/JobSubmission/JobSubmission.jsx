import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./JobSubmission.css";
import BennyFront from "../../assets/BennyFront.png";
import BennyBack from "../../assets/BennyBack.png";

function JobSubmission() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------------------------------------
  // This just remembers which job type the user picked.
  // ---------------------------------------------------------
  const [jobType, setJobType] = useState("Imposition");

  // ---------------------------------------------------------
  // NEW (no UI change):
  // Get uploaded file info from the previous page.
  // Priority:
  // 1) react-router navigation state
  // 2) sessionStorage fallback
  // ---------------------------------------------------------
  const fileName =
    location.state?.fileName || sessionStorage.getItem("uploadedFileName") || "";

  const fileTypeRaw =
    location.state?.fileType || sessionStorage.getItem("uploadedFileType") || "";

  // Convert MIME type ("application/pdf") -> "pdf" when needed
  const fileType = fileTypeRaw.includes("/")
    ? fileTypeRaw.split("/")[1]
    : fileTypeRaw;

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim(); //Backend base URL (set in Vite/Amplify env vars)
  // ---------------------------------------------------------
  // When the user submits, send the job info to backend
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submitting with no real upload data (avoids bad requests)
    if (!fileName || !fileType) {
      alert("No uploaded file found. Please go back and upload a file first.");
      return;
    }

    const jobData = {
      jobType: jobType,
      quantity: 1,
      material: "default",
      originalFile: fileName,
      fileType: fileType,
      additionalCustomization: "",
      additionalComments: ""
      // FIX: removed uploadedByUserId (was hardcoded + likely wrong type -> 400)
    };

    try {
      //const response = await fetch("/api/jobs/", {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        // Show backend error message (helps you debug wiring)
        const msg = await response.text();
        throw new Error(msg || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Job created:", result);

      navigate("/file-rendering");
    } catch (error) {
      console.error("Error submitting job:", error);
      alert(`Failed to submit job. ${error.message}`);
    }
  };

  // - GoBack button
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="job-submission-page">
      <div className="job-submission-card">
        <h1 className="job-submission-title">Review &amp; Submit</h1>

        <div className="job-submission-grid">
          {/* LEFT SIDE: file preview */}
          <div className="job-preview-card">
            <div className="job-preview-inner">
              <div className="job-preview-page">
                <img
                  src={BennyFront}
                  alt="Front of business card"
                  className="job-preview-image"
                />
                <p className="job-preview-page-label">Front</p>
              </div>

              <div className="job-preview-page">
                <img
                  src={BennyBack}
                  alt="Back of business card"
                  className="job-preview-image"
                />
                <p className="job-preview-page-label">Back</p>
              </div>
            </div>

            <p className="job-preview-caption">Your file</p>
          </div>

          {/* RIGHT SIDE: job type form and buttons */}
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

            <div className="job-button-row">
              <button
                type="button"
                className="secondary-button"
                onClick={handleBack}
              >
                Go Back
              </button>

              <button type="submit" className="primary-button">
                Submit Job
              </button>
            </div>
          </form>
        </div>

        <p className="job-submission-footer">
          We will eventually display some helpful message here...
        </p>
      </div>
    </div>
  );
}

export default JobSubmission;
