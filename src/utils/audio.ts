let audioCtx: AudioContext | null = null
let clickBuf: AudioBuffer | null = null
let accentBuf: AudioBuffer | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    audioCtx = new Ctor()
  }
  return audioCtx
}

function buildBuffers(): void {
  const ctx = getCtx()
  if (clickBuf) return

  const sr = ctx.sampleRate
  const len = Math.floor(sr * 0.06)

  clickBuf = ctx.createBuffer(1, len, sr)
  accentBuf = ctx.createBuffer(1, len, sr)

  const c = clickBuf.getChannelData(0)
  const a = accentBuf.getChannelData(0)

  for (let i = 0; i < len; i++) {
    const t = i / sr
    const env = Math.max(0, 1 - t / 0.04)
    c[i] = Math.sin(2 * Math.PI * 660 * t) * env * 0.3
    a[i] = Math.sin(2 * Math.PI * 880 * t) * env * 0.45
  }
}

export async function initAudio(): Promise<void> {
  const ctx = getCtx()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  buildBuffers()
}

export function playClick(accent: boolean = false): void {
  const ctx = audioCtx
  if (!ctx || ctx.state !== 'running') return

  const src = ctx.createBufferSource()
  src.buffer = accent ? accentBuf : clickBuf
  src.connect(ctx.destination)
  src.start(ctx.currentTime)
}
