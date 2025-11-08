import unemployed from "./assets/unemployed.jpg";
import "./App.css";

export default function JobStatus() {
  return (
    <div className="job-status-container">
      <h1>Job Status</h1>
      <div className="job-status-image-wrapper">
        <img
          src={unemployed}
          alt="Unemployed"
          className="job-status-image"
        />
      </div>

      <h2 className="job-status-bigtext">"Ai is NOT taking our JOBS!! its OUTSOURCING!!!" ...  I scream as they drag me to the asylum. </h2>
    </div>
  );
}
