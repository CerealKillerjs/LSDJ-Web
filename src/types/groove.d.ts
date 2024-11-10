export interface GrooveStep {
  ticks: number;    // Duración en ticks (1-9)
  volume: number;   // Multiplicador de volumen (0-15)
}

export interface Groove {
  id: number;
  steps: GrooveStep[];
  length: number;   // Longitud efectiva del groove (1-16)
}

export interface GrooveBank {
  grooves: Groove[];
  activeGroove: number;
} 