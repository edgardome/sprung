import { useState, useCallback, useRef, useEffect } from 'react'
import { playClick } from '../utils/audio'
import type { MetronomeConfig } from '../types'

export function useMetronome(config: MetronomeConfig) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [flashTrigger, setFlashTrigger] = useState(0)
  const timeoutRef = useRef<number | null>(null)
  const beatRef = useRef(0)

  const intervalMs = 60_000 / config.bpm

  const tick = useCallback(() => {
    const isAccent = beatRef.current % config.beatsPerMeasure === 0
    playClick(isAccent)
    setCurrentBeat(beatRef.current % config.beatsPerMeasure)
    setFlashTrigger((n) => n + 1)
    beatRef.current += 1
  }, [config.beatsPerMeasure])

  const schedule = useCallback(() => {
    tick()
    timeoutRef.current = window.setTimeout(schedule, intervalMs)
  }, [intervalMs, tick])

  const start = useCallback(() => {
    beatRef.current = 0
    setCurrentBeat(0)
    setIsRunning(true)
    tick()
    timeoutRef.current = window.setTimeout(schedule, intervalMs)
  }, [intervalMs, tick, schedule])

  const stop = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsRunning(false)
    setCurrentBeat(0)
    beatRef.current = 0
  }, [])

  useEffect(() => () => stop(), [stop])

  return { isRunning, currentBeat, flashTrigger, start, stop }
}
