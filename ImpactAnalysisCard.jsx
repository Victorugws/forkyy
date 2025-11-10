import React, { useState, useEffect } from "react"

/**
 * NEUMORPHIC IMPACT ANALYSIS CARD (All whites unified to #f5f5f5)
 * Matches screen recording design
 * For use in Framer as a Code Component
 */

export function ImpactAnalysisCard(props) {
    const {
        project1Label = "PROJECT 1",
        project2Label = "PROJECT 2",
        project3Label = "PROJECT 3",

        project1Title = "MedixCare — AI Triage Assistant for Healthcare",
        project1Description = "We built a custom AI triage assistant that evaluates symptoms and routes patients to the appropriate care level.",
        project1Metric1 = 40,
        project1Metric1Label = "Reduced average wait",
        project1Metric2 = 30,
        project1Metric2Label = "Rise in patient satisfaction",
        project1Image = null,

        project2Title = "Let AI Analyze",
        project2Description = "Upload your marketing data or integrate your CRM, social media, and email platforms. Our AI analyzes patterns.",
        project2Metric1 = 75,
        project2Metric1Label = "Accuracy rate",
        project2Metric2 = 85,
        project2Metric2Label = "Happy customers",
        project2Image = null,

        project3Title = "Get Actionable Insights",
        project3Description = "Receive comprehensive reports with data-driven recommendations. Make informed decisions backed by AI analysis.",
        project3Metric1 = 90,
        project3Metric1Label = "Faster decisions",
        project3Metric2 = 70,
        project3Metric2Label = "Cost reduction",
        project3Image = null,
    } = props

    const [activeTab, setActiveTab] = useState(0)
    const [animatedMetric1, setAnimatedMetric1] = useState(0)
    const [animatedMetric2, setAnimatedMetric2] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const link = document.createElement("link")
        link.href =
            "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap"
        link.rel = "stylesheet"
        document.head.appendChild(link)
    }, [])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const projectData = [
        {
            title: project1Title,
            description: project1Description,
            metric1: project1Metric1,
            metric1Label: project1Metric1Label,
            metric2: project1Metric2,
            metric2Label: project1Metric2Label,
            image: project1Image,
        },
        {
            title: project2Title,
            description: project2Description,
            metric1: project2Metric1,
            metric1Label: project2Metric1Label,
            metric2: project2Metric2,
            metric2Label: project2Metric2Label,
            image: project2Image,
        },
        {
            title: project3Title,
            description: project3Description,
            metric1: project3Metric1,
            metric1Label: project3Metric1Label,
            metric2: project3Metric2,
            metric2Label: project3Metric2Label,
            image: project3Image,
        },
    ]

    const tabs = [project1Label, project2Label, project3Label]
    const currentProject = projectData[activeTab]

    useEffect(() => {
        const targetMetric1 = currentProject.metric1
        const targetMetric2 = currentProject.metric2
        setAnimatedMetric1(0)
        setAnimatedMetric2(0)
        const duration = 1500
        const steps = 60
        const metric1Step = targetMetric1 / steps
        const metric2Step = targetMetric2 / steps
        let currentStep = 0
        const timer = setInterval(() => {
            currentStep++
            setAnimatedMetric1(Math.floor(metric1Step * currentStep))
            setAnimatedMetric2(Math.floor(metric2Step * currentStep))
            if (currentStep >= steps) {
                setAnimatedMetric1(targetMetric1)
                setAnimatedMetric2(targetMetric2)
                clearInterval(timer)
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [activeTab, currentProject])

    const calculatorDisplayStyle = {
        background:
            "linear-gradient(180deg, #c8d4c0 0%, #bcc9b5 50%, #b5c2ae 100%)",
        boxShadow: `
            inset 0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 -2px 4px rgba(245, 245, 245, 0.1),
            inset 2px 2px 4px rgba(0, 0, 0, 0.08),
            inset -2px -2px 4px rgba(245, 245, 245, 0.08),
            0 1px 0 rgba(245, 245, 245, 0.2)
        `,
        border: "1px solid rgba(180, 195, 175, 0.8)",
    }

    const LCDMetric = ({ value, label }) => (
        <div>
            <div
                style={{
                    ...calculatorDisplayStyle,
                    padding: isMobile ? "12px" : "16px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    marginBottom: "8px",
                    background: "#f5f5f5",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: `
                            repeating-linear-gradient(
                                0deg,
                                transparent,
                                transparent 2px,
                                rgba(0, 0, 0, 0.02) 2px,
                                rgba(0, 0, 0, 0.02) 4px
                            )
                        `,
                        opacity: 0.3,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: isMobile ? "12px" : "16px",
                        pointerEvents: "none",
                        fontFamily: "'Orbitron', monospace",
                        fontSize: isMobile ? "1.5rem" : "2rem",
                        fontWeight: "900",
                        color: "rgba(160, 175, 155, 0.25)",
                        letterSpacing: "0.2em",
                    }}
                >
                    888
                </div>
                <div style={{ position: "relative", textAlign: "right" }}>
                    <div
                        style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: isMobile ? "1.5rem" : "2rem",
                            fontWeight: "900",
                            color: "#2c3e2f",
                            textShadow: `
                                0 1px 0 rgba(0, 0, 0, 0.3),
                                1px 1px 2px rgba(0, 0, 0, 0.2)
                            `,
                            letterSpacing: "0.2em",
                            lineHeight: "1",
                        }}
                    >
                        {value}
                        <span
                            style={{
                                fontSize: isMobile ? "1.2rem" : "1.5rem",
                                marginLeft: "0.1em",
                            }}
                        >
                            %
                        </span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    fontSize: isMobile ? "11px" : "12px",
                    fontWeight: "400",
                    textAlign: "center",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                }}
            >
                {label}
            </div>
        </div>
    )

    return (
        <div
            style={{
                boxSizing: "border-box",
                width: "1000px",
                height: "min-content",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "20px",
                boxShadow: `
                    0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
                    0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
                    0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
                    0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
                    0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
                    0px 30px 30px -4px rgba(0, 0, 0, 0.02),
                    inset 0px 3px 1px 0px rgb(255, 255, 255)
                `,
                backgroundColor: "#f5f5f5",
                overflow: "visible",
                alignContent: "flex-start",
                flexWrap: "nowrap",
                gap: "20px",
                position: "absolute",
                borderRadius: "20px",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div style={{ width: "100%" }}>
                <div style={{ marginBottom: "40px" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: isMobile ? "8px" : "16px",
                            justifyContent: "center",
                            flexWrap: "nowrap",
                        }}
                    >
                        {tabs.map((label, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                style={{
                                    cursor: "pointer",
                                    padding: isMobile
                                        ? "12px 16px"
                                        : "16px 40px",
                                    background: "#f5f5f5",
                                    border: "none",
                                    borderRadius: "16px",
                                    fontSize: isMobile ? "11px" : "13px",
                                    fontWeight: "500",
                                    color:
                                        activeTab === index
                                            ? "#1f2937"
                                            : "#9ca3af",
                                    letterSpacing: "0.05em",
                                    flex: "1 1 0",
                                    minWidth: isMobile ? "0" : "140px",
                                    whiteSpace: "nowrap",
                                    boxShadow:
                                        activeTab === index
                                            ? "6px 6px 12px rgba(163, 177, 198, 0.4), -6px -6px 12px rgba(245, 245, 245, 0.8), inset 2px 2px 4px rgba(245, 245, 245, 0.5)"
                                            : "3px 3px 6px rgba(163, 177, 198, 0.2), -3px -3px 6px rgba(245, 245, 245, 0.5)",
                                    transform:
                                        activeTab === index
                                            ? "translateY(-1px)"
                                            : "translateY(0)",
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "40px",
                    }}
                >
                    <div>
                        {currentProject.image ? (
                            <img
                                src={currentProject.image}
                                alt={currentProject.title}
                                style={{
                                    width: "100%",
                                    height: isMobile ? "300px" : "450px",
                                    objectFit: "cover",
                                    borderRadius: "24px",
                                    boxShadow:
                                        "8px 8px 16px rgba(163, 177, 198, 0.4), -4px -4px 12px rgba(245, 245, 245, 0.3)",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: isMobile ? "300px" : "450px",
                                    borderRadius: "24px",
                                    background: "#f5f5f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                        "inset 4px 4px 8px rgba(163, 177, 198, 0.3), inset -4px -4px 8px rgba(245, 245, 245, 0.5)",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: isMobile ? "80px" : "120px",
                                        fontWeight: "700",
                                        color: "#9ca3af",
                                    }}
                                >
                                    {activeTab + 1}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ paddingTop: "8px" }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#6b7280",
                                marginBottom: "24px",
                                letterSpacing: "0.05em",
                            }}
                        >
                            0{activeTab + 1}
                        </div>

                        <h3
                            style={{
                                fontSize: isMobile ? "24px" : "32px",
                                fontWeight: "600",
                                color: "#1f2937",
                                marginBottom: "24px",
                                lineHeight: "1.3",
                                margin: "0 0 24px 0",
                            }}
                        >
                            {currentProject.title}
                        </h3>

                        <p
                            style={{
                                fontSize: "15px",
                                fontWeight: "400",
                                color: "#6b7280",
                                lineHeight: "1.7",
                                margin: "0 0 40px 0",
                            }}
                        >
                            {currentProject.description}
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: isMobile ? "12px" : "20px",
                            }}
                        >
                            <LCDMetric
                                value={animatedMetric1}
                                label={currentProject.metric1Label}
                            />
                            <LCDMetric
                                value={animatedMetric2}
                                label={currentProject.metric2Label}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

ImpactAnalysisCard.displayName = "Impact Analysis Card"
