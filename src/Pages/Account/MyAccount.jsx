import "../App/App.css";
import "./MyAccount.css"; 
import "./MyAccountResize.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoneyCheckDollar, faGear } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect} from "react";
import { getCurrentUser, fetchUserAttributes, updateUserAttributes, updatePassword, deleteUser } from 'aws-amplify/auth';

export default function MyAccount() {
	const [activeTab, setActiveTab] = useState('personal');
	const [displayText, setDisplayText] = useState("");

	const [doneTyping, setDoneTyping] = useState(false);
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [name, setName] = useState("John Doe");
	const [showUsernameModal, setShowUsernameModal] = useState(false);
	const [showPasswordModal, setPasswordModal] = useState(false); 
	const [showDeleteModal, setShowDeleteModal] = useState(false); 
	const [showMultiModal, setMultiModal] = useState(false); 
	const [showPrivacyModal, setPrivacyModal] = useState(false); 
	const [newUsername, setNewUsername] = useState("");
	const [createdDate, setCreatedDate] = useState(""); 


	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const fullText = `Welcome, ${name}`;
	const description = 'This page provides access to your account information, most recent billing transaction, and settings.'

	useEffect(() => {
		const loadUser = async () => {
			try {
				const currentUser = await getCurrentUser();
				const currentAttributes = await fetchUserAttributes();

				console.log("currentUser:", currentUser);
				console.log("currentAttributes:", currentAttributes);
				console.log("currentUser:", currentUser);

				setUserName(currentUser.username);
				setUserEmail(currentAttributes.email || "");
				setName(currentAttributes.name || ""); 
				setCreatedDate(currentAttributes.UserCreateDate || "04/17/2026");

			} catch (error) {
				console.error("Could not load Cognito username", error);
			}
		};

		loadUser();
	}, []);

	useEffect(() => {
		//wait until userName is loaded before starting the typing effect
		if (!userName || !name) return; 
		let i = 0;

		setDisplayText("");
		setDoneTyping(false);

		const interval = setInterval(() => {
			setDisplayText(fullText.slice(0, i+1));
			i++;

			if (i > fullText.length) {
				clearInterval(interval);
				setDoneTyping(true);
			}
		}, 100);

		return () => clearInterval(interval);
		}, [name, fullText]);

		const handleSaveUsername = async () => {
			try {
				await updateUserAttributes({
				userAttributes: {
					name: newUsername,
				}
				});
				setFirstName(newUsername);   
				setShowUsernameModal(false);
			} catch (error) {
				console.error("Failed to update name:", error);
			}
			setShowUsernameModal(false);
			setNewUsername("");
			window.location.reload();
		}

		const handleSavePassword = async () => {
			if (newPassword !== confirmNewPassword) {
				setPasswordError("Passwords do not match");
				return;
			}
			try {
				await updatePassword({ oldPassword: currentPassword, newPassword });
					setPasswordModal(false);
					setPasswordError("");
					setCurrentPassword("");
					setNewPassword("");
					setConfirmNewPassword("");
			} catch (error) {
				if (error.name === "NotAuthorizedException") {
					setPasswordError("Current password is incorrect");
				} else if (error.name === "InvalidPasswordException") {
					setPasswordError("New password doesn't meet requirements");
				} else {
					setPasswordError(`Something went wrong: ${error.message}`); 
				}
			}
		};

		const handleDeleteAccount = async () => {
			try {
				await deleteUser();
				window.location.reload();
			} catch (error) {
				console.error("Failed to delete account:", error);
			}
	};

	return (
		<div className="my-account-wrapper">
			<div className="wave-bg">
				<div className="lines layer1"></div>
				<div className="lines layer2"></div>
			</div>
			<div className="my-account-container p-4">

			<div className="mb-4">
				<h1 className="account-title">
					{displayText}
					{!doneTyping && <span className="cursor">|</span>}
				</h1>
			</div>

			<div className="description"><p>{description}</p></div>

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
					onClick={() => setActiveTab('settings')}>
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
						<FontAwesomeIcon icon={faUser} className="font-awesome" />
						Personal Information
					</h4>
					<div className="row g-3">
						<div className="col-md-6">
						<div className="p-3 bg-light rounded">
							<small className="text-muted d-block">Account Name</small>
							<strong>{name}</strong>
						</div>
						</div>
						<div className="col-md-6">
						<div className="p-3 bg-light rounded">
							<small className="text-muted d-block">Email</small>
							<strong>{userEmail}</strong>
						</div>
						</div>
						
						<div className="col-md-6">
						<div className="p-3 bg-light rounded">
							<small className="text-muted d-block">Account Created</small>
							<strong>{createdDate}</strong>
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
						<FontAwesomeIcon icon={faMoneyCheckDollar} className="font-awesome" />
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
							<strong>04/17/2026</strong>
						</div>
						</div>
					</div>
					</div>
				)}

				{activeTab === 'settings' && (
					<div>
					<h4 className="card-title mb-4">
						<FontAwesomeIcon icon={faGear} className="font-awesome" />
						Settings
					</h4>
					<div className="list-group">

						<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
							onClick={() => setShowUsernameModal(true)} >
							Change Display Name
							<span className="text-muted">›</span>
						</button>

						<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
							onClick={() => setPasswordModal(true)} >
							Change Password
							<span className="text-muted">›</span>
						</button>

						<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
							onClick={() => setMultiModal(true)} >
							Multifactor Authentication Set-Up
							<span className="text-muted">›</span>		
						</button>

						<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
							onClick={() => setPrivacyModal(true)} >
							Privacy Settings
							<span className="text-muted">›</span>
						</button>

						<button className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
							onClick={() => setShowDeleteModal(true)}>
							Delete Account
							<span className="text-muted">›</span>
						</button>

					</div>
					</div>
				)}

				</div>
			</div>
			</div>

			{/* Username Modal */}
			{showUsernameModal && (
			<div className="custom-modal-overlay" onClick={() => setShowUsernameModal(false)}>
				<div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>

					<div className="user-modal-content">
						<h3>Change Display Name</h3>
						<input type="text" className="new-username" placeholder="Enter new username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}/>				
					</div>

					<div className="buttons">
						<button className="cancel-button" onClick={() => setShowUsernameModal(false)}>Cancel</button>
						<button className="save-button" onClick={handleSaveUsername}>Save</button>{/*Where to update username for incognito -Emma */}
					</div>

				</div>
			</div>
			)}

			{/* Password Modal */}
			{showPasswordModal && (
			  <div className="custom-modal-overlay" onClick={() => setPasswordModal(false)}>
				<div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="user-modal-content">
					<h3>Change Password</h3>
					<input type="password" className="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
					<input type="password" className="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
					<input type="password" className="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}/>
					{passwordError && <p className="error-text">{passwordError}</p>}
				</div>
				<div className="buttons">
					<button className="cancel-button" onClick={() => {setPasswordModal(false);setNewPassword("");setPasswordError("");}}>Cancel</button>
					<button className="save-button" onClick={handleSavePassword}>Save</button>
				</div>
				</div>
			</div>
			)}

			{/* MultiFactor Authentification */}
			{showMultiModal && (
			<div className="custom-modal-overlay" onClick={() => setMultiModal(false)}>
				<div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
					
					<div className="user-modal-content">
						<p>Multifactor Authentification not supported right now</p>
					</div>

					<div className="buttons">
						<button className="cancel-button" onClick={() => setMultiModal(false)}>Go Back</button>
					</div>

				</div>
			</div>
			)}

			{/* Privacy Settings */}
			{showPrivacyModal && (
			<div className="custom-modal-overlay" onClick={() => setPrivacyModal(false)}>
				<div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
					
					<div className="user-modal-content">
						<p>Privacy settings are not available right now</p>
					</div>

					<div className="buttons">
						<button className="cancel-button" onClick={() => setPrivacyModal(false)}>Go Back</button>
					</div>

				</div>
			</div>
			)}

			{/* Delete Modal*/}
			{showDeleteModal && (
			  <div className="custom-modal-overlay" onClick={() => setShowDeleteModal(false)}>
				<div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="delete-info">
					<p className="p1">Are you sure you wish to delete your account? </p>
					<p>Once you do this there is no recovery of your account information</p>
				</div> 
				<div className="buttons">
					<button className="cancel-button" onClick={() => {setShowDeleteModal(false);}}>Cancel</button>
					<button className="save-button" onClick={handleDeleteAccount}>Confirm</button>
				</div>
				</div>

			</div>
			)}
		</div>
	);
	}