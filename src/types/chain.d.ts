export interface ChainStep {
  phraseId: number;  // ID del patrón a tocar
  transpose: number; // Transposición (-128 a 127)
  table: number;     // ID de la tabla de efectos (0-255, FF = sin tabla)
}

export interface Chain {
  id: number;
  steps: ChainStep[];
}

export interface ChainBank {
  chains: Chain[];
  activeChain: number;
} 