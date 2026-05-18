import React from 'react'

interface ProgressBarProps {
  current: number
  total: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      <span className="progress-bar-text">
        {current} / {total}
      </span>
    </div>
  )
}
