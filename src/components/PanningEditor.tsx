import React from 'react';
import { PanningSettings, PanPosition } from '../types/panning';
import '../styles/PanningEditor.css';

interface PanningEditorProps {
  settings: PanningSettings;
  onSettingsChange: (settings: PanningSettings) => void;
}

export const PanningEditor: React.FC<PanningEditorProps> = ({
  settings,
  onSettingsChange
}) => {
  const handlePanChange = (channel: keyof Omit<PanningSettings, 'hardPan' | 'vibrato'>, position: PanPosition) => {
    onSettingsChange({
      ...settings,
      [channel]: position
    });
  };

  const handleHardPanChange = (hardPan: boolean) => {
    onSettingsChange({
      ...settings,
      hardPan
    });
  };

  const handleVibratoChange = (property: keyof PanningSettings['vibrato'], value: number | boolean) => {
    onSettingsChange({
      ...settings,
      vibrato: {
        ...settings.vibrato,
        [property]: value
      }
    });
  };

  return (
    <div className="panning-editor">
      <div className="channel-panning">
        <h3>Channel Panning</h3>
        {(['pulse1', 'pulse2', 'wave', 'noise'] as const).map(channel => (
          <div key={channel} className="pan-control">
            <label>{channel.toUpperCase()}</label>
            <div className="pan-buttons">
              <button
                className={settings[channel] === 'LEFT' ? 'active' : ''}
                onClick={() => handlePanChange(channel, 'LEFT')}
              >
                L
              </button>
              <button
                className={settings[channel] === 'CENTER' ? 'active' : ''}
                onClick={() => handlePanChange(channel, 'CENTER')}
              >
                C
              </button>
              <button
                className={settings[channel] === 'RIGHT' ? 'active' : ''}
                onClick={() => handlePanChange(channel, 'RIGHT')}
              >
                R
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pan-settings">
        <div className="setting-row">
          <label>Hard Pan:</label>
          <input
            type="checkbox"
            checked={settings.hardPan}
            onChange={(e) => handleHardPanChange(e.target.checked)}
          />
        </div>
      </div>

      <div className="vibrato-settings">
        <h3>Pan Vibrato</h3>
        <div className="setting-row">
          <label>Enabled:</label>
          <input
            type="checkbox"
            checked={settings.vibrato.enabled}
            onChange={(e) => handleVibratoChange('enabled', e.target.checked)}
          />
        </div>

        {settings.vibrato.enabled && (
          <>
            <div className="setting-row">
              <label>Speed:</label>
              <input
                type="range"
                min="0"
                max="15"
                value={settings.vibrato.speed}
                onChange={(e) => handleVibratoChange('speed', parseInt(e.target.value))}
              />
              <span className="value-display">
                {settings.vibrato.speed.toString(16).toUpperCase()}
              </span>
            </div>

            <div className="setting-row">
              <label>Depth:</label>
              <input
                type="range"
                min="0"
                max="15"
                value={settings.vibrato.depth}
                onChange={(e) => handleVibratoChange('depth', parseInt(e.target.value))}
              />
              <span className="value-display">
                {settings.vibrato.depth.toString(16).toUpperCase()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 