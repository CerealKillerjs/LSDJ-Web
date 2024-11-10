import React from 'react';
import { WaveTableEditor } from './WaveTableEditor';
import { Visualizer } from './Visualizer';
import * as Tone from 'tone';
import '../styles/WaveScreen.css';

interface WaveScreenProps {
  onWaveformChange: (waveform: Float32Array) => void;
  isPlaying: boolean;
  currentPosition: {
    song: number;
    chain: number;
    phrase: number;
    step: number;
  };
  channels: {
    pulse1: Tone.Analyser;
    pulse2: Tone.Analyser;
    wave: Tone.Analyser;
    noise: Tone.Analyser;
  };
}

export const WaveScreen: React.FC<WaveScreenProps> = ({
  onWaveformChange,
  isPlaying,
  currentPosition,
  channels
}) => {
  return (
    <div className="wave-screen">
      <div className="wave-editor">
        <h3>Wave Table</h3>
        <WaveTableEditor onWaveformChange={onWaveformChange} />
      </div>
      
      <div className="wave-visualizer">
        <h3>Visualizer</h3>
        <Visualizer
          isPlaying={isPlaying}
          currentPosition={currentPosition}
          channels={channels}
        />
      </div>
    </div>
  );
}; 