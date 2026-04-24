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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import "./FileUpload.css";


/*import codingHumor1 from "../../assets/coding_humor1.jpg";
import codingHumor2 from "../../assets/coding_humor2.png";
import codingHumor3 from "../../assets/coding_humor3.jpg";
import codingHumor4 from "../../assets/coding_humor4.jpg";
import PickMeChooseMe from "../../assets/BennyFront.png";*/

// -----------------------------------------------------------
// DEMO-ONLY DATA: - Maria 11/16
// This list of “previous files” is just hardcoded for now.
// Later on, this will come from the database.
// -----------------------------------------------------------
/*const previouslyUploadedFiles = [
  { id: "humor1", name: "Coding Humor 1", thumbnail: codingHumor1 },
  { id: "humor2", name: "Coding Humor 2", thumbnail: codingHumor2 },
  { id: "humor3", name: "Coding Humor 3", thumbnail: codingHumor3 },
  { id: "humor4", name: "Coding Humor 4", thumbnail: codingHumor4 },
  { id: "humor5", name: "Pick me, Choose Me", thumbnail: PickMeChooseMe },
];*/

import col1 from "../../assets/printOS.svg";
import col2 from "../../assets/tiles.svg";
import col3 from "../../assets/Untitled-5.svg";


const featuredCollection = [
  { id: 1, image: col1, title: "Color Up 001" },
  { id: 2, image: col2, title: "Color Up 002" },
  { id: 3, image: col3, title: "Color Up 003" },
 
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
  const [uploading, setUploading] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [selectedFeatured, setSelectedFeatured] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");


  const isPreviewable = (fileType) =>
  ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileType?.toLowerCase());

// Fetch 3 most recent uploads for the bottom section
useEffect(() => {
  const fetchRecent = async () => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const res = await fetch(`${API_BASE}/api/jobs/library`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      const recent = data.slice(0, 3);
      setRecentFiles(recent);
      const urls = {};
      await Promise.all(
        recent.map(async (file) => {
          if (isPreviewable(file.fileType) && file.s3Key) {
            const r = await fetch(`${API_BASE}/api/s3/file/${file.s3Key}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (r.ok) {
              const blob = await r.blob();
              urls[file.id] = URL.createObjectURL(blob);
            }
          }
        })
      );
      setPreviewUrls(urls);
    } catch (err) {
      console.error("Could not load recent files", err);
    }
  };
  fetchRecent();
}, []);
  // ---------------------------------------------------------
  // For the “previously uploaded” option: - Maria 11/16
  // - selectedPreviousId is whatever they pick in the dropdown
  // - selectedPreviousFile is the object we pull from our demo list
  //
  // Later this will tie into real files from the backend.
  // ---------------------------------------------------------
  /*const [selectedPreviousId, setSelectedPreviousId] = useState("");
  const selectedPreviousFile = previouslyUploadedFiles.find(
    (f) => f.id === selectedPreviousId
  );*/

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
  /*const handlePreviousChange = (e) => {
    setSelectedPreviousId(e.target.value);
  };*/

  // ---------------------------------------------------------
  // Malek 
  // User picked a new file and wants to keep going.
  // For now, we pass file info to /job-submission so it can POST correctly.
  // ---------------------------------------------------------
  // Changes so we can use s3Bucket - Maria 4/16
  const handleContinueWithNew = async () => {
    if (!selectedFile) return;

  try {
      setUploading(true);

      const cleanBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

      // Step 1: Get pre-signed URL from server
      const presignRes = await fetch(
        `${cleanBase}/api/s3/presigned-url?fileName=${encodeURIComponent(selectedFile.name)}&fileType=${encodeURIComponent(selectedFile.type)}`
      );
      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, s3Key } = await presignRes.json();

      // Step 2: Upload file directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to S3");

      // Step 3: Navigate with s3Key
      const nextState = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        s3Key: s3Key
      };

      sessionStorage.setItem("uploadedFileName", nextState.fileName);
      sessionStorage.setItem("uploadedFileType", nextState.fileType);
      sessionStorage.setItem("uploadedS3Key", s3Key);

      navigate("/job-submission", { state: nextState });

    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = (file) => {
  sessionStorage.setItem("uploadedFileName", file.originalFile);
  sessionStorage.setItem("uploadedFileType", file.fileType || "");
  sessionStorage.setItem("uploadedS3Key", file.s3Key);
  navigate("/job-submission", {
    state: { fileName: file.originalFile, fileType: file.fileType || "", s3Key: file.s3Key }
  });
};
   
  // ---------------------------------------------------------
  // Malek
  // When someone selects a past file, this is where we handle it.
  // For the demo, we pass the selected file name + derived type.
  // ---------------------------------------------------------
  /*const handleContinueWithPrevious = () => {
    if (!selectedPreviousFile) return;

    // Demo previous files only include a name + thumbnail, so derive a type from the thumbnail.
    const thumbUrl = String(selectedPreviousFile.thumbnail || "");
    const extMatch = thumbUrl.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
    const derivedType = extMatch ? extMatch[1].toLowerCase() : "";

    const nextState = {
      fileName: selectedPreviousFile.name,
      fileType: derivedType
    };

    sessionStorage.setItem("uploadedFileName", nextState.fileName);
    sessionStorage.setItem("uploadedFileType", nextState.fileType);

    navigate("/job-submission", { state: nextState });
  };*/

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
          Choose a new file from your device or reuse something from your library.
        </p>

        {/* Why PrintOS */}
        <p className="why-printos-text">
          PrintOS automates your print workflow from submission to completion,
          ensuring color accuracy, eliminating manual handoffs, and giving you
          real-time visibility into every job. Upload your file and let the magic happen.
        </p>

        {/* Upload grid */}
        <div className="file-upload-grid">
          {/* LEFT: New Upload */}
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
              disabled={!selectedFile || uploading}
              onClick={handleContinueWithNew}
            >
              {uploading ? "Uploading..." : "Continue with New File"}
            </button>
          </section>

          {/* RIGHT: Previously Uploaded */}
          <section className="file-upload-section">
            <h2>Previously Uploaded</h2>
            <p className="section-description">
              Pick a file from your library.
            </p>
            <button
              className="secondary-button"
              onClick={() => navigate("/my-library")}
            >
              Go to My Library →
            </button>
          </section>
        </div>

        {/* Featured Collection */}
        <div className="upload-bottom-section">
          <div className="recent-header">
            <div>
              <h2 className="upload-section-heading">Color Me Collection by Emma S.</h2>
              <p className="featured-subtitle">
                Sample CMYK poster set enhanced with Color Up extended gamut.
                Best printed on the HP Indigo 12000 or HP Indigo 15K Presses.
              </p>
            </div>
          </div>
          <div className="featured-how-to">
            <span>✦ How to try it:</span> Browse the collection below, click any image to preview it, then hit <strong>Print This</strong> to submit it as a new job.
          </div>
          <div className="recent-grid">
            {featuredCollection.map((item) => (
              <div key={item.id} className="recent-card" onClick={() => setSelectedFeatured(item)}>
                <div className="recent-card-image">
                  <img src={item.image} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured image modal */}
      {selectedFeatured && (
        <div className="library-modal-overlay" onClick={() => setSelectedFeatured(null)}>
          <div className="library-modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <button
              className="library-modal-close"
              onClick={() => setSelectedFeatured(null)}
            >
              ✕
            </button>
            <h2 className="library-modal-title">Featured Collection — Color Up by HP</h2>
            <div className="library-modal-preview">
              <img
                src={selectedFeatured.image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <p style={{ fontSize: "0.8rem", color: "#888", margin: "0.5rem 0 1rem" }}>
              Sample CMYK poster enhanced with Color Up extended gamut.
              Best printed on the HP Indigo 12000 or HP Indigo 15K Presses.
            </p>
            <div className="library-modal-actions" style={{ justifyContent: "center" }}>
              <button
                className="library-cancel-btn"
                onClick={() => setSelectedFeatured(null)}
              >
                Close
              </button>
              <button
                className="library-modal-resubmit-btn"
                onClick={() => {
                  setSelectedFeatured(null);
                  navigate("/job-submission", {
                    state: {
                      fileName: `ColorUp_Featured_${selectedFeatured.id}.png`,
                      fileType: "png",
                      s3Key: null,
                      isFeatured: true,
                      featuredImage: selectedFeatured.image
                    }
                  });
                }}
              >
                🖨 Print This
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;