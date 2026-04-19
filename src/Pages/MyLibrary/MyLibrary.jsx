import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import "./MyLibrary.css";

export default function MyLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrls, setPreviewUrls] = useState({});
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

  /*
  Commenting this out since I changed the way to get the pics from the s3 bucket
  const fetchViewUrl = async (s3Key, token) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/s3/view-url?s3Key=${encodeURIComponent(s3Key)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.viewUrl;
    } catch {
      return null;
    }
  }*/

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const res = await fetch(`${API_BASE}/api/jobs/library`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFiles(data);

        const urls = {};
        await Promise.all(
          data.map(async (file) => {
            if (isImage(file.fileType) && file.s3Key) {
              const res = await fetch(
                `${API_BASE}/api/s3/file/${encodeURIComponent(file.s3Key)}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.ok) {
                const blob = await res.blob();
                urls[file.id] = URL.createObjectURL(blob);
              }
            }
          })
        );
        setPreviewUrls(urls);

      } catch (err) {
        setError("Failed to load your library.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleResubmit = (file) => {
    sessionStorage.setItem("uploadedFileName", file.originalFile);
    sessionStorage.setItem("uploadedFileType", file.fileType || "");
    sessionStorage.setItem("uploadedS3Key", file.s3Key);

    navigate("/job-submission", {
      state: {
        fileName: file.originalFile,
        fileType: file.fileType || "",
        s3Key: file.s3Key
      }
    });
  };

  const isImage = (fileType) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      fileType?.toLowerCase()
    );
  }

  return (
    <div className="library-page">
      <h1 className="library-title">My Library</h1>

      {loading && <p className="library-status">Loading your files...</p>}
      {error && <p className="library-status error">{error}</p>}
      {!loading && !error && files.length === 0 && (
        <p className="library-status">No files uploaded yet.</p>
      )}

      <div className="library-grid">
        {files.map((file) => (
          <div
            key={file.id}
            className="library-card"
            onClick={() => setSelectedFile(file)}
          >
            <div className="library-card-image">
              {previewUrls[file.id] ? (
                <img
                  src={previewUrls[file.id]}
                  alt={file.originalFile}
                  onError={(e) => { e.target.replaceWith(document.createTextNode("🖼️")); }}
                />
              ) : isImage(file.fileType) ? "🖼️" : "📄"}
            </div>

            <div className="library-card-body">
              <span className="library-card-label">
                {file.fileType?.toUpperCase() || "File"}
              </span>
              <p className="library-file-name">{file.originalFile}</p>
              <p className="library-file-meta">
                {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "2-digit", day: "2-digit"
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="library-card-footer">
              <button
                className="library-resubmit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResubmit(file);
                }}
              >
                ↗ Resubmit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFile && (
        <div
          className="library-modal-overlay"
          onClick={() => setSelectedFile(null)}
        >
          <div className="library-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="library-modal-close"
              onClick={() => setSelectedFile(null)}
            >
              ✕
            </button>

            <h2 className="library-modal-title">{selectedFile.originalFile}</h2>

            <div className="library-modal-preview">
              {previewUrls[selectedFile.id] ? (
                <img
                  src={previewUrls[selectedFile.id]}
                  alt={selectedFile.originalFile}
                />
              ) : isImage(selectedFile.fileType) ? "🖼️" : "📄"}
            </div>

            <p className="library-modal-meta">
              Uploaded:{" "}
              {selectedFile.createdAt
                ? new Date(selectedFile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "2-digit",
                  })
                : "N/A"}
            </p>

            <div className="library-modal-actions">
              <button
                className="library-cancel-btn"
                onClick={() => setSelectedFile(null)}
              >
                Cancel
              </button>
              <button
                className="library-modal-resubmit-btn"
                onClick={() => handleResubmit(selectedFile)}
              >
                Resubmit as New Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}