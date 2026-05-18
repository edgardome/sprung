import { useCallback, useMemo } from 'react'
import type { ArrowDirection, ExerciseConfig, Cue } from '../types'
import { shuffle } from '../utils/shuffle'

export function useCueSequence(config: ExerciseConfig): {
  sequence: Cue[]
  cueCount: number
  regenerate: () => Cue[]
} {
  const buildSequence = useCallback((): Cue[] => {
    const pool: Cue[] = []

    for (const item of config.items) {
      if (item.count <= 0) continue

      if (config.mixedMode !== 'all' && item.kind !== config.mixedMode) continue

      for (let i = 0; i < item.count; i++) {
        switch (item.kind) {
          case 'arrow':
            pool.push({ kind: 'arrow', value: item.value as ArrowDirection })
            break
          case 'color':
            pool.push({ kind: 'color', value: item.value })
            break
          case 'number':
            pool.push({ kind: 'number', value: Number(item.value) })
            break
        }
      }
    }

    return shuffle(pool)
  }, [config])

  const sequence = useMemo(() => buildSequence(), [buildSequence])

  return {
    sequence,
    cueCount: sequence.length,
    regenerate: buildSequence,
  }
}
