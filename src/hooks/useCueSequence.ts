import { useCallback, useMemo } from 'react'
import type { ArrowDirection, ExerciseConfig, Cue } from '../types'

export function useCueSequence(config: ExerciseConfig): {
  pickRandom: () => Cue
  cueCount: number
} {
  const items = useMemo(() => {
    return config.items.filter((item) => {
      if (config.mixedMode !== 'all' && item.kind !== config.mixedMode)
        return false
      return true
    })
  }, [config])

  const pickRandom = useCallback((): Cue => {
    const idx = Math.floor(Math.random() * items.length)
    const item = items[idx]
    switch (item.kind) {
      case 'arrow':
        return { kind: 'arrow', value: item.value as ArrowDirection }
      case 'color':
        return { kind: 'color', value: item.value }
      case 'number':
        return { kind: 'number', value: Number(item.value) }
    }
  }, [items])

  return { pickRandom, cueCount: items.length }
}
