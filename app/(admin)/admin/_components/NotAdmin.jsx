"use client";

import React, { useCallback, useEffect, useState } from "react";

const NotAdmin = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated road */}
      <div className="road-container">
        <div className="road"></div>
        <div className="road-lines"></div>
      </div>

      {/* Car silhouette */}
      <div className="car-container">
        <div className="luxury-car">
          <div className="car-body"></div>
          <div className="car-roof"></div>
          <div className="window front-window"></div>
          <div className="window back-window"></div>
          <div className="wheel front-wheel"></div>
          <div className="wheel back-wheel"></div>
          <div className="headlight left-light"></div>
          <div className="headlight right-light"></div>
          <div className="grill"></div>
        </div>
      </div>

      <div
        className={`transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        } transition-all duration-1000 text-center z-10`}
      >
        <div className="relative">
          <h1 className="text-[4rem] md:text-[6rem] font-bold text-red-600 mb-4 leading-none animate-float">
            Access Restricted
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-red-600/20 blur-xl"></div>
        </div>

        <h2 className="text-2xl text-red-500 mb-4 animate-fade-in font-bold">
          VIP Area - Authorized Personnel Only
        </h2>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, but you don't have permission to access this exclusive area of
          Gadi Ghar. Please contact an administrator if you believe this is a
          mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="/" className="neon-button">
            <span className="button-glow"></span>
            <span className="relative z-10">Return to Showroom</span>
          </a>
          <button onClick={goBack} className="neon-button">
            <span className="button-glow"></span>
            <span className="relative z-10">Go Back</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .road-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          perspective: 100px;
          overflow: hidden;
        }

        .road {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100px;
          background: #1a1a1a;
          transform: rotateX(60deg);
        }

        .road-lines {
          position: absolute;
          bottom: 50px;
          width: 100%;
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            transparent 0%,
            transparent 45%,
            #ff3333 45%,
            #ff3333 55%,
            transparent 55%,
            transparent 100%
          );
          background-size: 100px 100%;
          animation: moveRoad 1s linear infinite;
          transform: rotateX(60deg);
        }

        .car-container {
          position: absolute;
          bottom: 40px;
          animation: carFloat 3s ease-in-out infinite;
        }

        .luxury-car {
          position: relative;
          width: 300px;
          height: 80px;
        }

        .car-body {
          position: absolute;
          width: 100%;
          height: 40px;
          bottom: 20px;
          background: linear-gradient(45deg, #1a1a1a, #333);
          border-radius: 20px 60px 0 0;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .car-roof {
          position: absolute;
          width: 180px;
          height: 30px;
          bottom: 60px;
          left: 30px;
          background: linear-gradient(45deg, #1a1a1a, #333);
          border-radius: 30px;
        }

        .window {
          position: absolute;
          background: linear-gradient(45deg, #6eb5ff, #b3d9ff);
          border-radius: 5px;
          height: 20px;
          width: 40px;
          bottom: 50px;
        }

        .front-window {
          left: 50px;
        }
        .back-window {
          right: 80px;
        }

        .wheel {
          position: absolute;
          width: 35px;
          height: 35px;
          background: #111;
          border-radius: 50%;
          border: 4px solid #333;
          bottom: 0;
          animation: wheelSpin 1s linear infinite;
        }

        .front-wheel {
          left: 50px;
        }
        .back-wheel {
          right: 50px;
        }

        .headlight {
          position: absolute;
          width: 10px;
          height: 6px;
          background: #fff;
          border-radius: 2px;
          bottom: 35px;
          box-shadow: 0 0 15px #fff;
          animation: glow 1s ease-in-out infinite alternate;
        }

        .left-light {
          right: 10px;
        }
        .right-light {
          right: 30px;
        }

        .grill {
          position: absolute;
          right: 15px;
          bottom: 30px;
          width: 30px;
          height: 12px;
          background: linear-gradient(90deg, #222, #444);
          border-radius: 3px;
        }

        .neon-button {
          position: relative;
          padding: 0.75rem 2rem;
          background: transparent;
          color: #ff3333;
          border: 2px solid #ff3333;
          border-radius: 8px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .button-glow {
          position: absolute;
          inset: 0;
          background: #ff3333;
          opacity: 0;
          transition: all 0.3s;
        }

        .neon-button:hover {
          color: white;
          box-shadow: 0 0 20px rgba(255, 51, 51, 0.6);
        }

        .neon-button:hover .button-glow {
          opacity: 1;
        }

        @keyframes moveRoad {
          from {
            background-position: 0 0;
          }
          to {
            background-position: -100px 0;
          }
        }

        @keyframes wheelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes carFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          from {
            opacity: 0.7;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotAdmin;
