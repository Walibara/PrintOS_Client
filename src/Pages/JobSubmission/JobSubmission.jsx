import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./JobSubmission.css";
import { fetchAuthSession } from "aws-amplify/auth";

function JobSubmission() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------------------------------------
  // This just remembers which job type the user picked.
  // ---------------------------------------------------------
  const [jobType, setJobType] = useState("Imposition");
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const s3Key = location.state?.s3Key || sessionStorage.getItem("uploadedS3Key") || "";
  
   // Featured image passed directly from FileUpload — no S3 fetch needed
  const isFeatured = location.state?.isFeatured || false;
  const featuredImage = location.state?.featuredImage || null;
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim(); //Backend base URL (set in Vite/Amplify env vars)

  //Lets get the actual image from the S3 Bucket
  useEffect(() => {
    if (isFeatured && featuredImage) {
      setPreviewUrl(featuredImage);
      return;
    }
    
    const fetchPreview = async () => {
      if (!s3Key) return;
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        const res = await fetch(`${API_BASE}/api/s3/file/${s3Key}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const blob = await res.blob();
          setPreviewUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("Preview fetch failed:", err);
      }
    };
    fetchPreview();
  }, [s3Key, isFeatured, featuredImage]);

  // ---------------------------------------------------------
  // When the user submits, send the job info to backend
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    try {
      const cleanBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("No authentication token found");

      let finalS3Key = s3Key;
      let finalFileName = fileName;
      let finalFileType = fileType;

      // Featured image : upload asset to S3 first
      if (isFeatured && featuredImage) {
        const imageRes = await fetch(featuredImage);
        const blob = await imageRes.blob();
        const featuredFileName = `ColorUp_Featured_${Date.now()}.png`;

        const presignRes = await fetch(
          `${cleanBase}/api/s3/presigned-url?fileName=${encodeURIComponent(featuredFileName)}&fileType=image/png`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!presignRes.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, s3Key: featuredS3Key } = await presignRes.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/png" },
          body: blob
        });
        if (!uploadRes.ok) throw new Error("Failed to upload featured image");

        finalS3Key = featuredS3Key;
        finalFileName = featuredFileName;
        finalFileType = "png";
      } else if (!fileName || !fileType) {
        alert("No uploaded file found. Please go back and upload a file first.");
        return;
      }

    const jobData = {
      jobType: jobType,
      quantity: quantity,
      material: material || "default",
      originalFile: fileName,
      fileType: fileType,
      additionalComments: additionalComments,
      s3Key: s3Key,
      isFeatured: isFeatured
      // FIX: removed uploadedByUserId (was hardcoded + likely wrong type -> 400),
    };

      const response = await fetch(`${cleanBase}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        // Show backend error message
        const msg = await response.text();
        throw new Error(msg || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Job created:", result);

      // Get Job Submission confirmation with job number from database
      const jobNumber = result.jobNumber || result.job_number || result.id || "N/A";
      setSubmissionStatus({ success: true, jobNumber });

      // Save job id so FileRendering can use it
      sessionStorage.setItem("currentJobId", jobNumber);

      // Navigate after delay so user can see the message
      setTimeout(() => {
        navigate("/file-rendering", {
          state: {
            jobId: jobNumber,
            fileName: fileName
          }
        });
      }, 3000);

    } catch (error) {
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

        {/* Featured collection banner */}
        {isFeatured && (
          <div className="featured-banner">
            ✦ Featured Collection — Color Up by HP. This is a sample file.
            To print it, please upload it as your own file.
          </div>
        )}

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
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={fileName}
                  className="job-preview-image"
                  />
              ):(
              <p className="job-preview-caption"> Loading Preview...</p>
              )}
            </div>
            <p className="job-preview-caption">{fileName}</p>
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
