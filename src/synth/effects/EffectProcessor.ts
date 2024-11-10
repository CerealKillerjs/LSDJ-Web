import * as Tone from 'tone';
import { Effect } from '../../types/effects';

export class EffectProcessor {
  private delay: Tone.FeedbackDelay;
  private chorus: Tone.Chorus;
  private distortion: Tone.Distortion;
  private reverb: Tone.Reverb;
  private filter: Tone.Filter;
  private pitchShift: Tone.PitchShift;
  private tremolo: Tone.Tremolo;
  private vibrato: Tone.Vibrato;
  private phaser: Tone.Phaser;

  constructor() {
    // Inicializar efectos
    this.delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.3,
      wet: 0
    });

    this.chorus = new Tone.Chorus({
      frequency: 4,
      delayTime: 2.5,
      depth: 0.5,
      wet: 0
    }).start();

    this.distortion = new Tone.Distortion({
      distortion: 0.8,
      wet: 0
    });

    this.reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0
    });

    this.filter = new Tone.Filter({
      frequency: 1000,
      type: "lowpass",
      rolloff: -12,
      Q: 1
    });

    this.pitchShift = new Tone.PitchShift({
      pitch: 0,
      wet: 0
    });

    this.tremolo = new Tone.Tremolo({
      frequency: 10,
      depth: 0.5,
      wet: 0
    }).start();

    this.vibrato = new Tone.Vibrato({
      frequency: 5,
      depth: 0.1,
      wet: 0
    });

    this.phaser = new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
      wet: 0
    });

    // Conectar efectos en serie
    this.delay.chain(
      this.chorus,
      this.distortion,
      this.reverb,
      this.filter,
      this.pitchShift,
      this.tremolo,
      this.vibrato,
      this.phaser,
      Tone.Destination
    );
  }

  public processEffect(effect: Effect) {
    switch (effect.type) {
      case 'DELAY':
        this.delay.wet.value = effect.params?.mix || 0;
        this.delay.feedback.value = effect.params?.feedback || 0.3;
        this.delay.delayTime.value = effect.params?.time || 0.25;
        break;

      case 'CHOR':
        this.chorus.wet.value = effect.params?.mix || 0;
        this.chorus.depth = effect.params?.depth || 0.5;
        this.chorus.frequency.value = effect.params?.rate || 4;
        break;

      case 'DIST':
        this.distortion.wet.value = effect.params?.mix || 0;
        this.distortion.distortion = effect.params?.drive || 0.8;
        break;

      case 'RES':
        const gain = new Tone.Gain(effect.params?.mix || 0);
        this.filter.connect(gain);
        this.filter.Q.value = effect.params?.resonance || 1;
        break;

      case 'BEND':
        this.pitchShift.wet.value = 1;
        this.pitchShift.pitch = effect.value;
        break;

      case 'VIB':
        this.vibrato.wet.value = effect.params?.mix || 0;
        this.vibrato.depth.value = effect.params?.depth || 0.1;
        this.vibrato.frequency.value = effect.params?.rate || 5;
        break;

      case 'FLANG':
        this.phaser.wet.value = effect.params?.mix || 0;
        this.phaser.frequency.value = effect.params?.rate || 15;
        this.phaser.octaves = effect.params?.depth || 5;
        break;
    }
  }

  public getInput(): Tone.ToneAudioNode {
    return this.delay;
  }

  public dispose() {
    this.delay.dispose();
    this.chorus.dispose();
    this.distortion.dispose();
    this.reverb.dispose();
    this.filter.dispose();
    this.pitchShift.dispose();
    this.tremolo.dispose();
    this.vibrato.dispose();
    this.phaser.dispose();
  }
} 