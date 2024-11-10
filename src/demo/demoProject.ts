import { Project } from '../types/project';

export const demoProject: Project = {
  name: "LSDJ Demo",
  version: "1.0.0",
  createdAt: new Date(),
  modifiedAt: new Date(),
  tempo: 135,
  
  instruments: [
    // Pulse 1 - Lead arpegiado
    {
      type: 'PULSE',
      envelope: {
        type: 'LINEAR',
        attack: 0,
        decay: 4,
        sustain: 12,
        release: 4
      },
      pulseWidth: 0.5,
      sweep: { type: 'NONE', speed: 0, intensity: 0 },
      vibrato: { speed: 3, depth: 2, delay: 0 },
      outputChannel: 'BOTH'
    },
    // Pulse 2 - Pad atmosférico
    {
      type: 'PULSE',
      envelope: {
        type: 'LINEAR',
        attack: 8,
        decay: 0,
        sustain: 15,
        release: 8
      },
      pulseWidth: 0.25,
      sweep: { type: 'NONE', speed: 0, intensity: 0 },
      vibrato: { speed: 2, depth: 1, delay: 4 },
      outputChannel: 'BOTH'
    },
    // Wave - Bajo
    {
      type: 'WAVE',
      envelope: {
        type: 'LINEAR',
        attack: 0,
        decay: 2,
        sustain: 13,
        release: 3
      },
      waveform: 'SAW',
      outputChannel: 'BOTH'
    },
    // Noise - Ritmo
    {
      type: 'NOISE',
      envelope: {
        type: 'LINEAR',
        attack: 0,
        decay: 4,
        sustain: 0,
        release: 2
      },
      shape: 64,
      outputChannel: 'BOTH'
    }
  ],

  phrases: [
    // Phrase 0: Arpegio principal (Pulse 1)
    {
      id: 0,
      notes: [
        { note: 'E4', instrument: 0, volume: 15, effects: [] },
        { note: 'G4', instrument: 0, volume: 15, effects: [] },
        { note: 'B4', instrument: 0, volume: 15, effects: [] },
        { note: 'E5', instrument: 0, volume: 15, effects: [] },
        { note: 'B4', instrument: 0, volume: 15, effects: [] },
        { note: 'G4', instrument: 0, volume: 15, effects: [] },
        { note: 'E4', instrument: 0, volume: 15, effects: [] },
        { note: 'B3', instrument: 0, volume: 15, effects: [] }
      ].concat(Array(8).fill({ note: '---', instrument: 0, volume: 15, effects: [] })),
      length: 16
    },
    // Phrase 1: Pad (Pulse 2)
    {
      id: 1,
      notes: [
        { note: 'E4', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] },
        { note: 'B4', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] },
        { note: '---', instrument: 1, volume: 12, effects: [] }
      ].concat(Array(8).fill({ note: '---', instrument: 1, volume: 12, effects: [] })),
      length: 16
    },
    // Phrase 2: Bajo (Wave)
    {
      id: 2,
      notes: [
        { note: 'E2', instrument: 2, volume: 15, effects: [] },
        { note: '---', instrument: 2, volume: 15, effects: [] },
        { note: 'E2', instrument: 2, volume: 12, effects: [] },
        { note: '---', instrument: 2, volume: 15, effects: [] },
        { note: 'G2', instrument: 2, volume: 15, effects: [] },
        { note: '---', instrument: 2, volume: 15, effects: [] },
        { note: 'A2', instrument: 2, volume: 15, effects: [] },
        { note: 'B2', instrument: 2, volume: 15, effects: [] }
      ].concat(Array(8).fill({ note: '---', instrument: 2, volume: 15, effects: [] })),
      length: 16
    },
    // Phrase 3: Ritmo (Noise)
    {
      id: 3,
      notes: [
        { note: 'C4', instrument: 3, volume: 15, effects: [] },
        { note: '---', instrument: 3, volume: 0, effects: [] },
        { note: 'C3', instrument: 3, volume: 10, effects: [] },
        { note: '---', instrument: 3, volume: 0, effects: [] },
        { note: 'C4', instrument: 3, volume: 15, effects: [] },
        { note: 'C3', instrument: 3, volume: 8, effects: [] },
        { note: 'C3', instrument: 3, volume: 10, effects: [] },
        { note: 'C4', instrument: 3, volume: 12, effects: [] }
      ].concat(Array(8).fill({ note: '---', instrument: 3, volume: 0, effects: [] })),
      length: 16
    }
  ],

  chains: [
    // Chain 0: Secuencia principal (Pulse 1)
    {
      id: 0,
      steps: [
        ...Array(8).fill({ phraseId: 0, transpose: 0, table: 255 }),
        ...Array(4).fill({ phraseId: 0, transpose: 3, table: 255 }),
        ...Array(4).fill({ phraseId: 0, transpose: 5, table: 255 })
      ]
    },
    // Chain 1: Pad (Pulse 2)
    {
      id: 1,
      steps: Array(16).fill({ phraseId: 1, transpose: 0, table: 255 })
    },
    // Chain 2: Bajo (Wave)
    {
      id: 2,
      steps: Array(16).fill({ phraseId: 2, transpose: 0, table: 255 })
    },
    // Chain 3: Ritmo (Noise)
    {
      id: 3,
      steps: Array(16).fill({ phraseId: 3, transpose: 0, table: 255 })
    }
  ],

  song: {
    rows: [
      // Intro: Solo arpegio
      { chains: { pulse1: 0, pulse2: 255, wave: 255, noise: 255 }, groove: 0, tempo: 135 },
      { chains: { pulse1: 0, pulse2: 255, wave: 255, noise: 255 }, groove: 0, tempo: 135 },
      // Entrada pad
      { chains: { pulse1: 0, pulse2: 1, wave: 255, noise: 255 }, groove: 0, tempo: 135 },
      { chains: { pulse1: 0, pulse2: 1, wave: 255, noise: 255 }, groove: 0, tempo: 135 },
      // Entrada bajo
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 255 }, groove: 0, tempo: 135 },
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 255 }, groove: 0, tempo: 135 },
      // Todo junto
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 3 }, groove: 0, tempo: 135 },
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 3 }, groove: 0, tempo: 135 },
      // Repetición con variaciones
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 3 }, groove: 0, tempo: 135 },
      { chains: { pulse1: 0, pulse2: 1, wave: 2, noise: 3 }, groove: 0, tempo: 135 }
    ],
    activeRow: 0,
    name: "LSDJ Demo",
    tempo: 135,
    defaultGroove: 0
  },

  tables: [],
  grooves: [{
    id: 0,
    steps: [
      { ticks: 6, volume: 15 },
      { ticks: 6, volume: 13 },
      { ticks: 6, volume: 14 },
      { ticks: 6, volume: 13 }
    ],
    length: 4
  }],
  kits: []
}; 