import { useState, useEffect, useCallback, useRef } from 'react'

export function useTimer(
  callback: () => void,
  intervalMs: number,
): {
  isRunning: boolean
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
} {
  const [isRunning, setIsRunning] = useState(false)
  const callbackRef = useRef(callback)
  const intervalRef = useRef<number | null>(null)
  const nextTickRef = useRef<number>(0)
  const remainingRef = useRef<number>(intervalMs)

  callbackRef.current = callback

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const scheduleNext = useCallback(() => {
    const now = performance.now()
    nextTickRef.current = now + intervalMs

    intervalRef.current = window.setTimeout(() => {
      callbackRef.current()
      scheduleNext()
    }, intervalMs)
  }, [intervalMs])

  const start = useCallback(() => {
    clear()
    setIsRunning(true)
    remainingRef.current = intervalMs
    scheduleNext()
  }, [clear, intervalMs, scheduleNext])

  const pause = useCallback(() => {
    clear()
    const elapsed = performance.now() - (nextTickRef.current - intervalMs)
    remainingRef.current = Math.max(0, intervalMs - elapsed)
    setIsRunning(false)
  }, [clear, intervalMs])

  const resume = useCallback(() => {
    setIsRunning(true)
    intervalRef.current = window.setTimeout(() => {
      callbackRef.current()
      scheduleNext()
    }, remainingRef.current)
  }, [scheduleNext])

  const stop = useCallback(() => {
    clear()
    setIsRunning(false)
  }, [clear])

  useEffect(() => clear, [clear])

  return { isRunning, start, pause, resume, stop }
}
