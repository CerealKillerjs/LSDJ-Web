import React, { useEffect, useRef } from 'react';
import { PlaybackSettings, PlayMode, SyncMode, PlaybackState } from '../types/playback';
import { Project } from '../types/project';
import { LSDJSynth } from '../synth/Synth';
import * as Tone from 'tone';
import '../styles/PlaybackControls.css';
import { transposeNote } from '../utils/musicUtils';

interface PlaybackControlsProps {
  settings: PlaybackSettings;
  onSettingsChange: (settings: PlaybackSettings) => void;
  currentProject: Project;
  synth: LSDJSynth;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  settings,
  onSettingsChange,
  currentProject,
  synth
}) => {
  const playbackInterval = useRef<number | null>(null);

  useEffect(() => {
    // Asegurarnos de que Tone.js está inicializado al montar el componente
    const initTone = async () => {
      await Tone.start();
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    };
    initTone();

    return () => {
      stopPlayback();
    };
  }, []);

  const startPlayback = async () => {
    try {
      if (!currentProject.phrases || currentProject.phrases.length === 0) {
        console.error('No phrases found in project');
        return;
      }

      if (playbackInterval.current) return;

      // Asegurarnos de que Tone.js está inicializado
      await Tone.start();
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }

      // Configurar el tempo
      Tone.Transport.bpm.value = settings.tempo;

      let currentStep = settings.position.step;
      let currentPhrase = settings.position.phrase;
      let currentRow = settings.position.song;

      const scheduleRepeat = Tone.Transport.scheduleRepeat((time) => {
        const songRow = currentProject.song.rows[currentRow];
        if (!songRow) return;

        // Reproducir Pulse 1
        if (songRow.chains.pulse1 !== 255) {
          const pulse1Chain = currentProject.chains.find(c => c.id === songRow.chains.pulse1);
          if (pulse1Chain?.steps[currentPhrase]) {
            const phraseId = pulse1Chain.steps[currentPhrase].phraseId;
            const phrase = currentProject.phrases.find(p => p.id === phraseId);
            const note = phrase?.notes[currentStep];
            if (phrase && note && note.note !== '---') {
              const transpose = pulse1Chain.steps[currentPhrase].transpose;
              synth.playPulse1(transposeNote(note.note, transpose), '16n', note.effects);
            }
          }
        }

        // Reproducir Pulse 2
        if (songRow.chains.pulse2 !== 255) {
          const pulse2Chain = currentProject.chains.find(c => c.id === songRow.chains.pulse2);
          if (pulse2Chain?.steps[currentPhrase]) {
            const phraseId = pulse2Chain.steps[currentPhrase].phraseId;
            const phrase = currentProject.phrases.find(p => p.id === phraseId);
            const note = phrase?.notes[currentStep];
            if (phrase && note && note.note !== '---') {
              const transpose = pulse2Chain.steps[currentPhrase].transpose;
              synth.playPulse2(transposeNote(note.note, transpose), '16n', note.effects);
            }
          }
        }

        // Reproducir Wave
        if (songRow.chains.wave !== 255) {
          const waveChain = currentProject.chains.find(c => c.id === songRow.chains.wave);
          if (waveChain?.steps[currentPhrase]) {
            const phraseId = waveChain.steps[currentPhrase].phraseId;
            const phrase = currentProject.phrases.find(p => p.id === phraseId);
            const note = phrase?.notes[currentStep];
            if (phrase && note && note.note !== '---') {
              const transpose = waveChain.steps[currentPhrase].transpose;
              synth.playWave(transposeNote(note.note, transpose), '16n', note.effects);
            }
          }
        }

        // Reproducir Noise
        if (songRow.chains.noise !== 255) {
          const noiseChain = currentProject.chains.find(c => c.id === songRow.chains.noise);
          if (noiseChain?.steps[currentPhrase]) {
            const phraseId = noiseChain.steps[currentPhrase].phraseId;
            const phrase = currentProject.phrases.find(p => p.id === phraseId);
            const note = phrase?.notes[currentStep];
            if (phrase && note && note.note !== '---') {
              synth.playNoise('16n', note.effects);
            }
          }
        }

        // Avanzar al siguiente paso
        currentStep++;
        if (currentStep >= 16) {
          currentStep = 0;
          currentPhrase++;
          
          if (currentPhrase >= 16) {
            currentPhrase = 0;
            currentRow++;
            
            if (currentRow >= currentProject.song.rows.length) {
              if (settings.loop.enabled) {
                currentRow = settings.loop.start;
              } else {
                currentRow = 0;
              }
            }
          }
        }

        // Actualizar la posición
        onSettingsChange({
          ...settings,
          position: {
            song: currentRow,
            chain: currentPhrase,
            phrase: currentPhrase,
            step: currentStep
          }
        });
      }, "16n");

      playbackInterval.current = scheduleRepeat;
      Tone.Transport.start();

    } catch (error) {
      console.error('Error starting playback:', error);
      stopPlayback();
    }
  };

  const stopPlayback = () => {
    if (playbackInterval.current) {
      Tone.Transport.clear(playbackInterval.current);
      playbackInterval.current = null;
    }
    
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    // Reiniciar la posición al principio ANTES de actualizar el estado
    const newSettings = {
      ...settings,
      state: 'STOPPED' as const,
      position: {
        song: 0,
        chain: 0,
        phrase: 0,
        step: 0
      }
    };
    
    onSettingsChange(newSettings);
  };

  const handlePlayStateChange = async (state: PlaybackState) => {
    if (state === 'PLAYING') {
      await startPlayback();
    } else if (state === 'PAUSED') {
      Tone.Transport.pause();
      onSettingsChange({
        ...settings,
        state: 'PAUSED'
      });
    } else {
      stopPlayback();
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopPlayback();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  const handleModeChange = (mode: PlayMode) => {
    onSettingsChange({ ...settings, mode });
  };

  const handleSyncChange = (sync: SyncMode) => {
    onSettingsChange({ ...settings, sync });
  };

  const handleTempoChange = (tempo: number) => {
    onSettingsChange({
      ...settings,
      tempo: Math.max(40, Math.min(295, tempo))
    });
  };

  const handleLoopToggle = () => {
    onSettingsChange({
      ...settings,
      loop: {
        ...settings.loop,
        enabled: !settings.loop.enabled
      }
    });
  };

  const handleLoopPointChange = (start: number, end: number) => {
    onSettingsChange({
      ...settings,
      loop: {
        ...settings.loop,
        start: Math.max(0, start),
        end: Math.min(255, end)
      }
    });
  };

  const handlePositionChange = (type: 'song' | 'chain' | 'phrase' | 'step', value: number) => {
    const newPosition = {
      ...settings.position,
      [type]: value
    };

    // Validar límites
    newPosition.song = Math.max(0, Math.min(newPosition.song, currentProject.song.rows.length - 1));
    newPosition.chain = Math.max(0, Math.min(newPosition.chain, 15));
    newPosition.phrase = Math.max(0, Math.min(newPosition.phrase, 15));
    newPosition.step = Math.max(0, Math.min(newPosition.step, 15));

    onSettingsChange({
      ...settings,
      position: newPosition
    });
  };

  return (
    <div className="playback-controls">
      <div className="transport-controls">
        <button
          className={settings.state === 'PLAYING' ? 'active' : ''}
          onClick={() => handlePlayStateChange('PLAYING')}
        >
          PLAY
        </button>
        <button
          className={settings.state === 'STOPPED' ? 'active' : ''}
          onClick={() => handlePlayStateChange('STOPPED')}
        >
          STOP
        </button>
        <button
          className={settings.state === 'PAUSED' ? 'active' : ''}
          onClick={() => handlePlayStateChange('PAUSED')}
        >
          PAUSE
        </button>
      </div>

      <div className="position-controls">
        <div className="position-row">
          <label>Song:</label>
          <input
            type="number"
            min="0"
            max={currentProject.song.rows.length - 1}
            value={settings.position.song}
            onChange={(e) => handlePositionChange('song', parseInt(e.target.value))}
          />
          <span className="hex-value">
            {settings.position.song.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>

        <div className="position-row">
          <label>Chain:</label>
          <input
            type="number"
            min="0"
            max="15"
            value={settings.position.chain}
            onChange={(e) => handlePositionChange('chain', parseInt(e.target.value))}
          />
          <span className="hex-value">
            {settings.position.chain.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>

        <div className="position-row">
          <label>Phrase:</label>
          <input
            type="number"
            min="0"
            max="15"
            value={settings.position.phrase}
            onChange={(e) => handlePositionChange('phrase', parseInt(e.target.value))}
          />
          <span className="hex-value">
            {settings.position.phrase.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>

        <div className="position-row">
          <label>Step:</label>
          <input
            type="number"
            min="0"
            max="15"
            value={settings.position.step}
            onChange={(e) => handlePositionChange('step', parseInt(e.target.value))}
          />
          <span className="hex-value">
            {settings.position.step.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="mode-controls">
        <div className="control-group">
          <label>Mode:</label>
          <select
            value={settings.mode}
            onChange={(e) => handleModeChange(e.target.value as PlayMode)}
          >
            <option value="SONG">SONG</option>
            <option value="CHAIN">CHAIN</option>
            <option value="PHRASE">PHRASE</option>
            <option value="LIVE">LIVE</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sync:</label>
          <select
            value={settings.sync}
            onChange={(e) => handleSyncChange(e.target.value as SyncMode)}
          >
            <option value="OFF">OFF</option>
            <option value="MIDI">MIDI</option>
            <option value="LTC">LTC</option>
            <option value="INTERNAL">INT</option>
          </select>
        </div>

        <div className="control-group">
          <label>Tempo:</label>
          <input
            type="number"
            min="40"
            max="295"
            value={settings.tempo}
            onChange={(e) => handleTempoChange(parseInt(e.target.value))}
          />
          <span>BPM</span>
        </div>
      </div>

      <div className="loop-controls">
        <div className="control-group">
          <label>Loop:</label>
          <button
            className={settings.loop.enabled ? 'active' : ''}
            onClick={handleLoopToggle}
          >
            {settings.loop.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {settings.loop.enabled && (
          <>
            <div className="control-group">
              <label>Start:</label>
              <input
                type="number"
                min="0"
                max="255"
                value={settings.loop.start}
                onChange={(e) => handleLoopPointChange(
                  parseInt(e.target.value),
                  settings.loop.end
                )}
              />
            </div>
            <div className="control-group">
              <label>End:</label>
              <input
                type="number"
                min="0"
                max="255"
                value={settings.loop.end}
                onChange={(e) => handleLoopPointChange(
                  settings.loop.start,
                  parseInt(e.target.value)
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 