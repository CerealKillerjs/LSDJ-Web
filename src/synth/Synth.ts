import { PulseChannel } from './channels/PulseChannel';
import { WaveChannel } from './channels/WaveChannel';
import { NoiseChannel } from './channels/NoiseChannel';
import { EffectProcessor } from './effects/EffectProcessor';
import { Effect } from '../types/effects';
import * as Tone from 'tone';

export class LSDJSynth {
  private pulse1: PulseChannel;
  private pulse2: PulseChannel;
  private wave: WaveChannel;
  private noise: NoiseChannel;
  private effects: EffectProcessor;

  // Añadir analizadores para cada canal
  public analyzers = {
    pulse1: new Tone.Analyser('waveform', 1024),
    pulse2: new Tone.Analyser('waveform', 1024),
    wave: new Tone.Analyser('waveform', 1024),
    noise: new Tone.Analyser('waveform', 1024)
  };

  constructor() {
    // Pulse 1 con duty cycle de 50%
    this.pulse1 = new PulseChannel(0.5);
    // Pulse 2 con duty cycle de 25%
    this.pulse2 = new PulseChannel(0.25);
    this.wave = new WaveChannel();
    this.noise = new NoiseChannel();
    this.effects = new EffectProcessor();

    // Conectar los canales a sus analizadores y luego al procesador de efectos
    this.pulse1.connect(this.analyzers.pulse1).connect(this.effects.getInput());
    this.pulse2.connect(this.analyzers.pulse2).connect(this.effects.getInput());
    this.wave.connect(this.analyzers.wave).connect(this.effects.getInput());
    this.noise.connect(this.analyzers.noise).connect(this.effects.getInput());
  }

  public playPulse1(note: string, duration: string = '8n', effects: Effect[] = []) {
    this.pulse1.playNote(note, duration);
    effects.forEach(effect => this.effects.processEffect(effect));
  }

  public playPulse2(note: string, duration: string = '8n', effects: Effect[] = []) {
    this.pulse2.playNote(note, duration);
    effects.forEach(effect => this.effects.processEffect(effect));
  }

  public playWave(note: string, duration: string = '8n', effects: Effect[] = []) {
    this.wave.playNote(note, duration);
    effects.forEach(effect => this.effects.processEffect(effect));
  }

  public playNoise(duration: string = '8n', effects: Effect[] = []) {
    this.noise.playNote(duration);
    effects.forEach(effect => this.effects.processEffect(effect));
  }

  public setPulse1Width(width: number) {
    this.pulse1.setPulseWidth(width);
  }

  public setPulse2Width(width: number) {
    this.pulse2.setPulseWidth(width);
  }

  public setWaveform(waveform: Float32Array) {
    this.wave.setWaveform(waveform);
  }

  public setNoiseType(type: 'white' | 'brown' | 'pink') {
    this.noise.setNoiseType(type);
  }

  public dispose() {
    // Limpiar todos los canales y efectos
    this.pulse1.dispose();
    this.pulse2.dispose();
    this.wave.dispose();
    this.noise.dispose();
    this.effects.dispose();
    
    // Detener y limpiar el transporte de Tone.js
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    // Limpiar el contexto de audio
    const context = Tone.getContext();
    
    // Desconectar todos los nodos
    context.dispose();
    
    // Si el contexto es un AudioContext (no OfflineAudioContext), cerrarlo
    if (context.rawContext instanceof AudioContext) {
      context.rawContext.close();
    }
  }
} 