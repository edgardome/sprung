import React from 'react'
import type { Cue } from '../types'

function ArrowSvg({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
  const rotations: Record<string, number> = { up: 0, down: 180, left: -90, right: 90 }

  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        width: 'min(65vw, 65vh)',
        height: 'min(65vw, 65vh)',
        transform: `rotate(${rotations[direction]}deg)`,
        transition: 'transform 0.3s ease',
      }}
    >
      <polygon
        points="50,10 95,70 75,70 75,90 25,90 25,70 5,70"
        fill="#000000"
        stroke="#ffffff"
        strokeWidth="3"
      />
    </svg>
  )
}

interface CueDisplayProps {
  cue: Cue | null
  animKey: number
}

export const CueDisplay: React.FC<CueDisplayProps> = ({ cue, animKey }) => {
  if (!cue) return null

  const content = (() => {
    switch (cue.kind) {
      case 'arrow':
        return <ArrowSvg direction={cue.value} />
      case 'color':
        return (
          <div
            style={{
              width: 'min(60vw, 60vh)',
              height: 'min(60vw, 60vh)',
              borderRadius: '50%',
              backgroundColor: cue.value,
              boxShadow: `0 0 80px ${cue.value}`,
            }}
          />
        )
      case 'number':
        return (
          <span
            style={{
              fontSize: 'min(30vw, 30vh)',
              fontWeight: 900,
              color: '#00ff88',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {cue.value}
          </span>
        )
    }
  })()

  return (
    <div
      key={animKey}
      className="cue-enter"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      {content}
    </div>
  )
}
