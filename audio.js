// ============================================================
// AUDIO.JS — Simple Web Audio sound effects
// ============================================================

const Audio = {
  ctx: null,
  muted: false,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { console.warn('No Web Audio'); }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  play(name) {
    if (this.muted || !this.ctx) return;
    this.resume();
    const sounds = {
      tap:     { freq:800, dur:0.06, type:'sine' },
      select:  { freq:600, dur:0.1,  type:'sine', freq2:900 },
      buy:     { freq:500, dur:0.15, type:'sine', freq2:700 },
      cook:    { freq:200, dur:0.3,  type:'sawtooth' },
      splash:  { freq:300, dur:0.2,  type:'sine' },
      happy:   { freq:600, dur:0.2,  type:'sine', freq2:900 },
      sad:     { freq:400, dur:0.3,  type:'sine', freq2:250 },
      coin:    { freq:1200,dur:0.1,  type:'square', freq2:1500 },
      star:    { freq:800, dur:0.3,  type:'sine', freq2:1200 },
      phone:   { freq:700, dur:0.15, type:'sine', freq2:900 },
      save:    { freq:500, dur:0.15, type:'sine', freq2:700 },
      whoosh:  { freq:400, dur:0.15, type:'sawtooth', freq2:100 },
      pop:     { freq:1000,dur:0.05, type:'sine' },
      success: { freq:523, dur:0.4,  type:'sine', freq2:784 },
      fail:    { freq:300, dur:0.3,  type:'sawtooth', freq2:200 },
    };
    const s = sounds[name];
    if (!s) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = s.type || 'sine';
    osc.frequency.setValueAtTime(s.freq, this.ctx.currentTime);
    if (s.freq2) osc.frequency.linearRampToValueAtTime(s.freq2, this.ctx.currentTime + s.dur);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + s.dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + s.dur + 0.05);
  }
};
