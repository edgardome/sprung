let audioCtx: AudioContext | null = null
let clickBuf: AudioBuffer | null = null
let accentBuf: AudioBuffer | null = null

function ensureCtx(): AudioContext {
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    audioCtx = new Ctor()
  }
  return audioCtx
}

function buildBuffers(): void {
  const ctx = audioCtx!
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

function playBuf(buf: AudioBuffer): void {
  const ctx = audioCtx!
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(0)
}

export function initAudio(): void {
  const ctx = ensureCtx()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  buildBuffers()
  if (clickBuf && ctx.state !== 'closed') {
    playBuf(clickBuf)
  }
}

export function playClick(accent: boolean = false): void {
  const ctx = audioCtx
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume()
    return
  }
  if (ctx.state !== 'running') return
  if (!clickBuf || !accentBuf) return
  playBuf(accent ? accentBuf : clickBuf)
}
