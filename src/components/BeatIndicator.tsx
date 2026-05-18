import React from 'react'

interface BeatIndicatorProps {
  beat: number
  beatsPerMeasure: number
  flashTrigger: number
  isRunning: boolean
}

export const BeatIndicator: React.FC<BeatIndicatorProps> = ({
  beat,
  beatsPerMeasure,
  flashTrigger,
  isRunning,
}) => {
  return (
    <div className="beat-indicator">
      {Array.from({ length: beatsPerMeasure }, (_, i) => (
        <div
          key={i}
          className={`beat-dot ${i === 0 ? 'beat-accent' : ''} ${
            isRunning && i === beat ? 'beat-active' : ''
          }`}
        />
      ))}
      <div
        key={flashTrigger}
        className={`beat-flash ${isRunning ? 'beat-flash-on' : ''}`}
      />
    </div>
  )
}
