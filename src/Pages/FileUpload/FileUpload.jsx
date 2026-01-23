// -----------------------------------------------------------
// FILE UPLOAD SCREEN - Maria 11/16
// -----------------------------------------------------------
// This is the first stop in the whole workflow.
// The user can either upload a brand-new file or pick something
// they’ve used before. Nothing happens if you "upload" a new file.
//
// What’s demo-only right now:
// - The list of “previous uploads” is totally hardcoded.
// - Nothing actually gets sent to the backend yet.
//
// What will stay once the backend is real:
// - The overall layout and styling
// - The two options (New Upload vs Previously Uploaded)
// - Moving on to /job-submission after a file is chosen
// -----------------------------------------------------------


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

import codingHumor1 from "../../assets/coding_humor1.jpg";
import codingHumor2 from "../../assets/coding_humor2.png";
import codingHumor3 from "../../assets/coding_humor3.jpg";
import codingHumor4 from "../../assets/coding_humor4.jpg";
import PickMeChooseMe from "../../assets/BennyFront.png";

// -----------------------------------------------------------
// DEMO-ONLY DATA: - Maria 11/16
// This list of “previous files” is just hardcoded for now.
// Later on, this will come from the database.
// -----------------------------------------------------------
const previouslyUploadedFiles = [
  { id: "humor1", name: "Coding Humor 1", thumbnail: codingHumor1 },
  { id: "humor2", name: "Coding Humor 2", thumbnail: codingHumor2 },
  { id: "humor3", name: "Coding Humor 3", thumbnail: codingHumor3 },
  { id: "humor4", name: "Coding Humor 4", thumbnail: codingHumor4 },
  { id: "humor5", name: "Pick me, Choose Me", thumbnail: PickMeChooseMe },
];

function FileUpload() {
  const navigate = useNavigate();

// ---------------------------------------------------------
// Info about a new upload: - Maria 11/16
// - selectedFile holds the actual file
// - selectedFilePreview shows a quick image preview
//
// These will still be useful once the backend is connected.
// ---------------------------------------------------------
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);

// ---------------------------------------------------------
// For the “previously uploaded” option: - Maria 11/16
// - selectedPreviousId is whatever they pick in the dropdown
// - selectedPreviousFile is the object we pull from our demo list
//
// Later this will tie into real files from the backend.
// ---------------------------------------------------------

  const [selectedPreviousId, setSelectedPreviousId] = useState("");
  const selectedPreviousFile = previouslyUploadedFiles.find(
    (f) => f.id === selectedPreviousId
  );

// ---------------------------------------------------------
// Maria 11/16
// When a user picks a file from their device, we land here.
// We save the file and show a quick preview if we can.
//
// In the real version, this should also talk to the server.
// ---------------------------------------------------------
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSelectedFilePreview(url);
    } else {
      setSelectedFilePreview(null);
    }
  };

// ---------------------------------------------------------
// Maria 11/16
// When someone selects an older file, we store the id and
// show the matching demo thumbnail.
//
// Later on, this will fetch the real file details from the server.
// ---------------------------------------------------------
  const handlePreviousChange = (e) => {
    setSelectedPreviousId(e.target.value);
  };

// ---------------------------------------------------------
// Maria 11/16
// User picked a new file and wants to keep going.
// For now, we just check that the file is there and move
// to /job-submission.
//
// Later this will send actual file details to the next step.
// ---------------------------------------------------------
  const handleContinueWithNew = () => {
    if (!selectedFile) return;
    navigate("/job-submission");
  };

// ---------------------------------------------------------
// Maria 11/16
// When someone selects a past file, this is where we handle it.
// For the demo, we just confirm something is selected and keep going.
//
// In the real version, we should pass the actual file ID along.
// ---------------------------------------------------------

  const handleContinueWithPrevious = () => {
    if (!selectedPreviousFile) return;
    navigate("/job-submission");
  };

// ---------------------------------------------------------
// Maria 11/16
// Left side = upload a brand-new file
// Right side = pick something from the “previous files” list
// Footer = we should probably put something useful here
// ---------------------------------------------------------
  return (
    <div className="file-upload-page">
      <div className="file-upload-card">
        <h1 className="file-upload-title">Upload Your File</h1>
        <p className="file-upload-subtitle">
          Choose a new file from your device or reuse something you uploaded earlier.
        </p>

        <div className="file-upload-grid">
          {/* LEFT SIDE: New Upload */}
          <section className="file-upload-section">
            <h2>New Upload</h2>
            <p className="section-description">
              Upload a print-ready file directly from your computer.
            </p>

            <label className="upload-dropzone">
              <input
                type="file"
                className="hidden-file-input"
                onChange={handleNewFileChange}
              />
              <p className="dropzone-title">Click to browse</p>
              <p className="dropzone-subtitle">or drag and drop a file here</p>
            </label>

            {selectedFile && (
              <div className="file-info">
                <div className="file-info-text">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-meta">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            {selectedFilePreview && (
              <div className="file-preview">
                <img src={selectedFilePreview} alt="New upload preview" />
              </div>
            )}

            <button
              className="primary-button"
              disabled={!selectedFile}
              onClick={handleContinueWithNew}
            >
              Continue with New File
            </button>
          </section>

          {/* RIGHT SIDE: Previously Uploaded (demo) */}
          <section className="file-upload-section">
            <h2>Previously Uploaded</h2>
            <p className="section-description">
              Reuse a file you have already uploaded.
            </p>

            <select
              className="file-select"
              value={selectedPreviousId}
              onChange={handlePreviousChange}
            >
              <option value="">Select a file…</option>
              {previouslyUploadedFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name}
                </option>
              ))}
            </select>

            {selectedPreviousFile && (
              <div className="file-preview">
                <img
                  src={selectedPreviousFile.thumbnail}
                  alt={selectedPreviousFile.name}
                />
              </div>
            )}

            <button
              className="secondary-button"
              disabled={!selectedPreviousFile}
              onClick={handleContinueWithPrevious}
            >
              Continue with Selected File
            </button>
          </section>
        </div>

        <p className="file-upload-footer">
          Need help? Don&apos;t contact us yet... we&apos;re still figuring it out too.
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
