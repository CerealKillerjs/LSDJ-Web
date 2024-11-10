import React, { useEffect, useState } from 'react';
import { MIDISettings as MIDISettingsType, MIDIClockSource, MIDIChannel } from '../types/midi';
import '../styles/MIDISettings.css';

interface MIDISettingsProps {
  settings: MIDISettingsType;
  onSettingsChange: (settings: MIDISettingsType) => void;
}

export const MIDISettings: React.FC<MIDISettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [midiOutputs, setMidiOutputs] = useState<WebMidi.MIDIOutput[]>([]);
  const [selectedInput, setSelectedInput] = useState<string>('');
  const [selectedOutput, setSelectedOutput] = useState<string>('');

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(access => {
          const inputs = Array.from(access.inputs.values());
          const outputs = Array.from(access.outputs.values());
          setMidiInputs(inputs);
          setMidiOutputs(outputs);
        })
        .catch(err => console.error('MIDI access denied:', err));
    }
  }, []);

  const handleClockSourceChange = (source: MIDIClockSource) => {
    onSettingsChange({ ...settings, clockSource: source });
  };

  const handleChannelChange = (channel: MIDIChannel) => {
    onSettingsChange({ ...settings, channel });
  };

  const handleTransposeChange = (transpose: number) => {
    onSettingsChange({
      ...settings,
      transpose: Math.max(-48, Math.min(48, transpose))
    });
  };

  return (
    <div className="midi-settings">
      <div className="settings-section">
        <h3>MIDI Clock</h3>
        <div className="setting-row">
          <label>Source:</label>
          <select
            value={settings.clockSource}
            onChange={(e) => handleClockSourceChange(e.target.value as MIDIClockSource)}
          >
            <option value="INTERNAL">Internal</option>
            <option value="EXTERNAL">External</option>
            <option value="AUTO">Auto</option>
          </select>
        </div>

        <div className="setting-row">
          <label>Sync:</label>
          <input
            type="checkbox"
            checked={settings.sync}
            onChange={(e) => onSettingsChange({
              ...settings,
              sync: e.target.checked
            })}
          />
        </div>

        <div className="setting-row">
          <label>Send Clock:</label>
          <input
            type="checkbox"
            checked={settings.sendClock}
            onChange={(e) => onSettingsChange({
              ...settings,
              sendClock: e.target.checked
            })}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>MIDI Input</h3>
        <div className="setting-row">
          <label>Device:</label>
          <select
            value={selectedInput}
            onChange={(e) => setSelectedInput(e.target.value)}
          >
            <option value="">None</option>
            {midiInputs.map(input => (
              <option key={input.id} value={input.id}>
                {input.name}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <label>Channel:</label>
          <select
            value={settings.channel}
            onChange={(e) => handleChannelChange(parseInt(e.target.value) as MIDIChannel)}
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <label>Transpose:</label>
          <input
            type="number"
            min="-48"
            max="48"
            value={settings.transpose}
            onChange={(e) => handleTransposeChange(parseInt(e.target.value))}
          />
        </div>

        <div className="setting-row">
          <label>Velocity:</label>
          <input
            type="checkbox"
            checked={settings.velocitySensitive}
            onChange={(e) => onSettingsChange({
              ...settings,
              velocitySensitive: e.target.checked
            })}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>MIDI Output</h3>
        <div className="setting-row">
          <label>Device:</label>
          <select
            value={selectedOutput}
            onChange={(e) => setSelectedOutput(e.target.value)}
          >
            <option value="">None</option>
            {midiOutputs.map(output => (
              <option key={output.id} value={output.id}>
                {output.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 