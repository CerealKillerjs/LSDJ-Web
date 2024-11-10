import * as Tone from 'tone';

export class WaveChannel {
  private synth: Tone.Synth;
  private waveform: Float32Array;
  private output: Tone.ToneAudioNode;

  constructor() {
    this.waveform = new Float32Array(32);
    this.initializeDefaultWaveform();

    this.synth = new Tone.Synth({
      oscillator: {
        type: 'custom',
        partials: Array.from(this.waveform)
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1
      }
    });

    // Crear nodo de salida
    this.output = new Tone.Gain();
    this.synth.connect(this.output);
  }

  public connect(destination: Tone.ToneAudioNode) {
    this.output.connect(destination);
    return this;
  }

  public disconnect() {
    this.output.disconnect();
    return this;
  }

  private initializeDefaultWaveform() {
    for (let i = 0; i < 32; i++) {
      this.waveform[i] = (i < 16) ? i / 8 - 1 : 1 - (i - 16) / 8;
    }
  }

  public setWaveform(newWaveform: Float32Array) {
    if (newWaveform.length === 32) {
      this.waveform = newWaveform;
      
      if (this.synth.oscillator.type === 'custom') {
        const oscillator = this.synth.oscillator as unknown as { partials: number[] };
        oscillator.partials = Array.from(this.waveform);
      }
    }
  }

  public playNote(note: string, duration: string = '8n') {
    this.synth.triggerAttackRelease(note, duration);
  }

  public dispose() {
    this.synth.dispose();
    this.output.dispose();
  }
} 