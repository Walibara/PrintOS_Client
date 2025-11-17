// -----------------------------------------------------------
// FILE RENDERING SCREEN (DEMO VERSION) - By Maria 11/16
// -----------------------------------------------------------
// This page is basically a fake version of what the backend
// will eventually do. We pretend to run preflight, imposition,
// and optimization by using timers to make it look real.
//
// What’s getting removed later:
// - All the fake setTimeout() stuff
// - The auto-switch from “success” to “failure”
//
// What’s staying for the real build:
// - The layout and styling
// - The step-by-step progress look
// - The success + error messages
// -----------------------------------------------------------


import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "./FileRendering.css";
import { useNavigate } from "react-router-dom";

function FileRendering() {
  const navigate = useNavigate();

// ---------------------------------------------------------
// Maria 11/16
// These two values help us run the demo:
// scenario = success mode or failure mode
// step = which step we're showing at the moment
//
// Later, the backend will tell us this stuff for real.
// ---------------------------------------------------------
  const [scenario, setScenario] = useState("success");
  const [step, setStep] = useState(0);

// ---------------------------------------------------------
// Maria 11/16
// Demo version of the “everything goes right” path.
// We use fake timers to pretend the file is being checked,
// imposed, and optimized.
// ---------------------------------------------------------
  useEffect(() => {
    if (scenario !== "success") return;

    setStep(0);
    const timers = [];

    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2000));
    timers.push(setTimeout(() => setStep(3), 3000));
    timers.push(setTimeout(() => setStep(4), 3500));

    return () => timers.forEach(clearTimeout);
  }, [scenario]);

// ---------------------------------------------------------
// Maria 11/16
// Demo
// After the success run finishes, we give it 5 seconds and then
// show the failure version so we can preview both.
// ---------------------------------------------------------
  useEffect(() => {
    if (scenario !== "success" || step !== 4) return;

    const timer = setTimeout(() => {
      setScenario("failure");
    }, 5000);

    return () => clearTimeout(timer);
  }, [scenario, step]);

// ---------------------------------------------------------
// Maria 11/16
// This is the fake “something went wrong” path.
// Spinner first, then an error, and the rest of the steps are skipped.
// ---------------------------------------------------------

  useEffect(() => {
    if (scenario !== "failure") return;

    setStep(0);
    const timers = [];

    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(4), 2000));

    return () => timers.forEach(clearTimeout);
  }, [scenario]);

  return (
    <div className="file-rendering-page">
      <div className="file-rendering-card">

        {/* Title + intro */}
        <h1 className="file-rendering-title">Preparing Your File</h1>
        <p className="file-rendering-subtitle">
          We’re running your job through our automated checks before sending it to print.
        </p>

        {/* -----------------------------------------------------
             SUCCESS SCENARIO DISPLAY
           ----------------------------------------------------- */}
        {scenario === "success" && (
          <>
            <div className="file-rendering-steps">

              {/* Step 1 - File Validation */}
              <div className={`render-step ${step >= 1 ? "render-step-done" : ""}`}>
                <div
                  className={`render-step-icon ${
                    step >= 1 ? "render-step-icon-done" : "render-step-icon-spinner"
                  }`}
                >
                  {step >= 1 ? "✓" : <ClipLoader size={18} color="#1a73e8" />}
                </div>

                <div className="render-step-text">
                  <h2 className="render-step-title">File Validation</h2>
                  <p className="render-step-description">
                    The Validation Worker checked your file and everything looks good.
                  </p>
                </div>
              </div>

              {/* Step 2 - Imposition */}
              <div className={`render-step ${step >= 2 ? "render-step-done" : ""}`}>
                <div
                  className={`render-step-icon ${
                    step >= 2 ? "render-step-icon-done" : "render-step-icon-spinner"
                  }`}
                >
                  {step >= 2 ? "✓" : <ClipLoader size={18} color="#1a73e8" />}
                </div>

                <div className="render-step-text">
                  <h2 className="render-step-title">Imposition Layout</h2>
                  <p className="render-step-description">
                    Imposition Worker arranged the pages for the press.
                  </p>
                </div>
              </div>

              {/* Step 3 - Optimization */}
              <div className={`render-step ${step >= 3 ? "render-step-done" : ""}`}>
                <div
                  className={`render-step-icon ${
                    step >= 3 ? "render-step-icon-done" : "render-step-icon-spinner"
                  }`}
                >
                  {step >= 3 ? "✓" : <ClipLoader size={18} color="#1a73e8" />}
                </div>

                <div className="render-step-text">
                  <h2 className="render-step-title">File Optimization</h2>
                  <p className="render-step-description">
                    Optimization Worker refined your file settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Final success message */}
            {step === 4 && (
              <div className="file-rendering-summary">
                <h2 className="file-rendering-summary-title">
                  Your file has been received and accepted
                </h2>
                <p className="file-rendering-summary-text">
                  Your job is now in our production queue. You’ll receive an email with
                  print and shipping details soon.
                </p>
                <p className="file-rendering-summary-note">
                  Digital workers handle this entire workflow automatically.
                </p>
              </div>
            )}
          </>
        )}

        {/* -----------------------------------------------------
             FAILURE SCENARIO DISPLAY
           ----------------------------------------------------- */}
        {scenario === "failure" && (
          <>
            <div className="file-rendering-steps">

              {/* Step 1 - Validation fails */}
              <div className={`render-step ${step >= 1 ? "render-step-error" : ""}`}>
                <div
                  className={`render-step-icon ${
                    step >= 1 ? "render-step-icon-error" : "render-step-icon-spinner"
                  }`}
                >
                  {step >= 1 ? "!" : <ClipLoader size={18} color="#1a73e8" />}
                </div>

                <div className="render-step-text">
                  <h2 className="render-step-title">File Validation</h2>
                  <p className="render-step-description">
                    Validation Worker found issues (resolution, bleed, missing fonts).
                  </p>
                </div>
              </div>

              {/* Steps 2 + 3 skipped */}
              <div className="render-step render-step-muted">
                <div className="render-step-icon render-step-icon-muted">–</div>
                <div className="render-step-text">
                  <h2 className="render-step-title">Imposition Layout</h2>
                  <p className="render-step-description">Skipped due to validation failure.</p>
                </div>
              </div>

              <div className="render-step render-step-muted">
                <div className="render-step-icon render-step-icon-muted">–</div>
                <div className="render-step-text">
                  <h2 className="render-step-title">File Optimization</h2>
                  <p className="render-step-description">Skipped due to validation failure.</p>
                </div>
              </div>
            </div>

            {/* Final error summary */}
            {step === 4 && (
              <div className="file-rendering-summary file-rendering-summary-error">
                <h2 className="file-rendering-summary-title">
                  Your file could not be accepted
                </h2>

                <p className="file-rendering-summary-text">
                  Please correct the issues and upload a new version.
                </p>

                <p className="file-rendering-summary-note">
                  These issues prevent the file from going to press.
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
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FileRendering;
