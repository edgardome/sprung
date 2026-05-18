export type ArrowDirection = 'up' | 'down' | 'left' | 'right'

export type CueType = 'arrow' | 'color' | 'number'

export type MixedMode = 'all' | 'arrow' | 'color' | 'number'

export interface ArrowCue {
  kind: 'arrow'
  value: ArrowDirection
}

export interface ColorCue {
  kind: 'color'
  value: string
}

export interface NumberCue {
  kind: 'number'
  value: number
}

export type Cue = ArrowCue | ColorCue | NumberCue

export interface CueConfigItem {
  id: string
  kind: CueType
  value: string
  count: number
}

export interface ExerciseConfig {
  items: CueConfigItem[]
  intervalMs: number
  variableSpeed: boolean
  variableSpeedMin: number
  variableSpeedMax: number
  mixedMode: MixedMode
}

export interface MetronomeConfig {
  bpm: number
  beatsPerMeasure: number
}

export const COLOR_PALETTE = [
  { hex: '#ff4444', name: 'Red' },
  { hex: '#44ff44', name: 'Green' },
  { hex: '#4488ff', name: 'Blue' },
  { hex: '#ffff44', name: 'Yellow' },
  { hex: '#ff44ff', name: 'Pink' },
  { hex: '#ff8844', name: 'Orange' },
  { hex: '#8844ff', name: 'Purple' },
  { hex: '#44ffff', name: 'Cyan' },
]
