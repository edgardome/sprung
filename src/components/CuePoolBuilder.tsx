import React, { useMemo, useState, useEffect, useCallback } from 'react'
import type { CueConfigItem, ArrowDirection, MixedMode, Cue } from '../types'
import { COLOR_PALETTE } from '../types'
import { shuffle } from '../utils/shuffle'

interface CuePoolBuilderProps {
  items: CueConfigItem[]
  mixedMode: MixedMode
  onItemsChange: (items: CueConfigItem[]) => void
  onMixedModeChange: (mode: MixedMode) => void
}

let idCounter = 0
function nextId(): string {
  return `cue-${++idCounter}-${Date.now()}`
}

const ARROW_OPTIONS: { dir: ArrowDirection; label: string; symbol: string }[] = [
  { dir: 'up', label: 'Up', symbol: '⬆' },
  { dir: 'down', label: 'Down', symbol: '⬇' },
  { dir: 'left', label: 'Left', symbol: '⬅' },
  { dir: 'right', label: 'Right', symbol: '➡' },
]

function getCount(items: CueConfigItem[], kind: string, value: string): number {
  return items.find((i) => i.kind === kind && i.value === value)?.count ?? 0
}

function CueOption({
  label,
  count,
  preview,
  onClick,
  onRemove,
}: {
  label: string
  count: number
  preview?: React.ReactNode
  onClick: () => void
  onRemove: () => void
}) {
  return (
    <div className={`cue-option ${count > 0 ? 'cue-option--active' : ''}`}>
      <button className="cue-option-btn" onClick={onClick}>
        {preview}
        <span>{label}</span>
      </button>
      {count > 0 && (
        <span className="cue-option-badge">
          <button className="cue-option-minus" onClick={onRemove}>
            −
          </button>
          <span className="cue-option-count">{count}</span>
        </span>
      )}
    </div>
  )
}

function PreviewBadge({ cue }: { cue: Cue }) {
  switch (cue.kind) {
    case 'arrow':
      return (
        <span className="preview-badge preview-badge--arrow">
          {cue.value === 'up' ? '⬆' : cue.value === 'down' ? '⬇' : cue.value === 'left' ? '⬅' : '➡'}
        </span>
      )
    case 'color':
      return (
        <span
          className="preview-badge preview-badge--color"
          style={{ backgroundColor: cue.value, boxShadow: `0 0 6px ${cue.value}` }}
        />
      )
    case 'number':
      return (
        <span className="preview-badge preview-badge--number">
          {cue.value}
        </span>
      )
  }
}

export const CuePoolBuilder: React.FC<CuePoolBuilderProps> = ({
  items,
  mixedMode,
  onItemsChange,
  onMixedModeChange,
}) => {
  const [isShuffled, setIsShuffled] = useState(false)

  const addOne = (kind: string, value: string) => {
    const exists = items.find((i) => i.kind === kind && i.value === value)
    if (exists) {
      onItemsChange(
        items.map((i) =>
          i.id === exists.id ? { ...i, count: i.count + 1 } : i,
        ),
      )
    } else {
      onItemsChange([...items, { id: nextId(), kind: kind as CueConfigItem['kind'], value, count: 1 }])
    }
  }

  const removeOne = (kind: string, value: string) => {
    const item = items.find((i) => i.kind === kind && i.value === value)
    if (!item) return
    if (item.count <= 1) {
      onItemsChange(items.filter((i) => i.id !== item.id))
    } else {
      onItemsChange(
        items.map((i) =>
          i.id === item.id ? { ...i, count: i.count - 1 } : i,
        ),
      )
    }
  }

  const filtered = items.filter(
    (i) => mixedMode === 'all' || i.kind === mixedMode,
  )
  const total = filtered.reduce((s, i) => s + i.count, 0)

  const fingerprint = filtered
    .map((i) => `${i.kind}:${i.value}:${i.count}`)
    .join('|')

  useEffect(() => {
    setIsShuffled(false)
  }, [fingerprint])

  const previewSequence = useMemo((): Cue[] => {
    const pool: Cue[] = []
    for (const item of filtered) {
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
    return isShuffled ? shuffle(pool) : pool
  }, [filtered, isShuffled])

  const reshuffle = useCallback(() => setIsShuffled(true), [])

  return (
    <div className="pool-builder">
      <div className="pool-mode-toggle">
        <label className="label">Exercise Type</label>
        <div className="btn-group">
          {(
            [
              ['all', 'Mixed'],
              ['arrow', 'Arrows Only'],
              ['color', 'Colors Only'],
              ['number', 'Numbers Only'],
            ] as [MixedMode, string][]
          ).map(([val, lbl]) => (
            <button
              key={val}
              className={`btn btn-sm ${mixedMode === val ? 'btn-active' : ''}`}
              onClick={() => onMixedModeChange(val)}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="pool-section">
        <h3 className="pool-section-title">⬆ Arrows</h3>
        <div className="pool-section-grid">
          {ARROW_OPTIONS.map((opt) => {
            const cnt = getCount(items, 'arrow', opt.dir)
            return (
              <CueOption
                key={opt.dir}
                label={opt.label}
                count={cnt}
                preview={<span className="cue-option-arrow">{opt.symbol}</span>}
                onClick={() => addOne('arrow', opt.dir)}
                onRemove={() => removeOne('arrow', opt.dir)}
              />
            )
          })}
        </div>
      </div>

      <div className="pool-section">
        <h3 className="pool-section-title">🎨 Colors</h3>
        <div className="pool-section-grid pool-section-grid--colors">
          {COLOR_PALETTE.map((c) => {
            const cnt = getCount(items, 'color', c.hex)
            return (
              <CueOption
                key={c.hex}
                label={c.name}
                count={cnt}
                preview={
                  <span
                    className="cue-option-swatch"
                    style={{ backgroundColor: c.hex }}
                  />
                }
                onClick={() => addOne('color', c.hex)}
                onRemove={() => removeOne('color', c.hex)}
              />
            )
          })}
        </div>
      </div>

      <div className="pool-section">
        <h3 className="pool-section-title">🔢 Numbers</h3>
        <div className="pool-section-grid pool-section-grid--numbers">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
            const cnt = getCount(items, 'number', String(n))
            return (
              <CueOption
                key={n}
                label={String(n)}
                count={cnt}
                onClick={() => addOne('number', String(n))}
                onRemove={() => removeOne('number', String(n))}
              />
            )
          })}
        </div>
      </div>

      {total > 0 && (
        <div className="pool-section pool-preview">
          <div className="pool-preview-header">
            <h3 className="pool-section-title">Sequence Preview</h3>
            <button className="btn btn-sm" onClick={reshuffle}>
              🔀 Shuffle
            </button>
          </div>
          <div className="pool-preview-list">
            {previewSequence.map((cue, i) => (
              <PreviewBadge key={i} cue={cue} />
            ))}
          </div>
        </div>
      )}

      <div className="pool-total">
        Total workouts: {total}
        {total === 0 && (
          <span className="pool-total-hint">
            {' '}— add arrows, colors, or numbers above
          </span>
        )}
      </div>
    </div>
  )
}
