export type EnvelopeType = 'LINEAR' | 'EXPONENTIAL';
export type WaveformType = 'SQUARE' | 'SAW' | 'TRIANGLE' | 'CUSTOM';
export type SweepType = 'UP' | 'DOWN' | 'NONE';

export interface Envelope {
  type: EnvelopeType;
  attack: number;    // 0-15 (0.0-1.5s)
  decay: number;     // 0-15 (0.0-1.5s)
  sustain: number;   // 0-15 (0-15/15)
  release: number;   // 0-15 (0.0-1.5s)
}

// Interfaz base para todos los instrumentos
export interface BaseInstrument {
  type: InstrumentType;
  envelope: Envelope;
  outputChannel: 'LEFT' | 'RIGHT' | 'BOTH';
  tableId?: number;  // ID de la tabla de efectos asignada
}

export interface PulseInstrument extends BaseInstrument {
  type: 'PULSE';
  pulseWidth: number;  // 0-3 (12.5%, 25%, 50%, 75%)
  sweep: {
    type: SweepType;
    speed: number;     // 0-7
    intensity: number; // 0-7
  };
  vibrato: {
    speed: number;     // 0-15
    depth: number;     // 0-15
    delay: number;     // 0-15
  };
}

export interface WaveInstrument extends BaseInstrument {
  type: 'WAVE';
  waveform: WaveformType;
  customWaveform?: Float32Array;
}

export interface NoiseInstrument extends BaseInstrument {
  type: 'NOISE';
  shape: number;      // 0-127 (frecuencia del ruido)
}

export interface KitInstrument extends BaseInstrument {
  type: 'KIT';
  sample: Float32Array;
  sampleRate: number;
  loop: {
    enabled: boolean;
    start: number;
    end: number;
  };
}

export type InstrumentType = 'PULSE' | 'WAVE' | 'NOISE' | 'KIT';
export type Instrument = PulseInstrument | WaveInstrument | NoiseInstrument | KitInstrument;

export interface InstrumentBank {
  instruments: Instrument[];
  activeInstrument: number;
} 