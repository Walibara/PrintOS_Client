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
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("");  
  const [additionalCustomization, setAdditionalCustomization] = useState("");  
  const [additionalComments, setAdditionalComments] = useState("");  
  const [submissionStatus, setSubmissionStatus] = useState(null);
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

    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    const jobData = {
      jobType: jobType,
      quantity: quantity,
      material: material || "default",
      originalFile: fileName,
      fileType: fileType,
      additionalCustomization: additionalCustomization,
      additionalComments: additionalComments
      // FIX: removed uploadedByUserId (was hardcoded + likely wrong type -> 400)
    };

    try {
      //const response = await fetch("/api/jobs/", {
      //const response = await fetch(`${API_BASE}/api/jobs`, {
      //  method: "POST",
       // headers: {
        //  "Content-Type": "application/json"
     //   },
   //     body: JSON.stringify(jobData)
    //  });
      // 
      // See if this can help with CORS
      const cleanBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
      
      const response = await fetch(`${cleanBase}/api/jobs`, { 
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

    //commenting this out for now till we get the workers 
    //  navigate("/file-rendering");
    
    //Get Job Submission confirmation with job number from database
    const jobNumber = result.id || result.jobNumber || result.job_id || "N/A";
      setSubmissionStatus({ success: true, jobNumber });

      // Navigate after delay so user can see the message
      //Removing this until we set up the workers 
      /*
      setTimeout(() => {
        navigate("/file-rendering");
      }, 3000); */

    } catch (error) {
     // console.error("Error submitting job:", error);
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
        
        {/*Success message display*/}
        {submissionStatus?.success && (
          <div className="success-message">
            <h2>✓ Job #{submissionStatus.jobNumber} has been created!</h2>
            <p>Please wait a moment while we review your file...</p>
          </div>
        )}

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

            {/* Quantity */}
            <label className="job-form-label">
              Quantity <span className="required">*</span>
              <input
                type="number"
                className="job-form-input"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </label>

            {/* Material */}
            <label className="job-form-label">
              Material
              <select
                className="job-type-select"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="">Select material (optional)</option>
                <option value="Standard Paper">Standard Paper</option>
                <option value="Cardstock">Cardstock</option>
                <option value="Glossy">Glossy</option>
                <option value="Matte">Matte</option>
                <option value="Premium">Premium</option>
                <option value="Other">Other</option>
              </select>
            </label>

            {/* Additional Customization */}
            <label className="job-form-label">
              Additional Customization
              <input
                type="text"
                className="job-form-input"
                value={additionalCustomization}
                onChange={(e) => setAdditionalCustomization(e.target.value)}
                placeholder="e.g., trim size, bleed specifications"
                maxLength="255"
              />
            </label>

            {/* Additional Comments */}
            <label className="job-form-label">
              Additional Comments
              <textarea
                className="job-form-textarea"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Any special instructions or notes..."
                rows="4"
                maxLength="255"
              />
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
