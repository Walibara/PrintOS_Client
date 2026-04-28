import React, { useState, useEffect } from "react";
import "../Login/Auth.css";

import login1 from "../../assets/login1.png";
import login2 from "../../assets/login2.png";
import login3 from "../../assets/login3.png";
import login4 from "../../assets/login4.png";
import login5 from "../../assets/login5.png";
import login6 from "../../assets/login6.png";
import login7 from "../../assets/login7.png";
import login8 from "../../assets/login8.png";

const collageImages = [login1, login2, login3, login4, login5, login6, login7, login8];

export default function LogoutPage({ onDone }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [collageDimmed, setCollageDimmed] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // Same image reveal sequence as LoginPage
    const imageInterval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= collageImages.length - 1) {
          clearInterval(imageInterval);
          setTimeout(() => {
            setCollageDimmed(true);
            setTextVisible(true);
            setTimeout(() => {
              setCardVisible(true);
            }, 3000);
          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(imageInterval);
  }, []);

  return (
    <div className="login-screen">
      <div className="collage-grid">
        {collageImages.map((img, i) => (
          <div
            key={i}
            className={`collage-cell ${i <= activeIndex ? "visible" : ""} ${collageDimmed ? "dimmed" : ""}`}
          >
            <img src={img} alt="" />
          </div>
        ))}
      </div>

      <div className={`login-overlay ${collageDimmed ? "deep" : ""}`} />
      <div className={`welcome-block ${textVisible ? "visible" : ""}`}>
        <p className="welcome-brand">A WSUV Capstone Project</p>
        <h1 className="welcome-title">Questions?</h1>
        <p className="welcome-tagline fade-in">Thank you for joining us.</p>
      </div>
      <div className={`login-card-wrapper ${cardVisible ? "visible" : ""}`}>
        <button
          onClick={onDone}
          style={{
            padding: "0.75rem 2.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            background: "#003366",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => e.target.style.background = "#004d99"}
          onMouseOut={(e) => e.target.style.background = "#003366"}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}