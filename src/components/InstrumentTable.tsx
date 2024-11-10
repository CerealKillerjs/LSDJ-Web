import React, { useState } from 'react';
import { Effect } from '../types/effects';

interface InstrumentTableProps {
  steps: Array<{
    command: string;
    value: number;
  }>;
  onStepChange: (index: number, command: string, value: number) => void;
}

export const InstrumentTable: React.FC<InstrumentTableProps> = ({
  steps,
  onStepChange
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const commands = ['---', 'VOL', 'PAN', 'TRAN', 'VIB', 'ARP'];

  return (
    <div className="instrument-table">
      <div className="table-header">
        <span>STEP</span>
        <span>CMD</span>
        <span>VAL</span>
      </div>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`table-row ${index === selectedStep ? 'selected' : ''}`}
          onClick={() => setSelectedStep(index)}
        >
          <span className="step-number">
            {index.toString(16).toUpperCase().padStart(2, '0')}
          </span>
          <select
            value={step.command}
            onChange={(e) => onStepChange(index, e.target.value, step.value)}
          >
            {commands.map(cmd => (
              <option key={cmd} value={cmd}>{cmd}</option>
            ))}
          </select>
          <input
            type="text"
            maxLength={2}
            value={step.value.toString(16).toUpperCase().padStart(2, '0')}
            onChange={(e) => {
              const value = parseInt(e.target.value, 16);
              if (!isNaN(value)) {
                onStepChange(index, step.command, value);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}; 