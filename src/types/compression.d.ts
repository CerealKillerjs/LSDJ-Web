export type SampleBitDepth = 8 | 16;
export type SampleRate = 11025 | 22050 | 44100;

export interface CompressionOptions {
  removeUnusedPhrases: boolean;
  removeUnusedChains: boolean;
  removeUnusedInstruments: boolean;
  removeUnusedTables: boolean;
  removeUnusedWaves: boolean;
  removeUnusedSamples: boolean;
  optimizeWaveforms: boolean;
  compressSamples: boolean;
  sampleBitDepth: SampleBitDepth;
  sampleRate: SampleRate;
}

export interface MemoryStats {
  totalSize: number;
  usedSize: number;
  phrases: number;
  chains: number;
  instruments: number;
  tables: number;
  waves: number;
  samples: number;
} 