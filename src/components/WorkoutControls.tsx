import React from 'react'

interface WorkoutControlsProps {
  isRunning: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isRunning,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div className="workout-controls">
      {isRunning ? (
        <button className="btn" onClick={onPause}>
          ⏸ Pause
        </button>
      ) : (
        <button className="btn" onClick={onResume}>
          ▶ Resume
        </button>
      )}
      <button className="btn btn-danger" onClick={onStop}>
        ⏹ Stop
      </button>
    </div>
  )
}
