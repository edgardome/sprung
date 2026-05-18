import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetronome } from '../hooks/useMetronome'
import { MetronomeControls } from '../components/MetronomeControls'
import { BeatIndicator } from '../components/BeatIndicator'
import { initAudio } from '../utils/audio'

export const Metronome: React.FC = () => {
  const navigate = useNavigate()
  const [bpm, setBpm] = useState(120)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)

  const { isRunning, currentBeat, flashTrigger, start, stop } = useMetronome({
    bpm,
    beatsPerMeasure,
  })

  const handleStart = useCallback(() => {
    initAudio()
    start()
  }, [start])

  const handleStop = useCallback(() => {
    stop()
  }, [stop])

  return (
    <div className="metronome">
      <h1 className="page-title">Metronome</h1>

      <BeatIndicator
        beat={currentBeat}
        beatsPerMeasure={beatsPerMeasure}
        flashTrigger={flashTrigger}
        isRunning={isRunning}
      />

      <MetronomeControls
        bpm={bpm}
        beatsPerMeasure={beatsPerMeasure}
        isRunning={isRunning}
        onBpmChange={setBpm}
        onBeatsPerMeasureChange={setBeatsPerMeasure}
        onStart={handleStart}
        onStop={handleStop}
      />

      <div className="configure-actions">
        <button className="btn btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    </div>
  )
}
