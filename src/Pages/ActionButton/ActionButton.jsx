import "./ActionButton.css";
const ActionButton = ({job, onViewReceipt, onRerunJob}) => {
  const rawStatus = job.dbStatus || job.status;


  // caling the functions based on job the click
  const Clicks = () => {
    if (rawStatus === "FINISHED" ) {
      onViewReceipt(job);
    }
    else if(rawStatus === "FAILED" ){
      onRerunJob(job);
    }
  };
 

    // text to display on the button based on job status
  const buttonText = () => {

    if (rawStatus === "FINISHED") return 'View Receipt';
    if (rawStatus === "FAILED" ) return 'Rerun Job';
    return null;
  };

  // css style to apply to the button based on job status
  const buttonStyle = () => {

    if (rawStatus === "FINISHED") return 'view-receipt-btn';
    if (rawStatus === "FAILED" ) return 'rerun-job-btn';
    return 'action-btn';
  };

  if (rawStatus !== "FINISHED" && rawStatus !== "FAILED") {
    return null;
  }


  //returning the button component
  return (
    <button type="button" className={buttonStyle()} onClick={Clicks}>
      {buttonText()}
    </button>
  );
};


  export default ActionButton;