import "./ActionButton.css";
const ActionButton = ({job, onViewReceipt, onRerunJob}) => {


  // caling the functions based on job the click
  const Clicks = () => {
    if (job.status === "success" ) {
      onViewReceipt(job);
    }
    else  {
      onRerunJob(job);
    }
  }

    // text to display on the button based on job status
  const buttonText = () => {

    if (job.status === "success") return 'View Receipt';
    if (job.status === "error" || job.status === "pending") return 'Rerun Job';
    return 'Action';
  };

  // css style to apply to the button based on job status
  const buttonStyle = () => {

    if (job.status === "success") return 'view-receipt-btn';
    if (job.status === "error" || job.status === "pending") return 'rerun-job-btn';
    return 'action-btn';
  };


  //returning the button component
  return (
    <button className={buttonStyle()} onClick={Clicks}>
      {buttonText()}
    </button>
  );
};


  export default ActionButton;