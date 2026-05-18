import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CueConfigItem, ExerciseConfig, MixedMode } from '../types'
import { CuePoolBuilder } from '../components/CuePoolBuilder'
import { SpeedControl } from '../components/SpeedControl'

export const Configure: React.FC = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState<CueConfigItem[]>([])
  const [intervalMs, setIntervalMs] = useState(1000)
  const [variableSpeed, setVariableSpeed] = useState(false)
  const [variableSpeedMin, setVariableSpeedMin] = useState(500)
  const [variableSpeedMax, setVariableSpeedMax] = useState(2000)
  const [mixedMode, setMixedMode] = useState<MixedMode>('all')

  const handleStart = useCallback(() => {
    const activeItems = items.filter(
      (i) => mixedMode === 'all' || i.kind === mixedMode,
    )
    const total = activeItems.reduce((s, i) => s + i.count, 0)
    if (total === 0) return

    const config: ExerciseConfig = {
      items,
      intervalMs,
      variableSpeed,
      variableSpeedMin,
      variableSpeedMax,
      mixedMode,
    }

    navigate('/workout', { state: config })
  }, [items, intervalMs, variableSpeed, variableSpeedMin, variableSpeedMax, mixedMode, navigate])

  const activeItems = items.filter(
    (i) => mixedMode === 'all' || i.kind === mixedMode,
  )
  const total = activeItems.reduce((s, i) => s + i.count, 0)

  return (
    <div className="configure">
      <h1 className="page-title">Configure Workout</h1>

      <CuePoolBuilder
        items={items}
        mixedMode={mixedMode}
        onItemsChange={setItems}
        onMixedModeChange={setMixedMode}
      />

      <SpeedControl
        intervalMs={intervalMs}
        variableSpeed={variableSpeed}
        variableSpeedMin={variableSpeedMin}
        variableSpeedMax={variableSpeedMax}
        onIntervalChange={setIntervalMs}
        onVariableSpeedChange={setVariableSpeed}
        onVariableSpeedMinChange={setVariableSpeedMin}
        onVariableSpeedMaxChange={setVariableSpeedMax}
      />

      <div className="configure-actions">
        <button className="btn btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleStart}
          disabled={total === 0}
        >
          ▶ Start ({total})
        </button>
      </div>
    </div>
  )
}
