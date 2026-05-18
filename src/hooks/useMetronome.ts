import { useState, useCallback, useRef, useEffect } from 'react'
import { playClick } from '../utils/audio'
import type { MetronomeConfig } from '../types'

export function useMetronome(config: MetronomeConfig) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [flashTrigger, setFlashTrigger] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const beatRef = useRef(0)

  const intervalMs = 60_000 / config.bpm

  const tick = useCallback(() => {
    const isAccent = beatRef.current % config.beatsPerMeasure === 0
    playClick(isAccent)
    setCurrentBeat(beatRef.current % config.beatsPerMeasure)
    setFlashTrigger((n) => n + 1)
    beatRef.current += 1
  }, [config.beatsPerMeasure])

  const start = useCallback(() => {
    beatRef.current = 0
    setCurrentBeat(0)
    setIsRunning(true)
    tick()
    intervalRef.current = window.setInterval(tick, intervalMs)
  }, [intervalMs, tick])

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setCurrentBeat(0)
    beatRef.current = 0
  }, [])

  useEffect(() => {
    if (isRunning) {
      stop()
      start()
    }
  }, [config.bpm, config.beatsPerMeasure])

  useEffect(() => () => stop(), [stop])

  return { isRunning, currentBeat, flashTrigger, start, stop }
}
