import React, { useState } from 'react';
import { Groove, GrooveStep } from '../types/groove';
import '../styles/GrooveEditor.css';

interface GrooveEditorProps {
  groove: Groove;
  onGrooveChange: (groove: Groove) => void;
}

export const GrooveEditor: React.FC<GrooveEditorProps> = ({ groove, onGrooveChange }) => {
  const [selectedStep, setSelectedStep] = useState(0);

  const handleTicksChange = (stepIndex: number, ticks: number) => {
    const newGroove = { ...groove };
    newGroove.steps[stepIndex].ticks = Math.max(1, Math.min(9, ticks));
    onGrooveChange(newGroove);
  };

  const handleVolumeChange = (stepIndex: number, volume: number) => {
    const newGroove = { ...groove };
    newGroove.steps[stepIndex].volume = Math.max(0, Math.min(15, volume));
    onGrooveChange(newGroove);
  };

  const handleLengthChange = (length: number) => {
    const newGroove = { ...groove };
    newGroove.length = Math.max(1, Math.min(16, length));
    onGrooveChange(newGroove);
  };

  return (
    <div className="groove-editor">
      <div className="groove-steps">
        {groove.steps.map((step, index) => (
          <div
            key={index}
            className={`groove-step ${selectedStep === index ? 'selected' : ''} ${index < groove.length ? 'active' : 'inactive'}`}
            onClick={() => setSelectedStep(index)}
          >
            <div className="step-number">
              {index.toString(16).toUpperCase()}
            </div>
            <div className="step-ticks">
              {step.ticks}
            </div>
            <div className="step-volume">
              {step.volume.toString(16).toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="step-editor">
        <h3>Step {selectedStep.toString(16).toUpperCase()}</h3>
        
        <div className="editor-control">
          <label>Ticks:</label>
          <input
            type="number"
            min="1"
            max="9"
            value={groove.steps[selectedStep].ticks}
            onChange={(e) => handleTicksChange(selectedStep, parseInt(e.target.value))}
          />
        </div>

        <div className="editor-control">
          <label>Volume:</label>
          <input
            type="number"
            min="0"
            max="15"
            value={groove.steps[selectedStep].volume}
            onChange={(e) => handleVolumeChange(selectedStep, parseInt(e.target.value))}
          />
          <span className="hex-value">
            {groove.steps[selectedStep].volume.toString(16).toUpperCase()}
          </span>
        </div>

        <div className="editor-control">
          <label>Length:</label>
          <input
            type="number"
            min="1"
            max="16"
            value={groove.length}
            onChange={(e) => handleLengthChange(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}; 