let audioCtx: AudioContext | null = null
let html5Audio: HTMLAudioElement | null = null
let clickWavDataUri = ''

// ── HTML5 Audio fallback ──────────────────────────────────────
function buildWavDataUri(): string {
  const sr = 44100
  const dur = 0.04
  const len = Math.floor(sr * dur)
  const buf = new ArrayBuffer(44 + len * 2)
  const v = new DataView(buf)

  const w = (s: string, o: number) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  w('RIFF', 0); v.setUint32(4, 36 + len * 2, true); w('WAVE', 8)
  w('fmt ', 12); v.setUint32(16, 16, true); v.setUint16(20, 1, true)
  v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true)
  v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  w('data', 36); v.setUint32(40, len * 2, true)

  for (let i = 0; i < len; i++) {
    const t = i / sr
    const env = Math.max(0, 1 - t / 0.03)
    const sq = Math.sin(2 * Math.PI * 800 * t) > 0 ? 1 : -1
    v.setInt16(44 + i * 2, sq * env * 0x4CCC, true)
  }

  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return 'data:audio/wav;base64,' + btoa(bin)
}

function getHtml5Audio(): HTMLAudioElement {
  if (!html5Audio) {
    clickWavDataUri = buildWavDataUri()
    html5Audio = new Audio(clickWavDataUri)
  }
  return html5Audio
}

// ── Web Audio ─────────────────────────────────────────────────
function getCtx(): AudioContext {
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    audioCtx = new Ctor()
  }
  return audioCtx
}

export async function initAudio(): Promise<void> {
  const ctx = getCtx()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  getHtml5Audio().play().then(() => { html5Audio!.pause(); html5Audio!.currentTime = 0 }).catch(() => {})
}

export function playClick(accent: boolean = false): void {
  const ctx = audioCtx
  if (ctx && ctx.state === 'running') {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = accent ? 880 : 660
    gain.gain.value = accent ? 0.5 : 0.35
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    gain.gain.setValueAtTime(0, now + 0.04)
    osc.stop(now + 0.05)
  } else {
    const a = getHtml5Audio()
    a.currentTime = 0
    a.play().catch(() => {})
  }
}
