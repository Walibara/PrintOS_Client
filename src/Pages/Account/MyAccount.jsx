import "../App/App.css";
import "./MyAccount.css"; 
import "./MyAccountResize.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoneyCheckDollar, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

export default function MyAccount() {
  const [activeTab, setActiveTab] = useState('personal');
  const fullText = "Welcome, John Doe";
  const [displayText, setDisplayText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
	let i = 0;

	const interval = setInterval(() => {
		setDisplayText(fullText.slice(0, i));
		i++;

		if (i > fullText.length) {
			clearInterval(interval);
			setDoneTyping(true);
		}
	}, 100);

	return () => clearInterval(interval);
	}, []);

  return (
	<div className="my-account-wrapper">
		<div className="wave-bg">
			<div className="lines layer1"></div>
			<div className="lines layer2"></div>
		</div>
		<div className="my-account-container p-4">

		<div className="mb-4">
			<h1 className="fw-bold">
				{displayText}
				{!doneTyping && <span className="cursor">|</span>}
			</h1>
		</div>

		<ul className="nav nav-pills mb-4">
			<li className="nav-item">
			<button
				className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
				onClick={() => setActiveTab('personal')}
			>
				<FontAwesomeIcon icon={faUser} className="me-2" />
				Personal Information
			</button>
			</li>
			<li className="nav-item">
			<button
				className={`nav-link ${activeTab === 'billing' ? 'active' : ''}`}
				onClick={() => setActiveTab('billing')}
			>
				<FontAwesomeIcon icon={faMoneyCheckDollar} className="me-2" />
				Billing Transactions
			</button>
			</li>
			<li className="nav-item">
			<button
				className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
				onClick={() => setActiveTab('settings')}
			>
				<FontAwesomeIcon icon={faGear} className="me-2" />
				Settings
			</button>
			</li>
		</ul>

		<div className="card shadow-sm account-card">
			<div className="card-body p-4">

			{activeTab === 'personal' && (
				<div>
				<h4 className="card-title mb-4">
					<FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
					Personal Information
				</h4>
				<div className="row g-3">
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Account Name</small>
						<strong>John Doe</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Account Created</small>
						<strong>11/11/2025</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Account Type</small>
						<strong>Personal</strong>
					</div>
					</div>
				</div>
				</div>
			)}

			{activeTab === 'billing' && (
				<div>
				<h4 className="card-title mb-4">
					<FontAwesomeIcon icon={faMoneyCheckDollar} className="me-2 text-primary" />
					Billing Transactions
				</h4>
				<div className="row g-3">
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Total Transactions</small>
						<strong>2</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Most Recent Transaction</small>
						<strong>#10123234</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Payment Type</small>
						<strong>Credit Card</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Date</small>
						<strong>10/25/2025</strong>
					</div>
					</div>
					<div className="col-md-6">
					<div className="p-3 bg-light rounded">
						<small className="text-muted d-block">Amount</small>
						<strong className="text-success">$150.00</strong>
					</div>
					</div>
				</div>
				</div>
			)}

			{activeTab === 'settings' && (
				<div>
				<h4 className="card-title mb-4">
					<FontAwesomeIcon icon={faGear} className="me-2 text-primary" />
					Settings
				</h4>
				<div className="list-group">
					<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					Change Username
					<span className="text-muted">›</span>
					</button>
					<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					Change Password
					<span className="text-muted">›</span>
					</button>
					<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					Multifactor Authentication Set-Up
					<span className="text-muted">›</span>
					</button>
					<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					Privacy Settings
					<span className="text-muted">›</span>
					</button>
				</div>
				</div>
			)}

			</div>
		</div>
		</div>
	</div>
  );
}