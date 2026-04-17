import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import "./MyLibrary.css";

export default function MyLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");

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

  return (
    <div className="library-page">
      <h1 className="library-title">My Library</h1>
      <p className="library-subtitle">All files you have uploaded. Resubmit any file as a new job.</p>

      {loading && <p className="library-status">Loading your files...</p>}
      {error && <p className="library-status error">{error}</p>}
      {!loading && !error && files.length === 0 && (
        <p className="library-status">No files uploaded yet.</p>
      )}

      <div className="library-grid">
        {files.map((file) => (
          <div key={file.id} className="library-card">
            <div className="library-card-icon">📄</div>
            <div className="library-card-info">
              <p className="library-file-name">{file.originalFile}</p>
              <p className="library-file-meta">
                {file.fileType?.toUpperCase()} · {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "2-digit", day: "2-digit"
                    })
                  : "N/A"}
              </p>
            </div>
            <button
              className="library-resubmit-btn"
              onClick={() => handleResubmit(file)}
            >
              Resubmit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}