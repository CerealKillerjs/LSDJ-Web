import React, { useState, useRef } from 'react';
import { Kit, Sample } from '../types/kit';
import * as Tone from 'tone';
import '../styles/KitEditor.css';

interface KitEditorProps {
  kit: Kit;
  onKitChange: (kit: Kit) => void;
}

export const KitEditor: React.FC<KitEditorProps> = ({ kit, onKitChange }) => {
  const [selectedSample, setSelectedSample] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<Tone.Player | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const newSample: Sample = {
      id: kit.samples.length,
      name: file.name,
      data: audioBuffer,
      length: audioBuffer.length,
      rate: audioBuffer.sampleRate,
      start: 0,
      end: audioBuffer.length,
      loop: {
        enabled: false,
        start: 0,
        end: audioBuffer.length
      }
    };

    const newKit = {
      ...kit,
      samples: [...kit.samples, newSample]
    };

    onKitChange(newKit);
  };

  const playSample = async (sample: Sample) => {
    if (isPlaying) {
      playerRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    const numberOfChannels = sample.data.numberOfChannels;
    const length = sample.data.length;
    const sampleArray = new Float32Array(length * numberOfChannels);
    
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = sample.data.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        sampleArray[i * numberOfChannels + channel] = channelData[i];
      }
    }

    const wavBlob = new Blob([createWAV(sampleArray, sample.data.sampleRate)], { type: 'audio/wav' });

    const player = new Tone.Player({
      url: URL.createObjectURL(wavBlob),
      onload: () => {
        player.start();
        setIsPlaying(true);
      },
      onstop: () => {
        setIsPlaying(false);
      }
    }).toDestination();

    playerRef.current = player;
  };

  const handleSampleChange = (sampleId: number, changes: Partial<Sample>) => {
    const newKit = {
      ...kit,
      samples: kit.samples.map(sample => 
        sample.id === sampleId ? { ...sample, ...changes } : sample
      )
    };
    onKitChange(newKit);
  };

  return (
    <div className="kit-editor">
      <div className="kit-info">
        <h3>Kit: {kit.name}</h3>
        <input
          type="text"
          value={kit.name}
          onChange={(e) => onKitChange({ ...kit, name: e.target.value })}
        />
      </div>

      <div className="sample-list">
        {kit.samples.map((sample, index) => (
          <div
            key={sample.id}
            className={`sample-item ${selectedSample === index ? 'selected' : ''}`}
            onClick={() => setSelectedSample(index)}
          >
            <span className="sample-number">
              {index.toString(16).toUpperCase().padStart(2, '0')}
            </span>
            <span className="sample-name">{sample.name}</span>
            <button onClick={() => playSample(sample)}>
              {isPlaying && selectedSample === index ? '■' : '▶'}
            </button>
          </div>
        ))}
      </div>

      <div className="sample-controls">
        <button onClick={() => fileInputRef.current?.click()}>
          Import Sample
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {kit.samples[selectedSample] && (
          <div className="sample-editor">
            <div className="control-group">
              <label>Start:</label>
              <input
                type="number"
                value={kit.samples[selectedSample].start}
                onChange={(e) => handleSampleChange(
                  kit.samples[selectedSample].id,
                  { start: parseInt(e.target.value) }
                )}
              />
            </div>

            <div className="control-group">
              <label>End:</label>
              <input
                type="number"
                value={kit.samples[selectedSample].end}
                onChange={(e) => handleSampleChange(
                  kit.samples[selectedSample].id,
                  { end: parseInt(e.target.value) }
                )}
              />
            </div>

            <div className="loop-controls">
              <label>
                <input
                  type="checkbox"
                  checked={kit.samples[selectedSample].loop.enabled}
                  onChange={(e) => handleSampleChange(
                    kit.samples[selectedSample].id,
                    { loop: { ...kit.samples[selectedSample].loop, enabled: e.target.checked } }
                  )}
                />
                Loop
              </label>

              {kit.samples[selectedSample].loop.enabled && (
                <>
                  <div className="control-group">
                    <label>Loop Start:</label>
                    <input
                      type="number"
                      value={kit.samples[selectedSample].loop.start}
                      onChange={(e) => handleSampleChange(
                        kit.samples[selectedSample].id,
                        { 
                          loop: { 
                            ...kit.samples[selectedSample].loop,
                            start: parseInt(e.target.value)
                          }
                        }
                      )}
                    />
                  </div>

                  <div className="control-group">
                    <label>Loop End:</label>
                    <input
                      type="number"
                      value={kit.samples[selectedSample].loop.end}
                      onChange={(e) => handleSampleChange(
                        kit.samples[selectedSample].id,
                        { 
                          loop: { 
                            ...kit.samples[selectedSample].loop,
                            end: parseInt(e.target.value)
                          }
                        }
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function createWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // WAV Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Convert Float32Array to Int16Array
  const length = samples.length;
  const index = 44;
  for (let i = 0; i < length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(index + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
} 