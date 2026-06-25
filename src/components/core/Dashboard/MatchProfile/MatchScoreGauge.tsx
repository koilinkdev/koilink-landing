"use client"

import React from "react"

type MatchScoreGaugeProps = {
  /** 0–100 fit score. */
  value: number
  size?: number
  stroke?: number
  /** Compact variant hides the "fit" caption. */
  compact?: boolean
}

/**
 * Lightweight SVG ring gauge for the match/fit score. No deps — the arc length
 * is the stroke-dashoffset of a circle. Colour shifts warm→teal as score rises.
 */
const MatchScoreGauge = React.memo(function MatchScoreGauge({
  value,
  size = 92,
  stroke = 8,
  compact = false,
}: MatchScoreGaugeProps) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeValue / 100) * circumference
  const arcColor = safeValue >= 70 ? "#109DA4" : safeValue >= 45 ? "#3066be" : "#F5A623"

  return (
    <div
      className="scoreGauge"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${safeValue}% fit score`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(109, 157, 197, 0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={arcColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="scoreGaugeLabel">
        <span className="scoreGaugeValue" style={{ color: arcColor }}>
          {safeValue}%
        </span>
        {!compact && <span className="scoreGaugeCaption">fit</span>}
      </div>
    </div>
  )
})

export default MatchScoreGauge
