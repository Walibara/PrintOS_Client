// -----------------------------------------------------------
// JOB SUBMISSION SCREEN - By Maria 11/16
// -----------------------------------------------------------
// What’s happening right now (just for demo):
// - We’re showing a fake front/back preview of a business card.
//   In reality, this would be 2 separate files, but we will deal 
//   with that later.
// - You pick what kind of job you want (imposition, proofing, etc).
//   Nothing happens when you pick the jobs, it's for demo only.
// - When you hit submit, it's gonna take you to our fake rendering page.
//
// What will change later:
// - The preview will show the actual file the user uploaded.
// - We’ll send the job info to the backend instead of just logging it.
//
// What will stay:
// - This page will still be the review/confirmation step.
// - The layout (preview on the left, job options on the right).
// - The idea that you look everything over before handing it to the
//   digital workers.
// -----------------------------------------------------------

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobSubmission.css";
import BennyFront from "../../assets/BennyFront.png";
import BennyBack from "../../assets/BennyBack.png";

function JobSubmission() {
  const navigate = useNavigate();

// ---------------------------------------------------------
// This just remembers which job type the user picked.
// When the backend is ready, we’ll use this to tell the server
// what to do with the file.
// ---------------------------------------------------------
  const [jobType, setJobType] = useState("Imposition");

// ---------------------------------------------------------
// When the user submits, we now send the job info to backend
// instead of just logging it.
// ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      jobType: jobType,
      quantity: 1,
      material: "default",
      originalFile: "demo-file.pdf",
      fileType: "pdf",
      additionalCustomization: "",
      additionalComments: "",
      uploadedByUserId: "demo-user"
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit job");
      }

      const result = await response.json();
      console.log("Job created:", result);

      navigate("/file-rendering");
    } catch (error) {
      console.error("Error submitting job:", error);
      alert("Failed to submit job. Please try again.");
    }
  };

  // - GoBack button
  const handleBack = () => {
    navigate(-1);
  };

// ---------------------------------------------------------
// Basic page layout:
// Left side = a preview of the file (front + back)
// Right side = the job options and buttons
// ---------------------------------------------------------
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

              <button
                type="submit"
                className="primary-button"
              >
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
