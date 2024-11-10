export interface SongRow {
  chains: {
    pulse1: number;  // ID de la cadena para el canal Pulse 1
    pulse2: number;  // ID de la cadena para el canal Pulse 2
    wave: number;    // ID de la cadena para el canal Wave
    noise: number;   // ID de la cadena para el canal Noise
  };
  groove: number;    // ID del groove a usar
  tempo: number;     // Tempo en BPM
}

export interface Song {
  rows: SongRow[];
  activeRow: number;
  name: string;
  tempo: number;     // Tempo global
  defaultGroove: number;
} 