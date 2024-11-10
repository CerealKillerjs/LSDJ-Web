import React, { useState } from 'react';
import { Table, TableStep, Effect, EffectType } from '../types/effects';
import '../styles/TableEditor.css';

interface TableEditorProps {
  table: Table;
  onTableChange: (table: Table) => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({ table, onTableChange }) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [selectedEffect, setSelectedEffect] = useState<number>(0);

  const handleEffectTypeChange = (effectIndex: number, type: EffectType) => {
    const newTable = { ...table };
    newTable.steps[selectedStep].effects[effectIndex].type = type;
    onTableChange(newTable);
  };

  const handleEffectValueChange = (effectIndex: number, value: number) => {
    const newTable = { ...table };
    newTable.steps[selectedStep].effects[effectIndex].value = value;
    onTableChange(newTable);
  };

  const handleTransposeChange = (transpose: number) => {
    const newTable = { ...table };
    newTable.steps[selectedStep].transpose = transpose;
    onTableChange(newTable);
  };

  const handleVolumeChange = (volume: number) => {
    const newTable = { ...table };
    newTable.steps[selectedStep].volume = volume;
    onTableChange(newTable);
  };

  return (
    <div className="table-editor">
      <div className="table-steps">
        {table.steps.map((step, index) => (
          <div
            key={index}
            className={`table-step ${selectedStep === index ? 'selected' : ''}`}
            onClick={() => setSelectedStep(index)}
          >
            <div className="step-number">{index.toString(16).toUpperCase().padStart(2, '0')}</div>
            <div className="step-effects">
              {step.effects.map((effect, effectIndex) => (
                <div key={effectIndex} className="effect">
                  {effect.type} {effect.value.toString(16).toUpperCase().padStart(2, '0')}
                </div>
              ))}
            </div>
            <div className="step-transpose">
              {step.transpose >= 0 ? '+' : ''}{step.transpose}
            </div>
            <div className="step-volume">
              V:{step.volume.toString(16).toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="effect-editor">
        <div className="effect-selector">
          {table.steps[selectedStep].effects.map((effect, index) => (
            <button
              key={index}
              className={`effect-button ${selectedEffect === index ? 'selected' : ''}`}
              onClick={() => setSelectedEffect(index)}
            >
              Effect {index + 1}
            </button>
          ))}
        </div>

        <div className="effect-controls">
          <select
            value={table.steps[selectedStep].effects[selectedEffect].type}
            onChange={(e) => handleEffectTypeChange(selectedEffect, e.target.value as EffectType)}
          >
            <option value="ARP">ARP - Arpegio</option>
            <option value="PAN">PAN - Paneo</option>
            <option value="VIB">VIB - Vibrato</option>
            <option value="WAV">WAV - Wave</option>
            <option value="PIT">PIT - Pitch</option>
            <option value="HOP">HOP - Jump</option>
            <option value="KIT">KIT - Kit</option>
            <option value="VOL">VOL - Volume</option>
          </select>

          <input
            type="number"
            min="0"
            max="255"
            value={table.steps[selectedStep].effects[selectedEffect].value}
            onChange={(e) => handleEffectValueChange(selectedEffect, parseInt(e.target.value))}
          />
        </div>

        <div className="step-controls">
          <div className="transpose-control">
            <label>Transpose:</label>
            <input
              type="number"
              min="-128"
              max="127"
              value={table.steps[selectedStep].transpose}
              onChange={(e) => handleTransposeChange(parseInt(e.target.value))}
            />
          </div>

          <div className="volume-control">
            <label>Volume:</label>
            <input
              type="number"
              min="0"
              max="15"
              value={table.steps[selectedStep].volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 