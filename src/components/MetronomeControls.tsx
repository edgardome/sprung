import React from 'react'

interface MetronomeControlsProps {
  bpm: number
  beatsPerMeasure: number
  isRunning: boolean
  onBpmChange: (bpm: number) => void
  onBeatsPerMeasureChange: (n: number) => void
  onStart: () => void
  onStop: () => void
}

export const MetronomeControls: React.FC<MetronomeControlsProps> = ({
  bpm,
  beatsPerMeasure,
  isRunning,
  onBpmChange,
  onBeatsPerMeasureChange,
  onStart,
  onStop,
}) => {
  return (
    <div className="metronome-controls">
      <div className="metronome-bpm-display">{bpm} BPM</div>

      <div className="metronome-slider">
        <input
          type="range"
          min={30}
          max={240}
          step={1}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          disabled={isRunning}
        />
        <div className="metronome-slider-labels">
          <span>30</span>
          <span>BPM</span>
          <span>240</span>
        </div>
      </div>

      <div className="metronome-timesig">
        <label className="label">Time Signature</label>
        <div className="btn-group">
          {[2, 3, 4, 6].map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${beatsPerMeasure === n ? 'btn-active' : ''}`}
              onClick={() => onBeatsPerMeasureChange(n)}
              disabled={isRunning}
            >
              {n}/4
            </button>
          ))}
        </div>
      </div>

      <div className="metronome-actions">
        {!isRunning ? (
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            ▶ Start
          </button>
        ) : (
          <button className="btn btn-danger btn-lg" onClick={onStop}>
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  )
}
