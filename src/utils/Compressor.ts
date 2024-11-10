import { Project } from '../types/project';
import { CompressionOptions, MemoryStats } from '../types/compression';

export class Compressor {
  private static readonly MAX_PROJECT_SIZE = 32768; // 32KB como en LSDJ original

  public static getMemoryStats(project: Project): MemoryStats {
    const stats: MemoryStats = {
      totalSize: 0,
      usedSize: 0,
      phrases: 0,
      chains: 0,
      instruments: 0,
      tables: 0,
      waves: 0,
      samples: 0
    };

    // Calcular tamaño de cada componente
    project.chains.forEach(chain => {
      stats.chains++;
      stats.usedSize += chain.steps.length * 3; // 3 bytes por paso
    });

    project.tables.forEach(table => {
      stats.tables++;
      stats.usedSize += table.steps.length * 4; // 4 bytes por paso
    });

    project.instruments.forEach(instrument => {
      stats.instruments++;
      stats.usedSize += 16; // Tamaño base por instrumento
      if (instrument.type === 'WAVE' && 'customWaveform' in instrument) {
        stats.waves++;
        stats.usedSize += 32; // 32 bytes por forma de onda
      } else if (instrument.type === 'KIT' && 'sample' in instrument) {
        stats.samples++;
        const sampleSize = Math.ceil(instrument.sample.length / 2);
        samplesSize += sampleSize;
      }
    });

    // Calcular tamaño de samples
    let samplesSize = 0;
    project.instruments.forEach(instrument => {
      if (instrument.type === 'KIT') {
        stats.samples++;
        // Calcular tamaño real del sample
        const sampleSize = Math.ceil(instrument.sample.length / 2); // 16-bit a 8-bit
        samplesSize += sampleSize;
      }
    });

    stats.usedSize += samplesSize;
    stats.totalSize = this.MAX_PROJECT_SIZE;

    return stats;
  }

  public static optimizeProject(project: Project, options: CompressionOptions): Project {
    const optimizedProject = { ...project };

    if (options.removeUnusedPhrases) {
      const usedPhrases = new Set<number>();
      project.chains.forEach(chain => {
        chain.steps.forEach(step => {
          usedPhrases.add(step.phraseId);
        });
      });
      // Implementar eliminación de phrases no usadas
    }

    if (options.removeUnusedChains) {
      const usedChains = new Set<number>();
      project.song.rows.forEach(row => {
        Object.values(row.chains).forEach(chainId => {
          usedChains.add(chainId);
        });
      });
      optimizedProject.chains = project.chains.filter(chain => usedChains.has(chain.id));
    }

    if (options.optimizeWaveforms) {
      optimizedProject.instruments = project.instruments.map(instrument => {
        if (instrument.type === 'WAVE' && 'customWaveform' in instrument && instrument.customWaveform) {
          return {
            ...instrument,
            customWaveform: this.optimizeWaveform(instrument.customWaveform)
          };
        }
        return instrument;
      });
    }

    if (options.compressSamples) {
      optimizedProject.instruments = project.instruments.map(instrument => {
        if (instrument.type === 'KIT' && 'sample' in instrument) {
          return {
            ...instrument,
            sample: this.compressSample(
              instrument.sample,
              options.sampleBitDepth,
              options.sampleRate
            )
          };
        }
        return instrument;
      });
    }

    return optimizedProject;
  }

  private static optimizeWaveform(waveform: Float32Array): Float32Array {
    // Reducir resolución a 4 bits como en LSDJ original
    const optimized = new Float32Array(32);
    for (let i = 0; i < 32; i++) {
      const value = waveform[i];
      const quantized = Math.round(value * 7.5) / 7.5; // 4-bit quantization
      optimized[i] = quantized;
    }
    return optimized;
  }

  private static compressSample(
    sample: Float32Array,
    bitDepth: 8 | 16,
    targetRate: number
  ): Float32Array {
    // Implementar downsampling y reducción de bit depth
    const compressionRatio = sample.length / targetRate;
    const compressed = new Float32Array(Math.ceil(sample.length / compressionRatio));

    for (let i = 0; i < compressed.length; i++) {
      const sourceIndex = Math.floor(i * compressionRatio);
      let value = sample[sourceIndex];

      // Reducir bit depth
      const maxValue = Math.pow(2, bitDepth - 1) - 1;
      value = Math.round(value * maxValue) / maxValue;

      compressed[i] = value;
    }

    return compressed;
  }
} 