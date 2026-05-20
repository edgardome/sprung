import React, { useMemo } from 'react'
import type { CueConfigItem, ArrowDirection, MixedMode, Cue } from '../types'
import { COLOR_PALETTE } from '../types'

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

function isActive(items: CueConfigItem[], kind: string, value: string): boolean {
  return items.some((i) => i.kind === kind && i.value === value)
}

function CueOption({
  label,
  active,
  preview,
  onClick,
}: {
  label: string
  active: boolean
  preview?: React.ReactNode
  onClick: () => void
}) {
  return (
    <div className={`cue-option ${active ? 'cue-option--active' : ''}`}>
      <button className="cue-option-btn" onClick={onClick}>
        {preview}
        <span>{label}</span>
      </button>
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
  const toggleOne = (kind: string, value: string) => {
    const exists = items.find((i) => i.kind === kind && i.value === value)
    if (exists) {
      onItemsChange(items.filter((i) => i.id !== exists.id))
    } else {
      onItemsChange([...items, { id: nextId(), kind: kind as CueConfigItem['kind'], value, count: 1 }])
    }
  }

  const filtered = items.filter(
    (i) => mixedMode === 'all' || i.kind === mixedMode,
  )
  const total = filtered.length

  const previewSequence = useMemo((): Cue[] => {
    const pool: Cue[] = []
    for (const item of filtered) {
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
    return pool
  }, [filtered])

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
        <h3 className="pool-section-title">Arrows</h3>
        <div className="pool-section-grid">
          {ARROW_OPTIONS.map((opt) => {
            const act = isActive(items, 'arrow', opt.dir)
            return (
              <CueOption
                key={opt.dir}
                label={opt.label}
                active={act}
                preview={<span className="cue-option-arrow">{opt.symbol}</span>}
                onClick={() => toggleOne('arrow', opt.dir)}
              />
            )
          })}
        </div>
      </div>

      <div className="pool-section">
        <h3 className="pool-section-title">Colors</h3>
        <div className="pool-section-grid pool-section-grid--colors">
          {COLOR_PALETTE.map((c) => {
            const act = isActive(items, 'color', c.hex)
            return (
              <CueOption
                key={c.hex}
                label={c.name}
                active={act}
                preview={
                  <span
                    className="cue-option-swatch"
                    style={{ backgroundColor: c.hex }}
                  />
                }
                onClick={() => toggleOne('color', c.hex)}
              />
            )
          })}
        </div>
      </div>

      <div className="pool-section">
        <h3 className="pool-section-title">Numbers</h3>
        <div className="pool-section-grid pool-section-grid--numbers">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
            const act = isActive(items, 'number', String(n))
            return (
              <CueOption
                key={n}
                label={String(n)}
                active={act}
                onClick={() => toggleOne('number', String(n))}
              />
            )
          })}
        </div>
      </div>

      {total > 0 && (
        <div className="pool-section pool-preview">
          <div className="pool-preview-header">
            <h3 className="pool-section-title">Sequence Preview</h3>
          </div>
          <div className="pool-preview-list">
            {previewSequence.map((cue, i) => (
              <PreviewBadge key={i} cue={cue} />
            ))}
          </div>
        </div>
      )}

      <div className="pool-total">
        {total} exercise type{total !== 1 ? 's' : ''} selected
        {total === 0 && (
          <span className="pool-total-hint">
            {' '}— add arrows, colors, or numbers above
          </span>
        )}
      </div>
    </div>
  )
}
