import React from 'react'

interface SpeedControlProps {
  intervalMs: number
  variableSpeed: boolean
  variableSpeedMin: number
  variableSpeedMax: number
  onIntervalChange: (ms: number) => void
  onVariableSpeedChange: (enabled: boolean) => void
  onVariableSpeedMinChange: (ms: number) => void
  onVariableSpeedMaxChange: (ms: number) => void
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  intervalMs,
  variableSpeed,
  variableSpeedMin,
  variableSpeedMax,
  onIntervalChange,
  onVariableSpeedChange,
  onVariableSpeedMinChange,
  onVariableSpeedMaxChange,
}) => {
  const intervalSec = intervalMs / 1000
  const bpm = Math.round(60 / intervalSec)

  return (
    <div className="speed-control">
      <label className="label">
        Interval: {intervalSec.toFixed(1)}s ({bpm} bpm)
      </label>
      <input
        type="range"
        min={300}
        max={20000}
        step={100}
        value={intervalMs}
        onChange={(e) => onIntervalChange(Number(e.target.value))}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={variableSpeed}
          onChange={(e) => onVariableSpeedChange(e.target.checked)}
        />
        Variable speed (random interval)
      </label>

      {variableSpeed && (
        <div className="speed-variable">
          <div>
            <label className="label label-sm">
              Min: {(variableSpeedMin / 1000).toFixed(1)}s
            </label>
            <input
              type="range"
              min={200}
              max={variableSpeedMax}
              step={100}
              value={variableSpeedMin}
              onChange={(e) => onVariableSpeedMinChange(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label label-sm">
              Max: {(variableSpeedMax / 1000).toFixed(1)}s
            </label>
            <input
              type="range"
              min={variableSpeedMin}
              max={20000}
              step={100}
              value={variableSpeedMax}
              onChange={(e) => onVariableSpeedMaxChange(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  )
}
