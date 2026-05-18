import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ExerciseConfig, Cue } from '../types'
import { useCueSequence } from '../hooks/useCueSequence'
import { useTimer } from '../hooks/useTimer'
import { CueDisplay } from '../components/CueDisplay'
import { ProgressBar } from '../components/ProgressBar'
import { WorkoutControls } from '../components/WorkoutControls'

export const Workout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const config = location.state as ExerciseConfig | null

  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [index, setIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [currentInterval, setCurrentInterval] = useState(
    config?.intervalMs ?? 1000,
  )

  const { sequence, regenerate } = useCueSequence(config ?? { items: [], intervalMs: 1000, variableSpeed: false, variableSpeedMin: 500, variableSpeedMax: 2000, mixedMode: 'all' })
  const sequenceRef = useRef(sequence)
  const sequenceIndexRef = useRef(0)

  useEffect(() => {
    sequenceRef.current = sequence
  }, [sequence])

  const getNextInterval = useCallback(() => {
    if (!config?.variableSpeed) return config?.intervalMs ?? 1000
    const min = config.variableSpeedMin
    const max = config.variableSpeedMax
    return min + Math.random() * (max - min)
  }, [config])

  const advance = useCallback(() => {
    const seq = sequenceRef.current
    const nextIdx = sequenceIndexRef.current + 1

    if (nextIdx >= seq.length) {
      setFinished(true)
      return
    }

    sequenceIndexRef.current = nextIdx
    setIndex(nextIdx)
    setAnimKey((k) => k + 1)

    const interval = getNextInterval()
    setCurrentInterval(interval)
  }, [getNextInterval])

  const currentCue: Cue | null =
    sequence.length > 0 && index < sequence.length ? sequence[index] : null

  const { isRunning, start, pause, resume, stop } = useTimer(advance, currentInterval)

  const handleStart = useCallback(() => {
    const seq = regenerate()
    sequenceRef.current = seq
    sequenceIndexRef.current = 0
    setIndex(0)
    setFinished(false)
    setStarted(true)
    setAnimKey(0)
    const interval = getNextInterval()
    setCurrentInterval(interval)
    setTimeout(() => start(), 0)
  }, [regenerate, getNextInterval, start])

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
      {!started && !finished && (
        <div className="workout-ready">
          <p className="workout-ready-text">
            {sequence.length} workouts ready. Press Start.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            ▶ Start
          </button>
        </div>
      )}

      {started && !finished && (
        <>
          <CueDisplay cue={currentCue} animKey={animKey} />
          <ProgressBar current={index + 1} total={sequence.length} />
          <WorkoutControls
            isRunning={isRunning}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </>
      )}

      {finished && (
        <div className="workout-done">
          <p className="workout-done-text">Workout Complete!</p>
          <p className="workout-done-sub">{sequence.length} workouts completed</p>
          <div className="workout-done-actions">
            <button className="btn btn-primary" onClick={handleStart}>
              🔄 Repeat
            </button>
            <button className="btn" onClick={() => navigate('/configure')}>
              ⚙ Configure
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
