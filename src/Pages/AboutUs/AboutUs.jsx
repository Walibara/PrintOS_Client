import "../App/App.css";
import "./AboutUs.css"; 
import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import photo1 from "../../assets/hp-photo-1.jpg";
import photo2 from "../../assets/hp-photo-2.jpg";
import photo3 from "../../assets/hp-photo-3.jpg";
import photo4 from "../../assets/hp-photo-4.webp"; 
import photo5 from "../../assets/hp-photo-5.avif"; 
import photo6 from "../../assets/hp-photo-6.webp"; 
import photo7 from "../../assets/hp-photo-7.jpg"; 
import photo9 from "../../assets/hp-photo-9.webp"; 
import photo10 from "../../assets/hp-photo-10.avif"; 
import photoPrintOS from "../../assets/printOS.svg"; 
import photo11 from "../../assets/Untitled-7 copy.svg"; 


export default function AboutUs() {

  return (
    <div className="about-us-page">

      <div id="aboutCarousel" className="carousel slide" data-bs-ride="carousel">
        
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#aboutCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#aboutCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#aboutCarousel" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#aboutCarousel" data-bs-slide-to="3"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={photo5} className="d-block w-100" alt="Photo 1" />
          </div>
          <div className="carousel-item">
              <img src={photoPrintOS} className="d-block w-100 OS" alt="Photo 2" />
          </div>
          <div className="carousel-item">
            <img src={photo7} className="d-block w-100" alt="Photo 3" />
          </div>
          <div className="carousel-item">
            <img src={photo11} className="d-block w-100" alt="Photo 3" />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>

      <div className="our-story">
        <h2>About Us</h2>
        <p>The HP PrintOS Capstone web application was created by students of Washington State University from September 2025 to May 2026.
           <br />Student Developers include: Maria Stefanovic, Fatimah Diallo, Malek Abualya, Mona Abualya, and Emma Sturm. 
            <br />The goal of this project is to create an application where users are able to create print and manage their different print requests.</p>
      </div>
      <div className= "our-sponsors">
        <h2>Our Sponsors</h2>
        <p>HP PrintOS Team: Kendra Swafford, James Keirnan, Thieu Dang, Jon Lewis, and Kelvin Sapathy.</p></div>
    </div>
  );
}
