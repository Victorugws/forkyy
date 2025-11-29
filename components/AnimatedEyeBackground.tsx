'use client'

import React from "react"

export function AnimatedEyeBackground() {
    return (
        <div
            className="container"
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                minHeight: "600px",
                background: "#f5f5f5",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                    top: 0,
                    left: 0,
                }}
            >
                <source src="/videos/eyeanimationvideo.mov" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

export default AnimatedEyeBackground
