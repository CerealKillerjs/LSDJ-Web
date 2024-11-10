import React, { useState } from 'react';
import { Effect } from '../types/effects';

interface TableSectionProps {
  steps: Array<{
    effects: Effect[];
    transpose: number;
    volume: number;
  }>;
  onStepsChange: (steps: Array<{
    effects: Effect[];
    transpose: number;
    volume: number;
  }>) => void;
}

export const TableSection: React.FC<TableSectionProps> = ({
  steps,
  onStepsChange
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const handleEffectChange = (stepIndex: number, effectIndex: number, changes: Partial<Effect>) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      effects: newSteps[stepIndex].effects.map((effect, i) =>
        i === effectIndex ? { ...effect, ...changes } : effect
      )
    };
    onStepsChange(newSteps);
  };

  const addEffect = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      effects: [...newSteps[stepIndex].effects, { type: 'VOL', value: 0 }]
    };
    onStepsChange(newSteps);
  };

  const removeEffect = (stepIndex: number, effectIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      effects: newSteps[stepIndex].effects.filter((_, i) => i !== effectIndex)
    };
    onStepsChange(newSteps);
  };

  return (
    <div className="table-section">
      <div className="table-header">
        <span>STEP</span>
        <span>CMD</span>
        <span>VAL</span>
        <span>TRANS</span>
        <span>VOL</span>
      </div>
      
      {steps.map((step, index) => (
        <div
          key={index}
          className={`table-row ${selectedStep === index ? 'selected' : ''}`}
          onClick={() => setSelectedStep(index)}
        >
          <span className="step-number">
            {index.toString(16).toUpperCase().padStart(2, '0')}
          </span>
          
          <div className="effects-list">
            {step.effects.map((effect, effectIndex) => (
              <div key={effectIndex} className="effect-item">
                <select
                  value={effect.type}
                  onChange={(e) => handleEffectChange(
                    index,
                    effectIndex,
                    { type: e.target.value as Effect['type'] }
                  )}
                >
                  <option value="VOL">VOL</option>
                  <option value="PAN">PAN</option>
                  <option value="ARP">ARP</option>
                  <option value="VIB">VIB</option>
                  <option value="SWEEP">SWP</option>
                </select>
                
                <input
                  type="text"
                  maxLength={2}
                  value={effect.value.toString(16).toUpperCase().padStart(2, '0')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 16);
                    if (!isNaN(value)) {
                      handleEffectChange(index, effectIndex, { value });
                    }
                  }}
                />
                
                <button 
                  className="remove-effect"
                  onClick={() => removeEffect(index, effectIndex)}
                >
                  ×
                </button>
              </div>
            ))}
            
            {step.effects.length < 3 && (
              <button 
                className="add-effect"
                onClick={() => addEffect(index)}
              >
                +
              </button>
            )}
          </div>

          <input
            type="text"
            maxLength={2}
            className="transpose-input"
            value={step.transpose.toString(16).toUpperCase().padStart(2, '0')}
            onChange={(e) => {
              const value = parseInt(e.target.value, 16);
              if (!isNaN(value)) {
                const newSteps = [...steps];
                newSteps[index] = { ...step, transpose: value };
                onStepsChange(newSteps);
              }
            }}
          />

          <input
            type="text"
            maxLength={2}
            className="volume-input"
            value={step.volume.toString(16).toUpperCase().padStart(2, '0')}
            onChange={(e) => {
              const value = parseInt(e.target.value, 16);
              if (!isNaN(value)) {
                const newSteps = [...steps];
                newSteps[index] = { ...step, volume: value };
                onStepsChange(newSteps);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}; 