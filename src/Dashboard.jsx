import NotMe from "./assets/hiding-into-bush.gif";
import "./App.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Sorry in advance for whoever has to set up this page...</p>

      <div className="dashboard-image-wrapper">
        <img src={NotMe} alt="NotMe" className="dashboard-image" />
      </div>

      {/* Big black text under image */}
      <h2 className="dashboard-bigtext">Just kidding... Maybe</h2>
    </div>
  );
}
