"use client";

import { useCallback, useEffect, useState } from "react";

const NotFoundPage = () => {
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

      {/* Luxury Limo silhouette */}
      <div className="car-container">
        <div className="limo">
          <div className="limo-body"></div>
          <div className="limo-roof"></div>
          <div className="window window-1"></div>
          <div className="window window-2"></div>
          <div className="window window-3"></div>
          <div className="wheel wheel-front"></div>
          <div className="wheel wheel-middle"></div>
          <div className="wheel wheel-back"></div>
          <div className="headlight headlight-1"></div>
          <div className="headlight headlight-2"></div>
          <div className="taillight taillight-1"></div>
          <div className="taillight taillight-2"></div>
          <div className="grill"></div>
        </div>
      </div>

      <div
        className={`transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        } transition-all duration-1000 text-center z-10`}
      >
        {/* Modern 404 text */}
        <div className="relative">
          <h1 className="text-[8rem] md:text-[12rem] font-bold text-red-600 mb-4 leading-none animate-float">
            404
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-red-600/20 blur-xl"></div>
        </div>

        <h2 className="text-2xl text-red-500 mb-8 animate-fade-in font-bold">
          Wrong Turn at Gadi Ghar!
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="/" className="neon-button">
            <span className="button-glow"></span>
            <span className="relative z-10">Back to Showroom</span>
          </a>

          <button onClick={goBack} className="neon-button">
            <span className="button-glow"></span>
            <span className="relative z-10">Previous Route</span>
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
          animation: carFloat 1s ease-in-out infinite;
        }

        .limo {
          position: relative;
          width: 400px;
          height: 100px;
          transform: scale(0.7);
        }

        .limo-body {
          position: absolute;
          width: 100%;
          height: 45px;
          bottom: 25px;
          background: linear-gradient(45deg, #1a1a1a, #333);
          border-radius: 5px 80px 0 0;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .limo-roof {
          position: absolute;
          width: 280px;
          height: 35px;
          bottom: 70px;
          left: 40px;
          background: linear-gradient(45deg, #1a1a1a, #333);
          border-radius: 15px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        }

        .window {
          position: absolute;
          background: linear-gradient(45deg, #6eb5ff, #b3d9ff);
          border-radius: 3px;
          bottom: 55px;
          height: 25px;
          width: 40px;
        }

        .window-1 {
          left: 60px;
        }

        .window-2 {
          left: 160px;
          width: 60px;
        }

        .window-3 {
          left: 240px;
        }

        .wheel {
          position: absolute;
          width: 40px;
          height: 40px;
          background: #111;
          border-radius: 50%;
          border: 5px solid #333;
          bottom: 0;
          animation: wheelSpin 1s linear infinite;
        }

        .wheel::after {
          content: "";
          position: absolute;
          inset: 5px;
          background: radial-gradient(
            circle at center,
            #333 30%,
            transparent 30%
          );
          border-radius: 50%;
        }

        .wheel-front {
          left: 50px;
        }

        .wheel-middle {
          left: 180px;
        }

        .wheel-back {
          right: 50px;
        }

        .headlight {
          position: absolute;
          width: 12px;
          height: 8px;
          background: #fff;
          border-radius: 2px;
          bottom: 45px;
          box-shadow: 0 0 20px #fff;
          animation: glow 1s ease-in-out infinite alternate;
        }

        .headlight-1 {
          right: 5px;
        }

        .headlight-2 {
          right: 25px;
        }

        .taillight {
          position: absolute;
          width: 10px;
          height: 6px;
          background: #ff0000;
          border-radius: 2px;
          bottom: 45px;
          box-shadow: 0 0 20px #ff0000;
          animation: glow 1s ease-in-out infinite alternate;
        }

        .taillight-1 {
          left: 5px;
        }

        .taillight-2 {
          left: 20px;
        }

        .grill {
          position: absolute;
          right: 10px;
          bottom: 35px;
          width: 40px;
          height: 15px;
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
          cursor: pointer;
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
            transform: translateY(-2px);
          }
        }

        @keyframes glow {
          from {
            opacity: 0.7;
            filter: brightness(0.7);
          }
          to {
            opacity: 1;
            filter: brightness(1.2);
          }
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
