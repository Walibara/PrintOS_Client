/* Author: Emma
   Description: Handle Click manages when the clicking of the personal information, billing transactions, etc.on the MyAccount page 
   HandleClick Created Date: 11/11/2025 */

export function handleClick(section){

    switch(section){
        case 'Personal Information':
            const hiddenPerson = document.querySelector('.hidden-person-info');
            const personalInfoColor = document.querySelector('.personal-information');  
             
        if (hiddenPerson.style.display === "none" || hiddenPerson.style.display === "") {
            hiddenPerson.style.display = "flex"; 
            personalInfoColor.style.background = "#38a9ff";
            personalInfoColor.style.color = "#ffffff";
            personalInfoColor.onmouseenter = null;
            personalInfoColor.onmouseleave = null;
        } else {
            hiddenPerson.style.display = "none"; 
            personalInfoColor.style.background = "#ffffff";
            personalInfoColor.style.color = "#003366";

            personalInfoColor.onmouseenter = () => {
                personalInfoColor.style.background = "#38a9ff";
                personalInfoColor.style.color = "#ffffff";
            };
            personalInfoColor.onmouseleave = () => {
                personalInfoColor.style.background = "#ffffff";
                personalInfoColor.style.color = "#003366";
            };
        }
        break;

        case 'Billing Transactions':
            const hiddenBilling = document.querySelector('.hidden-billing-info');
            const billingColor = document.querySelector('.billing-transactions');

            if (hiddenBilling.style.display === "none"){
                hiddenBilling.style.display = "flex"; 
                billingColor.style.background = "#38a9ff";
                billingColor.style.color = "#ffffff";
                billingColor.onmouseenter = null;
                billingColor.onmouseleave = null;
            } else {
                hiddenBilling.style.display = "none"; 
                billingColor.style.background = "#ffffff";
                billingColor.style.color = "#003366";

                billingColor.onmouseenter = () => {
                    billingColor.style.background = "#38a9ff";
                    billingColor.style.color = "#ffffff";
                };
                billingColor.onmouseleave = () => {
                    billingColor.style.background = "#ffffff";
                    billingColor.style.color = "#003366";
                };      
            }
            break; 

        case 'Settings':
            const hiddenSettings = document.querySelector('.hidden-settings-info');
            const settingsColor = document.querySelector('.settings');

            if (hiddenSettings.style.display === "none"){
                hiddenSettings.style.display = "flex"; 
                settingsColor.style.background = "#38a9ff";
                settingsColor.style.color = "#ffffff";
                settingsColor.onmouseenter = null;
                settingsColor.onmouseleave = null;
            } else {
                hiddenSettings.style.display = "none"; 
                settingsColor.style.background = "#ffffff"; 
                settingsColor.style.color = "#003366";

                settingsColor.onmouseenter = () => {
                    settingsColor.style.background = "#38a9ff";
                    settingsColor.style.color = "#ffffff";
                };
                settingsColor.onmouseleave = () => {
                    settingsColor.style.background = "#ffffff";
                    settingsColor.style.color = "#003366";
                };  
            }
            break
    }
}