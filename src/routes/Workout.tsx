import React, { useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ExerciseConfig, Cue } from '../types'
import { useCueSequence } from '../hooks/useCueSequence'
import { useTimer } from '../hooks/useTimer'
import { CueDisplay } from '../components/CueDisplay'
import { WorkoutControls } from '../components/WorkoutControls'

export const Workout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const config = location.state as ExerciseConfig | null

  const [started, setStarted] = useState(false)
  const [currentCue, setCurrentCue] = useState<Cue | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const [currentInterval, setCurrentInterval] = useState(
    config?.intervalMs ?? 1000,
  )

  const defaultConfig: ExerciseConfig = config ?? {
    items: [],
    intervalMs: 1000,
    variableSpeed: false,
    variableSpeedMin: 500,
    variableSpeedMax: 2000,
    mixedMode: 'all',
  }

  const { pickRandom, cueCount } = useCueSequence(defaultConfig)

  const getNextInterval = useCallback(() => {
    if (!config?.variableSpeed) return config?.intervalMs ?? 1000
    const min = config.variableSpeedMin
    const max = config.variableSpeedMax
    return min + Math.random() * (max - min)
  }, [config])

  const advance = useCallback(() => {
    setCurrentCue(pickRandom())
    setAnimKey((k) => k + 1)
    setCurrentInterval(getNextInterval())
  }, [pickRandom, getNextInterval])

  const { isRunning, start, pause, resume, stop } = useTimer(advance, currentInterval)

  const handleStart = useCallback(() => {
    setStarted(true)
    setCurrentCue(pickRandom())
    setAnimKey(0)
    setCurrentInterval(getNextInterval())
    setTimeout(() => start(), 0)
  }, [pickRandom, getNextInterval, start])

  const handlePause = useCallback(() => {
    pause()
  }, [pause])

  const handleResume = useCallback(() => {
    resume()
  }, [resume])

  const handleStop = useCallback(() => {
    stop()
    navigate('/configure')
  }, [stop, navigate])

  useEffect(() => {
    if (!config) navigate('/')
  }, [config, navigate])

  if (!config) return null

  return (
    <div className="workout">
      {!started && (
        <div className="workout-ready">
          <p className="workout-ready-text">
            {cueCount} exercise type{cueCount !== 1 ? 's' : ''} ready. Press Start.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            Start
          </button>
        </div>
      )}

      {started && (
        <>
          <CueDisplay cue={currentCue} animKey={animKey} />
          <WorkoutControls
            isRunning={isRunning}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </>
      )}
    </div>
  )
}
