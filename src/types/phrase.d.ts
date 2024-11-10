import { Effect as AudioEffect } from './effects';

export interface Effect extends AudioEffect {
  // Extendemos el tipo Effect de effects.d.ts
}

export interface Note {
  note: string;      // Nota musical (ej: 'C4', 'D#5', '---' para silencio)
  instrument: number; // ID del instrumento (0-F en hex)
  volume: number;    // Volumen (0-F en hex)
  effects: AudioEffect[]; // Usamos el tipo Effect de effects.d.ts
}

export interface Phrase {
  id: number;        // ID único de la phrase
  notes: Note[];     // Array de 16 notas
  length: number;    // Longitud de la phrase (normalmente 16)
} 