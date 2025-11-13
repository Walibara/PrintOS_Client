import "./App.css";
import "./MyAccount.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMoneyCheckDollar, faGear } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import * as accountMethods from "./MyAccountUtils.js";  

export default function MyAccount() {

  return (
		<div className="my-account-container">
			<div className="account-title">My Account</div>

			<div className="flex-container">
				<div className="personal-information" onClick={() => accountMethods.handleClick('Personal Information')}>
					<FontAwesomeIcon icon={faUser} /> Personal Information  
				</div>
				<div className="billing-transactions" onClick={() => accountMethods.handleClick('Billing Transactions')}>
					<FontAwesomeIcon icon={faMoneyCheckDollar} /> Billing Transactions 
				</div>
				<div className="settings" onClick={() => accountMethods.handleClick('Settings')}>
				 <FontAwesomeIcon icon={faGear} />	Settings
				</div>
			</div>

			<div className="info-hidden">
				<div className="hidden-person-info" style={{ display: 'none' }}>
					<h2>Personal Information</h2>
					<p>Account Name: John Doe</p>
					<p>Account Creation Date: 11/11/2025</p>
					<p>Type: Personal</p>
				</div>

				<div className="hidden-billing-info" style={{ display: 'none' }}>
					<h2>Billing Transactions</h2>
					<p>Total Billing Transactions: 2</p>
					<p>Most recent Billing Transaction: 10123234</p>
					<p>Payment Type: Credit Card</p>
					<p>Date: 10/25/25</p>
					<p>Amount: $150.00</p>
				</div>

				<div className="hidden-settings-info" style={{ display: 'none' }}>
					<h2>Settings</h2>
					<p>Change Username</p>
					<p>Change Password</p>
					<p>MultiFactor Authentification Set-Up</p>
					<p>Privacy Settings</p>
				</div>
			</div>
		</div>
  );
}
