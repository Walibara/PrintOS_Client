import React, { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./Auth.css";

import login1 from "../../assets/login1.png";
import login2 from "../../assets/login2.png";
import login3 from "../../assets/login3.png";
import login4 from "../../assets/login4.png";
import login5 from "../../assets/login5.png";
import login6 from "../../assets/login6.png";
import login7 from "../../assets/login7.png";
import login8 from "../../assets/login8.png";

const collageImages = [login1, login2, login3, login4, login5, login6, login7, login8];

//Got these from one of the PrintOS pics... I thought it would be good to include them
const taglines = [
  "Achieve The Highest Color Standards",
  "Automate Production",
  "Seize New Business Opportunities",
  "High-Value Applications",
  "Optimize Print Operations",
  "Adopt Best Practices",
];

export default function LoginPage({ children }) {

  const { authStatus } = useAuthenticator();
  const isAuthenticated = authStatus === "authenticated";
  const [activeIndex, setActiveIndex] = useState(-1);
  const [collageDimmed, setCollageDimmed] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState(true);

  if (authStatus === "configuring") {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <LoginAnimation>{children}</LoginAnimation>;
}

function LoginAnimation({ children }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [collageDimmed, setCollageDimmed] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineFade, setTaglineFade] = useState(true);

  useEffect(() => {

    // images one by one
    const imageInterval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= collageImages.length - 1) {
          clearInterval(imageInterval);

          // — dim collage, show text
          setTimeout(() => {
            setCollageDimmed(true);
            setTextVisible(true);

            // show login after 3 cycles
            setTimeout(() => {
              setLoginVisible(true);
            }, 3000);

          }, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(imageInterval);
}, []);

  // Cycle taglines
  useEffect(() => {
    if (!textVisible) return;

    const cycle = setInterval(() => {
      setTaglineFade(false);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
        setTaglineFade(true);
      }, 400);
    }, 2000);

    return () => clearInterval(cycle);
  }, [textVisible]);

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

      {/* Centered text block  */}
      <div className={`welcome-block ${textVisible ? "visible" : ""}`}>
        <p className="welcome-brand">A WSUV Capstone Project</p>
        <h1 className="welcome-title">Welcome to PrintOS</h1>
        <p className={`welcome-tagline ${taglineFade ? "fade-in" : "fade-out"}`}>
          {taglines[taglineIndex]}
        </p>
      </div>

      {/* Login card */}
      <div className={`login-card-wrapper ${loginVisible ? "visible" : ""}`}>
        {children}
      </div>
    </div>
  );
}