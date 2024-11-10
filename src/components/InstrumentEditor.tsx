import React, { useState } from 'react';
import { Instrument, EnvelopeType } from '../types/instrument';
import '../styles/InstrumentEditor.css';
import { TableSection } from './TableSection';
import { Table } from '../types/effects';
import { Project } from '../types/project';

interface InstrumentEditorProps {
  instrument: Instrument;
  onInstrumentChange: (instrument: Instrument) => void;
  currentProject: Project;
  onProjectChange: (project: Project) => void;
}

export const InstrumentEditor: React.FC<InstrumentEditorProps> = ({ 
  instrument, 
  onInstrumentChange,
  currentProject,
  onProjectChange
}) => {
  const [activeTab, setActiveTab] = useState<'ENV' | 'SOUND' | 'TABLE'>('ENV');

  const handleEnvelopeChange = (param: keyof typeof instrument.envelope, value: number) => {
    const newInstrument = { ...instrument };
    if (param !== 'type') {
      newInstrument.envelope[param] = Math.max(0, Math.min(15, value));
    }
    onInstrumentChange(newInstrument);
  };

  const renderPulseControls = () => {
    if (instrument.type !== 'PULSE') return null;
    return (
      <>
        <div className="control-group">
          <label>Pulse Width:</label>
          <select
            value={instrument.pulseWidth}
            onChange={(e) => {
              const newInstrument = { ...instrument };
              newInstrument.pulseWidth = parseFloat(e.target.value);
              onInstrumentChange(newInstrument);
            }}
          >
            <option value={0.125}>12.5%</option>
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
          </select>
        </div>

        <div className="sweep-controls">
          <h4>Sweep</h4>
          <div className="control-group">
            <label>Type:</label>
            <select
              value={instrument.sweep.type}
              onChange={(e) => {
                const newInstrument = { ...instrument };
                newInstrument.sweep.type = e.target.value as 'UP' | 'DOWN' | 'NONE';
                onInstrumentChange(newInstrument);
              }}
            >
              <option value="NONE">None</option>
              <option value="UP">Up</option>
              <option value="DOWN">Down</option>
            </select>
          </div>

          {instrument.sweep.type !== 'NONE' && (
            <>
              <div className="control-group">
                <label>Speed:</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={instrument.sweep.speed}
                  onChange={(e) => {
                    const newInstrument = { ...instrument };
                    newInstrument.sweep.speed = parseInt(e.target.value);
                    onInstrumentChange(newInstrument);
                  }}
                />
              </div>
              <div className="control-group">
                <label>Intensity:</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={instrument.sweep.intensity}
                  onChange={(e) => {
                    const newInstrument = { ...instrument };
                    newInstrument.sweep.intensity = parseInt(e.target.value);
                    onInstrumentChange(newInstrument);
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="vibrato-controls">
          <h4>Vibrato</h4>
          <div className="control-group">
            <label>Speed:</label>
            <input
              type="number"
              min="0"
              max="15"
              value={instrument.vibrato.speed}
              onChange={(e) => {
                const newInstrument = { ...instrument };
                newInstrument.vibrato.speed = parseInt(e.target.value);
                onInstrumentChange(newInstrument);
              }}
            />
          </div>
          <div className="control-group">
            <label>Depth:</label>
            <input
              type="number"
              min="0"
              max="15"
              value={instrument.vibrato.depth}
              onChange={(e) => {
                const newInstrument = { ...instrument };
                newInstrument.vibrato.depth = parseInt(e.target.value);
                onInstrumentChange(newInstrument);
              }}
            />
          </div>
          <div className="control-group">
            <label>Delay:</label>
            <input
              type="number"
              min="0"
              max="15"
              value={instrument.vibrato.delay}
              onChange={(e) => {
                const newInstrument = { ...instrument };
                newInstrument.vibrato.delay = parseInt(e.target.value);
                onInstrumentChange(newInstrument);
              }}
            />
          </div>
        </div>
      </>
    );
  };

  const renderWaveControls = () => {
    if (instrument.type !== 'WAVE') return null;
    return (
      <div className="wave-controls">
        <div className="control-group">
          <label>Waveform:</label>
          <select
            value={instrument.waveform}
            onChange={(e) => {
              const newInstrument = { ...instrument };
              newInstrument.waveform = e.target.value as 'SQUARE' | 'SAW' | 'TRIANGLE' | 'CUSTOM';
              onInstrumentChange(newInstrument);
            }}
          >
            <option value="SQUARE">Square</option>
            <option value="SAW">Saw</option>
            <option value="TRIANGLE">Triangle</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>
      </div>
    );
  };

  const renderNoiseControls = () => {
    if (instrument.type !== 'NOISE') return null;
    return (
      <div className="noise-controls">
        <div className="control-group">
          <label>Shape:</label>
          <input
            type="number"
            min="0"
            max="127"
            value={instrument.shape}
            onChange={(e) => {
              const newInstrument = { ...instrument };
              newInstrument.shape = parseInt(e.target.value);
              onInstrumentChange(newInstrument);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="instrument-editor">
      <div className="tabs">
        <button
          className={activeTab === 'ENV' ? 'active' : ''}
          onClick={() => setActiveTab('ENV')}
        >
          ENV
        </button>
        <button
          className={activeTab === 'SOUND' ? 'active' : ''}
          onClick={() => setActiveTab('SOUND')}
        >
          SOUND
        </button>
        <button
          className={activeTab === 'TABLE' ? 'active' : ''}
          onClick={() => setActiveTab('TABLE')}
        >
          TABLE
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'ENV' && (
          <div className="envelope-editor">
            <div className="control-group">
              <label>Type:</label>
              <select
                value={instrument.envelope.type}
                onChange={(e) => {
                  const newInstrument = { ...instrument };
                  newInstrument.envelope.type = e.target.value as EnvelopeType;
                  onInstrumentChange(newInstrument);
                }}
              >
                <option value="LINEAR">Linear</option>
                <option value="EXPONENTIAL">Exponential</option>
              </select>
            </div>

            {['attack', 'decay', 'sustain', 'release'].map(param => (
              <div key={param} className="control-group">
                <label>{param.toUpperCase()}:</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={instrument.envelope[param as keyof typeof instrument.envelope]}
                  onChange={(e) => handleEnvelopeChange(
                    param as keyof typeof instrument.envelope,
                    parseInt(e.target.value)
                  )}
                />
                <span className="hex-value">
                  {instrument.envelope[param as keyof typeof instrument.envelope]
                    .toString(16)
                    .toUpperCase()
                    .padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SOUND' && (
          <div className="sound-editor">
            {renderPulseControls()}
            {renderWaveControls()}
            {renderNoiseControls()}

            <div className="output-controls">
              <label>Output:</label>
              <div className="output-buttons">
                <button
                  className={`output-button ${instrument.outputChannel === 'LEFT' ? 'active' : ''}`}
                  onClick={() => {
                    const newInstrument = { ...instrument };
                    newInstrument.outputChannel = 'LEFT';
                    onInstrumentChange(newInstrument);
                  }}
                >
                  LEFT
                </button>
                <button
                  className={`output-button ${instrument.outputChannel === 'BOTH' ? 'active' : ''}`}
                  onClick={() => {
                    const newInstrument = { ...instrument };
                    newInstrument.outputChannel = 'BOTH';
                    onInstrumentChange(newInstrument);
                  }}
                >
                  BOTH
                </button>
                <button
                  className={`output-button ${instrument.outputChannel === 'RIGHT' ? 'active' : ''}`}
                  onClick={() => {
                    const newInstrument = { ...instrument };
                    newInstrument.outputChannel = 'RIGHT';
                    onInstrumentChange(newInstrument);
                  }}
                >
                  RIGHT
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TABLE' && (
          <div className="table-editor">
            <div className="table-selector">
              <label>Table:</label>
              <select
                value={instrument.tableId || 'NONE'}
                onChange={(e) => {
                  const newInstrument = { ...instrument };
                  newInstrument.tableId = e.target.value === 'NONE' ? undefined : parseInt(e.target.value);
                  onInstrumentChange(newInstrument);
                }}
              >
                <option value="NONE">None</option>
                {Array(16).fill(0).map((_, i) => (
                  <option key={i} value={i}>Table {i.toString(16).toUpperCase().padStart(2, '0')}</option>
                ))}
              </select>
            </div>

            {instrument.tableId !== undefined && (
              <TableSection
                steps={currentProject.tables[instrument.tableId]?.steps || Array(16).fill({
                  effects: [],
                  transpose: 0,
                  volume: 15
                })}
                onStepsChange={(newSteps) => {
                  const newTable: Table = {
                    id: instrument.tableId!,
                    steps: newSteps
                  };
                  const newTables = [...currentProject.tables];
                  const existingIndex = newTables.findIndex(t => t.id === instrument.tableId);
                  if (existingIndex >= 0) {
                    newTables[existingIndex] = newTable;
                  } else {
                    newTables.push(newTable);
                  }
                  onProjectChange({
                    ...currentProject,
                    tables: newTables
                  });
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 