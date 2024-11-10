import React, { useState } from 'react';
import { Project } from '../types/project';
import { Compressor } from '../utils/Compressor';
import { CompressionOptions, SampleBitDepth, SampleRate } from '../types/compression';
import '../styles/CompressionManager.css';

export interface CompressionManagerProps {
  currentProject: Project;
  onProjectChange: (project: Project) => void;
}

export const CompressionManager: React.FC<CompressionManagerProps> = ({
  currentProject,
  onProjectChange
}) => {
  const [options, setOptions] = useState<CompressionOptions>({
    removeUnusedPhrases: true,
    removeUnusedChains: true,
    removeUnusedInstruments: true,
    removeUnusedTables: true,
    removeUnusedWaves: true,
    removeUnusedSamples: true,
    optimizeWaveforms: true,
    compressSamples: true,
    sampleBitDepth: 8,
    sampleRate: 11025
  });

  const stats = Compressor.getMemoryStats(currentProject);

  const handleCompress = () => {
    const optimizedProject = Compressor.optimizeProject(currentProject, options);
    onProjectChange(optimizedProject);
  };

  const memoryPercentage = Math.round((stats.usedSize / stats.totalSize) * 100);

  return (
    <div className="compression-manager">
      <div className="memory-stats">
        <h3>MEMORY USAGE</h3>
        <div className="memory-bar">
          <div 
            className="memory-bar-fill" 
            style={{ width: `${memoryPercentage}%` }}
          />
          <div className="memory-bar-text">
            {memoryPercentage}%
          </div>
        </div>
        <div className="stats-row">
          <label>TOTAL:</label>
          <span>{stats.usedSize} / {stats.totalSize} B</span>
        </div>
        <div className="stats-row">
          <label>PHRASES:</label>
          <span>{stats.phrases.toString(16).toUpperCase().padStart(2, '0')}h</span>
        </div>
        <div className="stats-row">
          <label>CHAINS:</label>
          <span>{stats.chains.toString(16).toUpperCase().padStart(2, '0')}h</span>
        </div>
        <div className="stats-row">
          <label>TABLES:</label>
          <span>{stats.tables.toString(16).toUpperCase().padStart(2, '0')}h</span>
        </div>
        <div className="stats-row">
          <label>WAVES:</label>
          <span>{stats.waves.toString(16).toUpperCase().padStart(2, '0')}h</span>
        </div>
        <div className="stats-row">
          <label>SAMPLES:</label>
          <span>{stats.samples.toString(16).toUpperCase().padStart(2, '0')}h</span>
        </div>
      </div>

      <div className="compression-options">
        <h3>OPTIMIZATION</h3>
        <label>
          <input
            type="checkbox"
            checked={options.removeUnusedPhrases}
            onChange={(e) => setOptions({
              ...options,
              removeUnusedPhrases: e.target.checked
            })}
          />
          UNUSED PHRASES
        </label>

        <label>
          <input
            type="checkbox"
            checked={options.removeUnusedChains}
            onChange={(e) => setOptions({
              ...options,
              removeUnusedChains: e.target.checked
            })}
          />
          Remove Unused Chains
        </label>

        <label>
          <input
            type="checkbox"
            checked={options.optimizeWaveforms}
            onChange={(e) => setOptions({
              ...options,
              optimizeWaveforms: e.target.checked
            })}
          />
          Optimize Waveforms
        </label>

        <label>
          <input
            type="checkbox"
            checked={options.compressSamples}
            onChange={(e) => setOptions({
              ...options,
              compressSamples: e.target.checked
            })}
          />
          Compress Samples
        </label>

        {options.compressSamples && (
          <>
            <div className="option-row">
              <label>BIT DEPTH:</label>
              <select
                value={options.sampleBitDepth}
                onChange={(e) => setOptions({
                  ...options,
                  sampleBitDepth: parseInt(e.target.value) as SampleBitDepth
                })}
              >
                <option value="8">8-BIT</option>
                <option value="16">16-BIT</option>
              </select>
            </div>

            <div className="option-row">
              <label>SAMPLE RATE:</label>
              <select
                value={options.sampleRate}
                onChange={(e) => setOptions({
                  ...options,
                  sampleRate: parseInt(e.target.value) as SampleRate
                })}
              >
                <option value="11025">11.025 KHZ</option>
                <option value="22050">22.050 KHZ</option>
                <option value="44100">44.100 KHZ</option>
              </select>
            </div>
          </>
        )}
      </div>

      <button onClick={handleCompress} className="compress-button">
        OPTIMIZE PROJECT
      </button>
    </div>
  );
}; 