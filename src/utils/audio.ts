let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export async function initAudio(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

export function resumeAudio(): void {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
}

export function playClick(accent: boolean = false): void {
  const ctx = audioCtx
  if (!ctx || ctx.state !== 'running') return

  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.value = accent ? 880 : 660

  gain.gain.setValueAtTime(accent ? 0.4 : 0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.05)
}
