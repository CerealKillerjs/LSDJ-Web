export type EffectType = 
  | 'VOL'   // Volumen
  | 'PAN'   // Paneo
  | 'ARP'   // Arpegio
  | 'VIB'   // Vibrato
  | 'SWEEP' // Sweep
  | 'DELAY' // Delay con feedback
  | 'BEND'  // Pitch bend
  | 'PORT'  // Portamento/Slide
  | 'RES'   // Resonancia
  | 'DIST'  // Distorsión
  | 'ECHO'  // Echo
  | 'FLANG' // Flanger
  | 'CHOR'  // Chorus
  | 'RING'  // Ring modulation
  | 'SYNC'; // Hard sync

export interface Effect {
  type: EffectType;
  value: number;
  params?: {
    feedback?: number;    // Para DELAY, ECHO
    time?: number;        // Para DELAY, ECHO, FLANG, CHOR
    depth?: number;       // Para FLANG, CHOR, VIB
    rate?: number;        // Para FLANG, CHOR, VIB
    resonance?: number;   // Para RES
    drive?: number;       // Para DIST
    mix?: number;         // Para todos los efectos
  };
}

export interface TableStep {
  effects: Effect[];
  transpose: number;
  volume: number;
}

export interface Table {
  id: number;
  steps: TableStep[];
} 