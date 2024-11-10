import React, { useState, useEffect } from 'react';
import { LiveSettings, KeyBinding, LiveAction } from '../types/live';
import { LSDJSynth } from '../synth/Synth';
import '../styles/LiveMode.css';

interface LiveModeProps {
  settings: LiveSettings;
  onSettingsChange: (settings: LiveSettings) => void;
  synth: LSDJSynth;
}

export const LiveMode: React.FC<LiveModeProps> = ({
  settings,
  onSettingsChange,
  synth
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeSequences, setActiveSequences] = useState<number[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const binding = settings.keyBindings.find(b => b.key === e.key);
      if (!binding) return;

      executeAction(binding.action, binding.parameter);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings]);

  const executeAction = (action: LiveAction, parameter?: number) => {
    switch (action) {
      case 'PLAY_NOTE':
        playNote(parameter || settings.octave);
        break;
      case 'MUTE_CHANNEL':
        toggleChannelMute(settings.activeChannel);
        break;
      case 'SOLO_CHANNEL':
        soloChannel(settings.activeChannel);
        break;
      case 'CHANGE_INSTRUMENT':
        changeInstrument(parameter || 0);
        break;
      case 'TRIGGER_TABLE':
        triggerTable(parameter || 0);
        break;
      case 'START_SEQUENCE':
        startSequence(parameter || 0);
        break;
      case 'STOP_SEQUENCE':
        stopSequence(parameter || 0);
        break;
    }
  };

  const playNote = (octave: number) => {
    const note = `C${octave}`;
    switch (settings.activeChannel) {
      case 'pulse1':
        synth.playPulse1(note);
        break;
      case 'pulse2':
        synth.playPulse2(note);
        break;
      case 'wave':
        synth.playWave(note);
        break;
      case 'noise':
        synth.playNoise();
        break;
    }
  };

  const toggleChannelMute = (channel: string) => {
    // Implementar lógica de mute
  };

  const soloChannel = (channel: string) => {
    // Implementar lógica de solo
  };

  const changeInstrument = (instrumentId: number) => {
    // Implementar cambio de instrumento
  };

  const triggerTable = (tableId: number) => {
    // Implementar trigger de tabla
  };

  const startSequence = (sequenceId: number) => {
    if (!activeSequences.includes(sequenceId)) {
      setActiveSequences([...activeSequences, sequenceId]);
      playSequence(sequenceId);
    }
  };

  const stopSequence = (sequenceId: number) => {
    setActiveSequences(activeSequences.filter(id => id !== sequenceId));
  };

  const playSequence = async (sequenceId: number) => {
    const sequence = settings.sequences.find(s => s.id === sequenceId);
    if (!sequence) return;

    for (const note of sequence.notes) {
      if (!activeSequences.includes(sequenceId)) break;
      
      switch (settings.activeChannel) {
        case 'pulse1':
          synth.playPulse1(note);
          break;
        case 'pulse2':
          synth.playPulse2(note);
          break;
        case 'wave':
          synth.playWave(note);
          break;
        case 'noise':
          synth.playNoise();
          break;
      }
      
      await new Promise(r => setTimeout(r, sequence.duration));
    }

    if (sequence.loop && activeSequences.includes(sequenceId)) {
      playSequence(sequenceId);
    }
  };

  return (
    <div className="live-mode">
      <div className="channel-controls">
        <h3>Channel</h3>
        {['pulse1', 'pulse2', 'wave', 'noise'].map(channel => (
          <button
            key={channel}
            className={settings.activeChannel === channel ? 'active' : ''}
            onClick={() => onSettingsChange({
              ...settings,
              activeChannel: channel as LiveSettings['activeChannel']
            })}
          >
            {channel.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="octave-controls">
        <h3>Octave</h3>
        <div className="control-row">
          <button onClick={() => onSettingsChange({
            ...settings,
            octave: Math.max(1, settings.octave - 1)
          })}>-</button>
          <span>{settings.octave}</span>
          <button onClick={() => onSettingsChange({
            ...settings,
            octave: Math.min(8, settings.octave + 1)
          })}>+</button>
        </div>
      </div>

      <div className="sequence-controls">
        <h3>Sequences</h3>
        {settings.sequences.map(sequence => (
          <div key={sequence.id} className="sequence-row">
            <span>{sequence.id}</span>
            <button
              className={activeSequences.includes(sequence.id) ? 'active' : ''}
              onClick={() => activeSequences.includes(sequence.id) 
                ? stopSequence(sequence.id)
                : startSequence(sequence.id)
              }
            >
              {activeSequences.includes(sequence.id) ? '■' : '▶'}
            </button>
            <span>{sequence.loop ? '↻' : '→'}</span>
          </div>
        ))}
      </div>

      <div className="key-bindings">
        <h3>Key Bindings</h3>
        {settings.keyBindings.map((binding, index) => (
          <div key={index} className="binding-row">
            <span className="key">{binding.key}</span>
            <span className="action">{binding.action}</span>
            {binding.parameter !== undefined && (
              <span className="parameter">{binding.parameter}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 