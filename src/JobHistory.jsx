import wrongDB from "./assets/wrong_db.jpeg";
import "./App.css";

export default function JobHistory() {
  return (
    <div className="job-history-container">
      <h1>Job History</h1>
      <div className="job-history-image-wrapper">
        <img
          src={wrongDB}
          alt="Wrong database"
          className="job-history-image"
        />
      </div>

      <h2 className="job-history-bigtext">As Britney would say... Oops!</h2>
    </div>
  );
}
