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
    
   
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Success</h3>
          <hr />
          <h1>36</h1>
          <p>^ 12% from yesterday</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <hr />
          <h1>33</h1>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>Failures</h3>
          <hr />
          <h1>3</h1>
          <p>Failures</p>
        </div>
      </div>

      


      
    
    
    </div>



  );
}
