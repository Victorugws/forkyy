import React, { useState, useEffect } from "react"

/**
 * SEARCH TO EYE TRANSITION COMPONENT
 * White neumorphic search bar that transforms into animated eye background
 * Combines: https://codepen.io/tdtrung17693/pen/BaozOzQ → AnimatedEyeBackground
 */

export function SearchToEyeTransition() {
    const [isActive, setIsActive] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showEye, setShowEye] = useState(false)
    const [searchValue, setSearchValue] = useState("")

    const handleFocus = () => {
        setIsActive(true)
    }

    const handleBlur = () => {
        if (searchValue.length === 0) {
            setIsActive(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsProcessing(true)
        setIsActive(false)

        // Spin for 1 second, then start transition to eye
        setTimeout(() => {
            setIsProcessing(false)
            setShowEye(true)
        }, 1000)
    }

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                minHeight: "600px",
                background: "#f5f5f5",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "40px 0",
            }}
        >
            {/* Eye Section - at the top */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "450px",
                    marginBottom: "60px",
                }}
            >
                {showEye && <EyeAnimation />}
            </div>

            {/* Search Form - separated below */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                    <div
                        className={`finder ${isActive ? "active" : ""} ${isProcessing ? "processing" : ""}`}
                    >
                        <div className="finder__outer">
                            <div className="finder__inner">
                                <div className="finder__icon" />
                                <input
                                    className="finder__input"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isProcessing}
                                    style={{
                                        color: "#2a2a2a",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .finder {
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: #f5f5f5;
          border-radius: 16px;
          padding: 10px;
          box-shadow:
            12px 12px 24px rgba(180, 180, 180, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(220, 220, 220, 0.2);
        }

        .finder.active {
          box-shadow:
            16px 16px 32px rgba(170, 170, 170, 0.5),
            -16px -16px 32px rgba(255, 255, 255, 1),
            inset 3px 3px 6px rgba(210, 210, 210, 0.3);
        }

        .finder__outer {
          display: flex;
          width: 600px;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          box-shadow:
            inset 12px 12px 20px -10px rgba(195, 195, 195, 0.6),
            inset -12px -12px 20px -10px rgba(255, 255, 255, 0.8);
        }

        .finder__inner {
          display: flex;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .finder__input {
          flex: 1;
          border: none;
          background-color: transparent;
          outline: none;
          font-size: 1.5rem;
          letter-spacing: 0.75px;
          font-family: inherit;
        }

        .finder__input::placeholder {
          color: rgba(150, 150, 150, 0.5);
        }

        .finder__icon {
          width: 40px;
          height: 40px;
          margin-right: 1rem;
          box-shadow: inset 0 0 0 20px #2a2a2a;
          border-radius: 50%;
          position: relative;
        }

        .finder__icon::after,
        .finder__icon::before {
          display: block;
          content: "";
          position: absolute;
        }

        /* Inner circle of magnifying glass */
        .finder__icon::after {
          width: 10px;
          height: 10px;
          background-color: #2a2a2a;
          border: 3px solid #ffffff;
          top: 50%;
          position: absolute;
          transform: translateY(-50%);
          left: 0;
          right: 0;
          margin: auto;
          border-radius: 50%;
        }

        .active .finder__icon::after {
          border-width: 10px;
          background-color: #f5f5f5;
        }

        /* Handle of magnifying glass */
        .finder__icon::before {
          width: 4px;
          height: 13px;
          background-color: #f5f5f5;
          top: 50%;
          left: 20px;
          transform: rotateZ(45deg) translate(-50%, 0);
          transform-origin: 0 0;
          border-radius: 4px;
        }

        .active .finder__icon::before {
          background-color: #2a2a2a;
          width: 6px;
          transform: rotateZ(45deg) translate(-50%, 25px);
        }

        .processing .finder__icon {
          animation: spinner 0.3s linear infinite;
          animation-delay: 0.2s;
        }

        .active .finder__icon {
          transform: translateY(-5px);
        }

        @keyframes spinner {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }
      `}</style>
        </div>
    )
}

// Eye Animation Component
function EyeAnimation() {
    return (
        <>
            {/* SVG Clip Paths */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    <clipPath id="bagel1">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M95 190C147.467 190 190 147.467 190 95C190 42.533 147.467 0 95 0C42.533 0 0 42.533 0 95C0 147.467 42.533 190 95 190ZM95 120C108.807 120 120 108.807 120 95C120 81.1929 108.807 70 95 70C81.1929 70 70 81.1929 70 95C70 108.807 81.1929 120 95 120Z"
                        />
                    </clipPath>
                    <clipPath id="bagel2">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M71 142C110.212 142 142 110.212 142 71C142 31.7878 110.212 0 71 0C31.7878 0 0 31.7878 0 71C0 110.212 31.7878 142 71 142ZM71 139C108.555 139 139 108.555 139 71C139 33.4446 108.555 3 71 3C33.4446 3 3 33.4446 3 71C3 108.555 33.4446 139 71 139Z"
                        />
                    </clipPath>
                    <clipPath id="bagel3">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M60 120C93.1372 120 120 93.1372 120 60C120 26.8628 93.1372 0 60 0C26.8628 0 0 26.8628 0 60C0 93.1372 26.8628 120 60 120ZM60 115C90.3757 115 115 90.3757 115 60C115 29.6243 90.3757 5 60 5C29.6243 5 5 29.6243 5 60C5 90.3757 29.6243 115 60 115Z"
                        />
                    </clipPath>
                    <clipPath id="bagel4">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M38 76C58.9868 76 76 58.9868 76 38C76 17.0132 58.9868 0 38 0C17.0132 0 0 17.0132 0 38C0 58.9868 17.0132 76 38 76ZM38 72C56.7777 72 72 56.7776 72 38C72 19.2224 56.7777 4 38 4C19.2223 4 4 19.2224 4 38C4 56.7776 19.2223 72 38 72Z"
                        />
                    </clipPath>
                </defs>
            </svg>

            {/* Main Eye */}
            <div className="eye" />

            {/* Animated Circles */}
            <div className="circle-1" />
            <div className="circle-2" />
            <div className="circle-3" />
            <div className="circle-4" />
            <div className="circle-5" />
            <div className="circle-6" />
            <div className="circle-7" />
            <div className="circle-8" />
            <div className="circle-9" />
            <div className="circle-10" />
            <div className="circle-11" />
            <div className="circle-12" />
            <div className="circle-13" />
            <div className="circle-14" />

            {/* Glitch Effect */}
            <div className="glitch" />

            {/* Fragments */}
            <div className="fragment-1" />
            <div className="fragment-2" />
            <div className="fragment-3" />

            <style jsx>{`
        .eye, .eye::before, .eye::after,
        div[class^="circle-"], div[class^="circle-"]::before, div[class^="circle-"]::after,
        .glitch, .glitch::before, .glitch::after,
        div[class^="fragment-"], div[class^="fragment-"]::before, div[class^="fragment-"]::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
        }

        .eye {
          width: 332px;
          height: 332px;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          background: #f8f8f8;
          filter: blur(5px);
          box-shadow: inset -12px -18px 35px -5px rgba(200, 200, 200, 0.7),
                      64px 55px 60px -30px rgba(150, 150, 150, 0.4),
                      20px 18px 40px -5px rgba(160, 160, 160, 0.5),
                      inset -70px -50px 80px -20px rgba(180, 180, 180, 0.4),
                      inset -90px -90px 90px -70px rgba(170, 170, 170, 0.3),
                      inset -70px -50px 120px -30px rgba(190, 190, 190, 0.35),
                      inset 80px 50px 100px -40px rgba(255, 255, 255, 0.8),
                      -25px -15px 60px -5px rgba(200, 200, 200, 0.3),
                      14px -1px 60px -5px rgba(170, 170, 170, 0.4),
                      1px 9px 60px -5px rgba(175, 175, 175, 0.4);
          animation: eyeAppear 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards,
                     eyeAnimation 4s cubic-bezier(1, 0, 1, 1) 2s infinite;
        }

        @keyframes eyeAppear {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(45deg);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.25) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes eyeAnimation {
          0%, 33%, 100% {
            box-shadow: inset -12px -18px 35px -5px rgba(200, 200, 200, 0.7),
                        64px 55px 60px -30px rgba(150, 150, 150, 0.4),
                        20px 18px 40px -5px rgba(160, 160, 160, 0.5),
                        inset -70px -50px 80px -20px rgba(180, 180, 180, 0.4),
                        inset -90px -90px 90px -70px rgba(170, 170, 170, 0.3),
                        inset -70px -50px 120px -30px rgba(190, 190, 190, 0.35),
                        inset 80px 50px 100px -40px rgba(255, 255, 255, 0.8),
                        -25px -15px 60px -5px rgba(200, 200, 200, 0.3),
                        14px -1px 60px -5px rgba(170, 170, 170, 0.4),
                        1px 9px 60px -5px rgba(175, 175, 175, 0.4),
                        inset -90px 40px 80px -10px rgba(190, 190, 190, 0.4),
                        inset -90px -120px 80px -10px rgba(195, 195, 195, 0.4);
            transform: translate(-50%, -50%) scale(1.25);
          }
          65% {
            box-shadow: inset -12px -18px 80px -5px rgba(210, 210, 210, 0.6),
                        44px 35px 35px -15px rgba(170, 170, 170, 0.5),
                        11px 9px 18px -2px rgba(180, 180, 180, 0.5),
                        inset -100px -70px 60px -100px rgba(185, 185, 185, 0.4),
                        inset -90px -90px 90px -70px rgba(175, 175, 175, 0.35),
                        inset -70px -50px 120px -30px rgba(195, 195, 195, 0.4),
                        inset 80px 50px 100px -40px rgba(255, 255, 255, 0.8),
                        -25px -15px 40px -5px rgba(200, 200, 200, 0.35);
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .eye::after {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          box-shadow: inset -60px -30px 45px -5px rgba(230, 230, 230, 0.8),
                      inset 100px 10px 35px -20px rgba(100, 100, 100, 0.6),
                      0px 0px 15px 10px rgba(220, 220, 220, 0.9),
                      inset 0px 0px 30px 5px rgba(210, 210, 210, 0.4);
          animation: pupilAnimationSize 4s cubic-bezier(1, 0, 1, 1) 2s infinite,
                     pupilAnimationView 4s ease 2s infinite;
        }

        @keyframes pupilAnimationSize {
          0%, 30%, 100% { transform: translate(-50%, -50%) scale(0.85); }
          40%, 90% { transform: translate(-50%, -50%) scale(0.5); }
        }

        @keyframes pupilAnimationView {
          0%, 30%, 100% {
            box-shadow: inset -60px -30px 45px -5px rgba(230, 230, 230, 0.8),
                        inset 100px 10px 35px -20px rgba(100, 100, 100, 0.6),
                        0px 0px 15px 10px rgba(220, 220, 220, 0.9),
                        inset 0px 0px 30px 5px rgba(210, 210, 210, 0.4);
          }
          60%, 66% {
            box-shadow: inset -50px -20px 30px 0px rgba(231, 226, 245, 0),
                        inset 10px 10px 70px -27px rgba(47, 44, 76, 0),
                        0px 0px 10px 7px hsla(0, 0%, 96%, 0);
          }
          90% {
            box-shadow: inset -60px -30px 45px -5px rgba(230, 230, 230, 0.8),
                        inset 100px 10px 35px -20px rgba(100, 100, 100, 0.6),
                        0px 0px 15px 10px rgba(220, 220, 220, 0.9),
                        inset 0px 0px 30px 5px rgba(210, 210, 210, 0.4);
          }
        }

        /* Circles fade in after eye appears */
        .circle-1, .circle-2, .circle-3, .circle-4, .circle-5, .circle-6,
        .circle-7, .circle-8, .circle-9, .circle-10, .circle-11, .circle-12,
        .circle-13, .circle-14 {
          animation-delay: 1.5s;
          opacity: 0;
        }

        .circle-1 {
          width: 475px;
          height: 475px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-right-color: rgba(200, 200, 200, 0.8);
          animation: circleFadeIn 0.8s ease 1.5s forwards,
                     circle1AnimationOpacity 4s ease 2.3s infinite,
                     circle1AnimationMove 4s ease 2.3s infinite;
        }

        @keyframes circleFadeIn {
          to { opacity: 1; }
        }

        @keyframes circle1AnimationMove {
          0%, 100% { transform: translate(-50%, -50%) rotate(49deg); }
          7% { transform: translate(-50%, -50%) rotate(38deg); }
          12%, 19%, 68% { transform: translate(-50%, -50%) rotate(42deg); }
          26%, 30% { transform: translate(-50%, -50%) rotate(82deg); }
          73% { transform: translate(-50%, -50%) rotate(34deg); }
          87%, 92% { transform: translate(-50%, -50%) rotate(69deg); }
          94% { transform: translate(-50%, -50%) rotate(65deg); }
        }

        @keyframes circle1AnimationOpacity {
          0%, 27%, 73%, 100% { opacity: 1; }
          30%, 70% { opacity: 0; }
        }

        .circle-2 {
          width: 475px;
          height: 475px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-right-color: rgba(200, 200, 200, 0.8);
          animation: circleFadeIn 0.8s ease 1.6s forwards,
                     circle2AnimationOpacity 4s ease 2.4s infinite,
                     circle2AnimationMove 4s ease 2.4s infinite;
        }

        @keyframes circle2AnimationMove {
          0%, 100% { transform: translate(-50%, -50%) rotate(229deg); }
          9% { transform: translate(-50%, -50%) rotate(220deg); }
          14%, 21% { transform: translate(-50%, -50%) rotate(225deg); }
          29%, 67% { transform: translate(-50%, -50%) rotate(262deg); }
          82% { transform: translate(-50%, -50%) rotate(241deg); }
          90%, 94% { transform: translate(-50%, -50%) rotate(249deg); }
          99% { transform: translate(-50%, -50%) rotate(245deg); }
        }

        @keyframes circle2AnimationOpacity {
          0%, 27%, 79%, 100% { opacity: 1; }
          30%, 76% { opacity: 0; }
        }

        .circle-3 {
          left: calc(50% + 93px);
          top: calc(50% - 189px);
          width: 106px;
          height: 280px;
          overflow: hidden;
          animation: circleFadeIn 0.8s ease 1.7s forwards;
        }

        .circle-3::before {
          left: -275%;
          top: -4%;
          width: 393px;
          height: 393px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-right-color: rgba(200, 200, 200, 0.8);
          animation: circle3Animation 4s ease 2.5s infinite;
        }

        @keyframes circle3Animation {
          0% { transform: rotate(-3deg); }
          20% { transform: rotate(-107deg); }
          79% { transform: rotate(-286deg); }
          100% { transform: rotate(-364deg); }
        }

        .circle-4 {
          width: 295px;
          height: 295px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-right-color: rgba(180, 180, 180, 0.7);
          border-left-color: rgba(200, 200, 200, 0.4);
          animation: circleFadeIn 0.8s ease 1.8s forwards,
                     circle4AnimationMove 4s cubic-bezier(1, 0, 1, 1) 2.6s infinite,
                     circle4AnimationOpacity 4s ease 2.6s infinite;
        }

        @keyframes circle4AnimationMove {
          0%, 100% { transform: translate(-50%, -50%) rotate(219deg) scale(1); }
          6% { transform: translate(-50%, -50%) rotate(221deg) scale(0.9); }
          16% { transform: translate(-50%, -50%) rotate(302deg) scale(0.9); }
          22% { transform: translate(-50%, -50%) rotate(307deg) scale(0.9); }
          29% { transform: translate(-50%, -50%) rotate(312deg) scale(0.93); }
          33% { transform: translate(-50%, -50%) rotate(310deg) scale(0.93); }
          36% { transform: translate(-50%, -50%) rotate(300deg) scale(0.7); }
          39% { transform: translate(-50%, -50%) rotate(220deg) scale(0.92); }
          50%, 57% { transform: translate(-50%, -50%) rotate(248deg) scale(0.92); }
          66% { transform: translate(-50%, -50%) rotate(225deg) scale(0.92); }
          73%, 81% { transform: translate(-50%, -50%) rotate(243deg) scale(0.92); }
          93% { transform: translate(-50%, -50%) rotate(215deg) scale(1); }
        }

        @keyframes circle4AnimationOpacity {
          0%, 33%, 50%, 100% { opacity: 1; }
          36%, 39% { opacity: 0; }
        }

        .circle-5 {
          width: 100px;
          height: 100px;
          transform: translate(-50%, -50%);
          animation: circleFadeIn 0.8s ease 1.9s forwards,
                     circle5AnimationSize 4s cubic-bezier(1, 0, 1, 1) 2.7s infinite,
                     circle5AnimationView 4s ease 2.7s infinite;
        }

        .circle-5::before {
          width: 173px;
          height: 173px;
          border-radius: 50%;
          border: 1px solid rgba(160, 160, 160, 0.5);
          transform: translate(-50%, -50%);
        }

        .circle-5::after {
          width: 177px;
          height: 177px;
          border-radius: 50%;
          border: 1px solid rgba(160, 160, 160, 0.5);
          transform: translate(-50%, -50%);
        }

        @keyframes circle5AnimationSize {
          0%, 38%, 82.82%, 100% { transform: translate(-50%, -50%) scale(1); }
          45%, 75.44% { transform: translate(-50%, -50%) scale(0.7); }
        }

        @keyframes circle5AnimationView {
          0%, 5.7%, 7.4%, 9.8%, 11.5%, 14%, 15.6%, 18.9%, 21.3%, 23.8%, 25.4%, 28.7%, 35.3%, 42%, 77.9%, 82.7%, 83.6%, 85.2%, 86.1%, 91.8%, 93.5%, 97.6%, 100% { opacity: 1; }
          2.5%, 6.6%, 8.2%, 10.7%, 14.8%, 18%, 20.5%, 22.1%, 24.6%, 27.9%, 36%, 88.6% { opacity: 0.5; }
          47%, 77.8%, 82.8%, 83.5%, 85.3%, 86%, 90.2%, 92.7%, 96.8%, 99.2% { opacity: 0; }
        }

        .circle-6 {
          width: 190px;
          height: 190px;
          background: repeating-conic-gradient(from 0deg, rgba(100, 100, 100, 0.6) 0deg 1deg, transparent 1deg 2deg);
          clip-path: url(#bagel1);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2s forwards,
                     circle6Animation 4s cubic-bezier(1, 0, 1, 1) 2.8s infinite;
        }

        @keyframes circle6Animation {
          0% { transform: translate(-50%, -50%) scale(1); }
          8%, 35% { transform: translate(-50%, -50%) scale(0.93); opacity: 1; }
          40%, 90% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          95%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .circle-7 {
          width: 142px;
          height: 142px;
          filter: blur(1px);
          animation: circleFadeIn 0.8s ease 2.1s forwards,
                     circle6Animation 4s cubic-bezier(1, 0, 1, 1) 2.7s infinite;
        }

        .circle-7::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-conic-gradient(from 0deg, rgba(80, 80, 80, 0.8) 0deg 2deg, transparent 2deg 8deg);
          clip-path: url(#bagel2);
          border-radius: 50%;
        }

        .circle-8 {
          width: 120px;
          height: 120px;
          background: repeating-conic-gradient(from 0deg, rgba(120, 120, 120, 0.7) 0deg 1deg, transparent 1deg 2deg);
          clip-path: url(#bagel3);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2.2s forwards,
                     circle6Animation 4s cubic-bezier(1, 0, 1, 1) 2.67s infinite;
        }

        .circle-9 {
          width: 76px;
          height: 76px;
          background: repeating-conic-gradient(from 0deg, rgba(120, 120, 120, 0.7) 0deg 1deg, transparent 1deg 2deg);
          clip-path: url(#bagel4);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2.3s forwards,
                     circle6Animation 4s cubic-bezier(1, 0, 1, 1) 2.64s infinite;
        }

        .circle-10 {
          width: 190px;
          height: 190px;
          background: radial-gradient(rgba(240, 240, 240, 0.8), rgba(230, 230, 230, 0.6), rgba(200, 200, 200, 0.4), transparent 70%);
          clip-path: url(#bagel1);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2.4s forwards,
                     circle10Animation 4s cubic-bezier(1, 0, 1, 1) 3.2s infinite;
        }

        @keyframes circle10Animation {
          0% { transform: translate(-50%, -50%) scale(1); }
          4%, 30% { transform: translate(-50%, -50%) scale(0.93); opacity: 1; }
          35%, 93% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          98%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        .circle-11 {
          width: 190px;
          height: 190px;
          background: repeating-conic-gradient(from 0deg, rgba(150, 150, 150, 0.3) 0deg 1deg, transparent 1deg 8deg, rgba(140, 140, 140, 0.5) 8deg 9deg, transparent 9deg 10deg, rgba(150, 150, 150, 0.3) 10deg 11deg, transparent 11deg 72deg);
          clip-path: url(#bagel1);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2.5s forwards,
                     circle11Animation 4s cubic-bezier(1, 0, 1, 1) 3.3s infinite;
        }

        @keyframes circle11Animation {
          0%, 98%, 100% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          15% { transform: translate(-50%, -50%) rotate(45deg); }
          25% { transform: translate(-50%, -50%) rotate(-10deg); }
          30% { opacity: 1; }
          35% { transform: translate(-50%, -50%) rotate(-20deg); opacity: 0; }
          93% { transform: translate(-50%, -50%) rotate(80deg); opacity: 0; }
        }

        .circle-12 {
          width: 190px;
          height: 190px;
          background: repeating-conic-gradient(from 0deg, rgba(130, 130, 130, 0.4) 20deg 21deg, transparent 21deg 40deg, rgba(120, 120, 120, 0.5) 40deg 41deg, transparent 41deg 43deg, rgba(140, 140, 140, 0.35) 43deg 44deg, transparent 44deg 76deg);
          clip-path: url(#bagel1);
          border-radius: 50%;
          animation: circleFadeIn 0.8s ease 2.6s forwards,
                     circle12Animation 4s cubic-bezier(1, 0, 1, 1) 3.4s infinite;
        }

        @keyframes circle12Animation {
          0%, 96%, 100% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          10% { transform: translate(-50%, -50%) rotate(45deg); }
          25% { transform: translate(-50%, -50%) rotate(-45deg); }
          30% { opacity: 1; }
          35% { transform: translate(-50%, -50%) rotate(50deg); opacity: 0; }
          93% { transform: translate(-50%, -50%) rotate(-90deg); opacity: 0; }
        }

        .circle-13 {
          width: 100px;
          height: 100px;
          transform: translate(-50%, -50%);
          animation: circleFadeIn 0.8s ease 2.7s forwards,
                     circle13AnimationSize 4s cubic-bezier(1, 0, 1, 1) 3.5s infinite,
                     circle13AnimationView 4s ease 3.5s infinite;
        }

        .circle-13::before {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 1px solid rgba(180, 180, 180, 0.6);
          transform: translate(-50%, -50%);
        }

        .circle-13::after {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1px solid rgba(180, 180, 180, 0.4);
          transform: translate(-50%, -50%);
        }

        @keyframes circle13AnimationSize {
          0%, 32%, 86%, 100% { transform: translate(-50%, -50%) scale(1); }
          38%, 82% { transform: translate(-50%, -50%) scale(0.2); }
        }

        @keyframes circle13AnimationView {
          0%, 5.7%, 7.4%, 9.8%, 11.5%, 14%, 15.6%, 18.9%, 21.3%, 23.8%, 25.4%, 28.7%, 32%, 86%, 91.8%, 93.5%, 97.6%, 100% { opacity: 1; }
          2.5%, 6.6%, 8.2%, 10.7%, 14.8%, 18%, 20.5%, 22.1%, 24.6%, 27.9%, 88.6%, 90.2%, 92.7%, 96.8%, 99.2% { opacity: 0.5; }
          38%, 82% { opacity: 0; }
        }

        .circle-14 {
          width: 100px;
          height: 100px;
          transform: translate(-50%, -50%);
          animation: circleFadeIn 0.8s ease 2.8s forwards,
                     circle13AnimationSize 4s cubic-bezier(1, 0, 1, 1) 3.35s infinite,
                     circle13AnimationView 4s ease 3.35s infinite;
        }

        .circle-14::before {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid rgba(220, 220, 220, 0.6);
          transform: translate(-50%, -50%);
        }

        .circle-14::after {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          border: 1px solid rgba(220, 220, 220, 0.4);
          transform: translate(-50%, -50%);
        }

        .glitch {
          width: 2px;
          height: 2px;
          box-shadow: -21px -75px #d0d0d0, -16px -78px #d0d0d0, -8px -78px #d0d0d0, -5px -77px #d0d0d0, -2px -79px #d0d0d0, 10px -79px #d0d0d0, 25px -73px #d0d0d0, 41px -71px #d0d0d0, 44px -68px #d0d0d0, -26px -72px #d0d0d0, -45px -62px #d0d0d0, -65px -57px #d0d0d0, 59px -49px #d0d0d0, 67px -52px #d0d0d0, 37px -69px #d0d0d0, 43px -62px #d0d0d0, 39px -62px #d0d0d0, 17px -71px #d0d0d0, 28px -67px #d0d0d0, 65px -32px #d0d0d0, 73px -24px #d0d0d0, 67px -25px #d0d0d0, 76px -14px #d0d0d0, 70px -18px #d0d0d0, 82px 21px #d0d0d0, 79px 20px #d0d0d0, 72px 15px #d0d0d0, 55px 45px #d0d0d0, 48px 51px #d0d0d0, 43px 58px #d0d0d0, 37px 57px #d0d0d0, 36px 63px #d0d0d0, 32px 76px #d0d0d0, 35px 70px #d0d0d0, 25px 71px #d0d0d0, 20px 75px #d0d0d0, 5px 70px #d0d0d0, 7px 75px #d0d0d0, -5px 79px #d0d0d0, 3px 78px #d0d0d0, -1px 77px #d0d0d0, -13px 78px #d0d0d0, -15px 82px #d0d0d0, -20px 76px #d0d0d0, -18px 78px #d0d0d0, -17px 75px #d0d0d0, -22px 72px #d0d0d0, -34px 72px #d0d0d0, -36px 69px #d0d0d0, -43px 74px #d0d0d0, -41px 72px #d0d0d0, -42px 69px #d0d0d0, -38px 66px #d0d0d0, -43px 63px #d0d0d0, -37px 61px #d0d0d0, -56px 66px #d0d0d0, -54px 61px #d0d0d0, -58px 54px #d0d0d0, -60px 41px #d0d0d0, -50px 56px #d0d0d0, -54px 57px #d0d0d0, -60px 52px #d0d0d0, -74px 35px #d0d0d0, -76px 18px #d0d0d0, -74px 25px #d0d0d0, -69px 23px #d0d0d0, -84px 13px #d0d0d0, -73px 3px #d0d0d0, -80px -1px #d0d0d0, -79px -4px #d0d0d0, -79px -7px #d0d0d0, -70px -11px #d0d0d0, -67px -23px #d0d0d0, -84px -13px #d0d0d0, -71px -42px #d0d0d0, -61px -49px #d0d0d0, -58px -43px #d0d0d0, -55px -50px #d0d0d0, -32px -72px #d0d0d0, -80px -30px #d0d0d0, -59px -20px #d0d0d0, -79px 12px #d0d0d0, -76px 1px #d0d0d0, 8px 57px #d0d0d0, 59px 36px #d0d0d0, 60px 46px #d0d0d0, 54px 59px #d0d0d0, 44px 52px #d0d0d0, -31px 20px #d0d0d0, -56px 2px #d0d0d0, 47px 35px #d0d0d0, 70px 6px #d0d0d0, 60px -2px #d0d0d0,
            -21px -75px 0 1px rgba(200, 200, 200, 0.3), -16px -78px 0 1px rgba(200, 200, 200, 0.3), -8px -78px 0 1px rgba(200, 200, 200, 0.3), -5px -77px 0 1px rgba(200, 200, 200, 0.3), -2px -79px 0 1px rgba(200, 200, 200, 0.3), 10px -79px 0 1px rgba(200, 200, 200, 0.3), 25px -73px 0 1px rgba(200, 200, 200, 0.3), 41px -71px 0 1px rgba(200, 200, 200, 0.3), 44px -68px 0 1px rgba(200, 200, 200, 0.3), -26px -72px 0 1px rgba(200, 200, 200, 0.3), -45px -62px 0 1px rgba(200, 200, 200, 0.3), -65px -57px 0 1px rgba(200, 200, 200, 0.3), 59px -49px 0 1px rgba(200, 200, 200, 0.3), 67px -52px 0 1px rgba(200, 200, 200, 0.3), 37px -69px 0 1px rgba(200, 200, 200, 0.3), 43px -62px 0 1px rgba(200, 200, 200, 0.3), 39px -62px 0 1px rgba(200, 200, 200, 0.3), 17px -71px 0 1px rgba(200, 200, 200, 0.3), 28px -67px 0 1px rgba(200, 200, 200, 0.3), 65px -32px 0 1px rgba(200, 200, 200, 0.3), 73px -24px 0 1px rgba(200, 200, 200, 0.3), 67px -25px 0 1px rgba(200, 200, 200, 0.3), 76px -14px 0 1px rgba(200, 200, 200, 0.3), 70px -18px 0 1px rgba(200, 200, 200, 0.3), 82px 21px 0 1px rgba(200, 200, 200, 0.3), 79px 20px 0 1px rgba(200, 200, 200, 0.3), 72px 15px 0 1px rgba(200, 200, 200, 0.3), 55px 45px 0 1px rgba(200, 200, 200, 0.3), 48px 51px 0 1px rgba(200, 200, 200, 0.3), 43px 58px 0 1px rgba(200, 200, 200, 0.3), 37px 57px 0 1px rgba(200, 200, 200, 0.3), 36px 63px 0 1px rgba(200, 200, 200, 0.3), 32px 76px 0 1px rgba(200, 200, 200, 0.3), 35px 70px 0 1px rgba(200, 200, 200, 0.3), 25px 71px 0 1px rgba(200, 200, 200, 0.3), 20px 75px 0 1px rgba(200, 200, 200, 0.3), 5px 70px 0 1px rgba(200, 200, 200, 0.3), 7px 75px 0 1px rgba(200, 200, 200, 0.3), -5px 79px 0 1px rgba(200, 200, 200, 0.3), 3px 78px 0 1px rgba(200, 200, 200, 0.3), -1px 77px 0 1px rgba(200, 200, 200, 0.3), -13px 78px 0 1px rgba(200, 200, 200, 0.3), -15px 82px 0 1px rgba(200, 200, 200, 0.3), -20px 76px 0 1px rgba(200, 200, 200, 0.3), -18px 78px 0 1px rgba(200, 200, 200, 0.3), -17px 75px 0 1px rgba(200, 200, 200, 0.3), -22px 72px 0 1px rgba(200, 200, 200, 0.3), -34px 72px 0 1px rgba(200, 200, 200, 0.3), -36px 69px 0 1px rgba(200, 200, 200, 0.3), -43px 74px 0 1px rgba(200, 200, 200, 0.3), -41px 72px 0 1px rgba(200, 200, 200, 0.3), -42px 69px 0 1px rgba(200, 200, 200, 0.3), -38px 66px 0 1px rgba(200, 200, 200, 0.3), -43px 63px 0 1px rgba(200, 200, 200, 0.3), -37px 61px 0 1px rgba(200, 200, 200, 0.3), -56px 66px 0 1px rgba(200, 200, 200, 0.3), -54px 61px 0 1px rgba(200, 200, 200, 0.3), -58px 54px 0 1px rgba(200, 200, 200, 0.3), -60px 41px 0 1px rgba(200, 200, 200, 0.3), -50px 56px 0 1px rgba(200, 200, 200, 0.3), -54px 57px 0 1px rgba(200, 200, 200, 0.3), -60px 52px 0 1px rgba(200, 200, 200, 0.3), -74px 35px 0 1px rgba(200, 200, 200, 0.3), -76px 18px 0 1px rgba(200, 200, 200, 0.3), -74px 25px 0 1px rgba(200, 200, 200, 0.3), -69px 23px 0 1px rgba(200, 200, 200, 0.3), -84px 13px 0 1px rgba(200, 200, 200, 0.3), -73px 3px 0 1px rgba(200, 200, 200, 0.3), -80px -1px 0 1px rgba(200, 200, 200, 0.3), -79px -4px 0 1px rgba(200, 200, 200, 0.3), -79px -7px 0 1px rgba(200, 200, 200, 0.3), -70px -11px 0 1px rgba(200, 200, 200, 0.3), -67px -23px 0 1px rgba(200, 200, 200, 0.3), -84px -13px 0 1px rgba(200, 200, 200, 0.3), -71px -42px 0 1px rgba(200, 200, 200, 0.3), -61px -49px 0 1px rgba(200, 200, 200, 0.3), -58px -43px 0 1px rgba(200, 200, 200, 0.3), -55px -50px 0 1px rgba(200, 200, 200, 0.3), -32px -72px 0 1px rgba(200, 200, 200, 0.3), -80px -30px 0 1px rgba(200, 200, 200, 0.3), -59px -20px 0 1px rgba(200, 200, 200, 0.3), -79px 12px 0 1px rgba(200, 200, 200, 0.3), -76px 1px 0 1px rgba(200, 200, 200, 0.3), 8px 57px 0 1px rgba(200, 200, 200, 0.3), 59px 36px 0 1px rgba(200, 200, 200, 0.3), 60px 46px 0 1px rgba(200, 200, 200, 0.3), 54px 59px 0 1px rgba(200, 200, 200, 0.3), 44px 52px 0 1px rgba(200, 200, 200, 0.3), -31px 20px 0 1px rgba(200, 200, 200, 0.3), -56px 2px 0 1px rgba(200, 200, 200, 0.3), 47px 35px 0 1px rgba(200, 200, 200, 0.3), 70px 6px 0 1px rgba(200, 200, 200, 0.3), 60px -2px 0 1px rgba(200, 200, 200, 0.3);
          filter: blur(1px);
          opacity: 0;
          animation: circleFadeIn 0.8s ease 2.9s forwards,
                     glitchAnimationOpacity 4s cubic-bezier(1, 0, 1, 1) 3.7s infinite,
                     glitchAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.7s infinite,
                     glitchAnimationBright 4s cubic-bezier(1, 0, 1, 1) 3.7s infinite;
        }

        @keyframes glitchAnimationOpacity {
          0%, 30%, 96%, 100% { opacity: 1; }
          35%, 93% { opacity: 0; }
        }

        @keyframes glitchAnimationMove {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          35%, 65% { transform: translate(-50%, -50%) rotate(4320deg); }
        }

        @keyframes glitchAnimationBright {
          0%, 100% { filter: blur(1px); }
          35%, 65% { filter: blur(1px) brightness(1.3); }
        }

        /* Fragments */
        .fragment-1, .fragment-2, .fragment-3 {
          opacity: 0;
          animation: circleFadeIn 0.8s ease 3s forwards;
        }

        .fragment-1::before {
          width: 6px;
          height: 6px;
          border: 2px solid rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment1BeforeAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment1BeforeAnimationMove {
          0%, 100% { transform: rotate(0deg) translate(71px, -181px); opacity: 1; }
          37% { transform: rotate(15deg) translate(71px, -181px); opacity: 1; }
          37.1%, 76.9% { opacity: 0; }
          77% { transform: rotate(-2deg) translate(71px, -181px); opacity: 1; }
          90% { transform: rotate(-9deg) translate(71px, -181px); }
        }

        .fragment-1::after {
          width: 6px;
          height: 6px;
          border: 2px solid rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment1AfterAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment1AfterAnimationMove {
          0%, 100% { transform: rotate(0deg) translate(285px, 48px); opacity: 1; }
          7% { transform: rotate(5deg) translate(285px, 48px); }
          22% { transform: rotate(-1deg) translate(285px, 48px); }
          40% { transform: rotate(-3deg) translate(285px, 48px); opacity: 1; }
          40.1%, 81.9% { opacity: 0; }
          82% { transform: rotate(-15deg) translate(285px, 48px); opacity: 1; }
        }

        .fragment-2::after {
          width: 6px;
          height: 6px;
          border: 2px solid rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment2AfterAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment2AfterAnimationMove {
          0%, 100% { transform: rotate(0deg) translate(-220px, 162px); opacity: 1; }
          46% { transform: rotate(-8deg) translate(-220px, 162px); opacity: 1; }
          46.1%, 97.9% { opacity: 0; }
          98% { transform: rotate(2deg) translate(-220px, 162px); opacity: 1; }
        }

        .fragment-2::before {
          width: 6px;
          height: 6px;
          border: 2px solid rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment2BeforeAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment2BeforeAnimationMove {
          0%, 100% { transform: rotate(0deg) translate(284px, 111px); opacity: 1; }
          2% { transform: rotate(2deg) translate(284px, 111px); }
          9% { transform: rotate(-5deg) translate(284px, 111px); }
          15%, 22% { transform: rotate(-3deg) translate(284px, 111px); }
          27% { transform: rotate(-2deg) translate(284px, 111px); opacity: 1; }
          38.9% { transform: rotate(-9deg) translate(284px, 111px); }
          39%, 76.9% { opacity: 0; }
          77% { transform: rotate(-9deg) translate(284px, 111px); opacity: 1; }
        }

        .fragment-3::after {
          width: 6px;
          height: 6px;
          background: rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment3AfterAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment3AfterAnimationMove {
          0%, 4.9%, 65.1%, 100% { opacity: 0; }
          5% { transform: rotate(0deg) translate(183px, 198px); opacity: 1; }
          16% { transform: rotate(-9deg) translate(284px, 111px); opacity: 1; }
          16.1%, 60.9% { opacity: 0; }
          61% { transform: rotate(5deg) translate(284px, 111px); opacity: 1; }
          65% { transform: rotate(10deg) translate(284px, 111px); opacity: 1; }
        }

        .fragment-3::before {
          width: 6px;
          height: 6px;
          background: rgba(180, 180, 180, 0.5);
          border-radius: 2px;
          animation: fragment3BeforeAnimationMove 4s cubic-bezier(1, 0, 1, 1) 3.85s infinite;
        }

        @keyframes fragment3BeforeAnimationMove {
          0%, 100% { transform: rotate(0deg) translate(-253px, -126px); opacity: 1; }
          22% { transform: rotate(25deg) translate(-253px, -126px); opacity: 1; }
          22.1%, 95.9% { opacity: 0; }
          96% { transform: rotate(-5deg) translate(-253px, -126px); opacity: 1; }
        }
      `}</style>
        </>
    )
}

export default SearchToEyeTransition
