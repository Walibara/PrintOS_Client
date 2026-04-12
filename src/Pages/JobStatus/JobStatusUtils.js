//Emma - borrowed Maria's code in Job Submission where she creates a job
import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();

export async function getJobs() {

    try {
        const cleanBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
        
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
            throw new Error ("No authentication token found")
        }

        const response = await fetch(`${cleanBase}/api/jobs`, { 
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg || `HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log("Jobs returned successfully!:", result);
        return result; 
    } catch (error) {
        console.error(`Failed to get jobs: ${error.message}`);
        throw error;
    }
}

export async function deleteJob(job){
     try {
        const cleanBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
        
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
            throw new Error ("No authentication token found")
        }

        const response = await fetch(`${cleanBase}/api/jobs/${job.id}`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg || `HTTP ${response.status}`);
        }

    } catch (error) {
        console.error(`Failed to delete job: ${error.message}`);
        throw error;
    }
}