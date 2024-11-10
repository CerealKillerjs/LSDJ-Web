import * as Tone from 'tone';

interface PulseOscillatorOptions {
  type: 'pulse';
  width: number;
}

export class PulseChannel {
  private synth: Tone.Synth;
  private pulseWidth: number;
  private output: Tone.ToneAudioNode;

  constructor(pulseWidth: number = 0.5) {
    this.pulseWidth = pulseWidth;
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'pulse',
        width: this.pulseWidth
      } as PulseOscillatorOptions,
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

  public setPulseWidth(width: number) {
    this.pulseWidth = Math.max(0, Math.min(1, width));
    const oscillator = this.synth.oscillator as unknown as { width: { value: number } };
    if (oscillator.width) {
      oscillator.width.value = this.pulseWidth;
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