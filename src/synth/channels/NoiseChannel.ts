import * as Tone from 'tone';

export class NoiseChannel {
  private noise: Tone.Noise;
  private filter: Tone.Filter;
  private envelope: Tone.AmplitudeEnvelope;
  private output: Tone.ToneAudioNode;

  constructor() {
    this.noise = new Tone.Noise({
      type: 'white',
      playbackRate: 1
    });

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 1000,
      Q: 1
    });

    this.envelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.1
    });

    // Crear nodo de salida
    this.output = new Tone.Gain();

    // Conectamos los componentes
    this.noise.connect(this.filter);
    this.filter.connect(this.envelope);
    this.envelope.connect(this.output);
  }

  public connect(destination: Tone.ToneAudioNode) {
    this.output.connect(destination);
    return this;
  }

  public disconnect() {
    this.output.disconnect();
    return this;
  }

  public setNoiseType(type: 'white' | 'brown' | 'pink') {
    this.noise.type = type;
  }

  public setFilterFrequency(freq: number) {
    this.filter.frequency.value = freq;
  }

  public playNote(duration: string = '8n') {
    this.noise.start();
    this.envelope.triggerAttackRelease(duration);
    const stopTime = Tone.now() + Tone.Time(duration).toSeconds();
    this.noise.stop(stopTime);
  }

  public dispose() {
    this.noise.dispose();
    this.filter.dispose();
    this.envelope.dispose();
    this.output.dispose();
  }
} 