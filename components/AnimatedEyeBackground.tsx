'use client'

interface AnimatedEyeBackgroundProps {
  isListening?: boolean
}

export function AnimatedEyeBackground({ isListening = false }: AnimatedEyeBackgroundProps) {
    // In extension context, use extension-relative path
    const isExtension = typeof browser !== 'undefined' && browser.runtime?.id
    const videoPath = isExtension 
      ? browser.runtime.getURL('public/videos/fffffanimation.mov')
      : '/videos/fffffanimation.mov'
    
    return (
        <div
            className="container"
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                minHeight: "600px",
                background: "#ffffff",
                overflow: "hidden",
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: "calc(-14.29% + 30px)",
                    left: 0,
                }}
            >
                <source src={videoPath} type="video/quicktime" />
                <source src={videoPath} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Voice Sensor Glow - Behind center of iris - Glowing Orb - Only active during voice input */}
            {isListening && (
                <>
                    {/* Outer glow layer */}
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(50% - 13.86% + 30px)",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(251, 146, 60, 0.6) 20%, rgba(251, 146, 60, 0.3) 40%, transparent 70%)",
                            filter: "blur(20px)",
                            zIndex: 1,
                            animation: "voiceGlowPulse 3s ease-in-out infinite",
                            pointerEvents: "none",
                        }}
                    />
                    {/* Bright center core */}
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(50% - 13.86% + 30px)",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(251, 146, 60, 1) 0%, rgba(251, 146, 60, 0.9) 30%, rgba(251, 146, 60, 0.5) 60%, transparent 100%)",
                            filter: "blur(8px)",
                            zIndex: 2,
                            animation: "voiceGlowPulse 3s ease-in-out infinite",
                            pointerEvents: "none",
                        }}
                    />
                </>
            )}
            
            <style jsx>{`
                @keyframes voiceGlowPulse {
                    0%, 100% {
                        opacity: 0.6;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 0.9;
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                }
            `}</style>
        </div>
    )
}

export default AnimatedEyeBackground
