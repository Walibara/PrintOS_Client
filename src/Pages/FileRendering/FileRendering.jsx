import React, { useEffect, useMemo, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./FileRendering.css";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

function FileRendering() {
  const navigate = useNavigate();
  const location = useLocation();

  const [job, setJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState("LOADING");
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [jobNotFound, setJobNotFound] = useState(false);

  const progressTimerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || "";
  const cleanBase = useMemo(() => {
    if (!API_BASE) return "";
    return API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  }, [API_BASE]);

  const targetJobId =
    location.state?.jobId || sessionStorage.getItem("currentJobId") || null;

  const uploadedFileName =
    location.state?.fileName || sessionStorage.getItem("uploadedFileName") || "";

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${cleanBase}/api/jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs (${response.status})`);
        }

        const jobs = await response.json();
        let foundJob = null;

        if (targetJobId) {
          foundJob = jobs.find((j) => String(j.id) === String(targetJobId));
        }

        if (!foundJob && uploadedFileName) {
          const matchingJobs = jobs.filter(
            (j) => j.originalFile === uploadedFileName
          );

          if (matchingJobs.length > 0) {
            matchingJobs.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
            foundJob = matchingJobs[0];
          }
        }

        if (!isMounted) return;

        if (!foundJob) {
          setJob(null);
          setJobNotFound(true);
          setBackendStatus("NOT_FOUND");
          return;
        }

        setJob(foundJob);
        setJobNotFound(false);
        setBackendStatus(foundJob.status || "LOADING");

        if (foundJob.id) {
          sessionStorage.setItem("currentJobId", foundJob.id);
        }
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message || "Unable to load job status.");
        setBackendStatus("ERROR_LOADING");
      }
    };

    fetchJob();
    const poller = setInterval(fetchJob, 2000);

    return () => {
      isMounted = false;
      clearInterval(poller);
    };
  }, [cleanBase, targetJobId, uploadedFileName]);

  useEffect(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (backendStatus === "CREATED") {
      setStep(0);
      return;
    }

    if (backendStatus === "IN_PROGRESS") {
      progressTimerRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev < 3) return prev + 1;
          return 3;
        });
      }, 1000);
      return;
    }

    if (backendStatus === "FINISHED") {
      setStep(4);
      return;
    }

    if (backendStatus === "FAILED" || backendStatus === "ERROR") {
      setStep(4);
      return;
    }
  }, [backendStatus]);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const isFailure =
    backendStatus === "FAILED" || backendStatus === "ERROR";

  const isFinished =
    backendStatus === "FINISHED";

  const isProcessing =
    backendStatus === "CREATED" || backendStatus === "IN_PROGRESS";

  return (
    <div className="file-rendering-page">
      <div className="file-rendering-card">
        <h1 className="file-rendering-title">Preparing Your File</h1>
        <p className="file-rendering-subtitle">
          We’re running your job through our automated checks before sending it to print.
        </p>

        {job?.id && (
          <p className="file-rendering-summary-note">
            Tracking Job #{job.id}
          </p>
        )}

        {backendStatus === "ERROR_LOADING" && (
          <div className="file-rendering-summary file-rendering-summary-error">
            <h2 className="file-rendering-summary-title">
              Unable to load job status
            </h2>
            <p className="file-rendering-summary-text">
              {errorMessage || "Something went wrong while contacting the backend."}
            </p>

            <div className="rendering-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {jobNotFound && (
          <div className="file-rendering-summary file-rendering-summary-error">
            <h2 className="file-rendering-summary-title">
              Job not found
            </h2>
            <p className="file-rendering-summary-text">
              We could not find the submitted job in the backend yet.
            </p>

            <div className="rendering-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {!jobNotFound && backendStatus !== "ERROR_LOADING" && isProcessing && (
          <>
            <div className="file-rendering-steps">

              <div className="render-step">
                <div className="render-step-icon render-step-icon-spinner">
                  <ClipLoader size={18} color="#1a73e8" />
                </div>
                <div className="render-step-text">
                  <h2 className="render-step-title">File Validation</h2>
                  <p className="render-step-description">
                    The Validation Worker is checking your file before production.
                  </p>
                </div>
              </div>

              <div className="render-step">
                <div className="render-step-icon render-step-icon-spinner">
                  <ClipLoader size={18} color="#1a73e8" />
                </div>
                <div className="render-step-text">
                  <h2 className="render-step-title">Imposition Layout</h2>
                  <p className="render-step-description">
                    The system is preparing the page layout for print.
                  </p>
                </div>
              </div>

              <div className="render-step">
                <div className="render-step-icon render-step-icon-spinner">
                  <ClipLoader size={18} color="#1a73e8" />
                </div>
                <div className="render-step-text">
                  <h2 className="render-step-title">File Optimization</h2>
                  <p className="render-step-description">
                    The system is finalizing your file settings for production.
                  </p>
                </div>
              </div>

            </div>

            <div className="file-rendering-summary">
              <h2 className="file-rendering-summary-title">
                Your file is being processed
              </h2>
              <p className="file-rendering-summary-text">
                Please wait while we review your submission and update its status.
              </p>
              <p className="file-rendering-summary-note">
                Current backend status: {backendStatus}
              </p>

              <div className="rendering-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate("/my-jobs/history")}
                >
                  View Job Status
                </button>
              </div>
            </div>
          </>
        )}

        {!jobNotFound && backendStatus !== "ERROR_LOADING" && isFinished && (
          <div className="file-rendering-summary">
            <h2 className="file-rendering-summary-title">
              ✅ Your file has been received and accepted
            </h2>
            <p className="file-rendering-summary-text">
              Your job is now in our production queue. You’ll receive an email with
              print and shipping details soon.
            </p>
            <p className="file-rendering-summary-note">
              Digital workers handle this entire workflow automatically.
            </p>

            <div className="rendering-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/job-status")}
              >
                View Job Status
              </button>
            </div>
          </div>
        )}

        {!jobNotFound && backendStatus !== "ERROR_LOADING" && isFailure && (
          <>
            <div className="file-rendering-steps">
              <div className="render-step render-step-error">
                <div className="render-step-icon render-step-icon-error">!</div>
                <div className="render-step-text">
                  <h2 className="render-step-title">File Validation</h2>
                  <p className="render-step-description">
                    The system found an issue while processing your file.
                  </p>
                </div>
              </div>

              <div className="render-step render-step-muted">
                <div className="render-step-icon render-step-icon-muted">–</div>
                <div className="render-step-text">
                  <h2 className="render-step-title">Imposition Layout</h2>
                  <p className="render-step-description">
                    Skipped because the job did not complete successfully.
                  </p>
                </div>
              </div>

              <div className="render-step render-step-muted">
                <div className="render-step-icon render-step-icon-muted">–</div>
                <div className="render-step-text">
                  <h2 className="render-step-title">File Optimization</h2>
                  <p className="render-step-description">
                    Skipped because the job did not complete successfully.
                  </p>
                </div>
              </div>
            </div>

            <div className="file-rendering-summary file-rendering-summary-error">
              <h2 className="file-rendering-summary-title">
                Your file could not be accepted
              </h2>

              <p className="file-rendering-summary-text">
                Please correct the issues and upload a new version.
              </p>

              <p className="file-rendering-summary-note">
                Current backend status: {backendStatus}
              </p>

              <div className="rendering-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate(-1)}
                >
                  Review File
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate("/file-upload")}
                >
                  Upload New File
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FileRendering;