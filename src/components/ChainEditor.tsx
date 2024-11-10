import React from 'react';
import { Chain } from '../types/project';
import '../styles/ChainEditor.css';

interface ChainEditorProps {
  chain: Chain;
  onChainChange: (chain: Chain) => void;
}

export const ChainEditor: React.FC<ChainEditorProps> = ({ chain, onChainChange }) => {
  return (
    <div className="chain-editor">
      <div className="chain-header">
        <span>STEP</span>
        <span>PHRASE</span>
        <span>TRANS</span>
      </div>
      <div className="chain-steps">
        {chain.steps.map((step, index) => (
          <div key={index} className="chain-step">
            <span className="step-number">{index.toString(16).toUpperCase().padStart(2, '0')}</span>
            <input
              type="text"
              value={step.phraseId.toString(16).toUpperCase().padStart(2, '0')}
              onChange={(e) => {
                const newSteps = [...chain.steps];
                newSteps[index] = {
                  ...step,
                  phraseId: parseInt(e.target.value, 16)
                };
                onChainChange({ ...chain, steps: newSteps });
              }}
            />
            <input
              type="text"
              value={step.transpose.toString(16).toUpperCase()}
              onChange={(e) => {
                const newSteps = [...chain.steps];
                newSteps[index] = {
                  ...step,
                  transpose: parseInt(e.target.value, 16)
                };
                onChainChange({ ...chain, steps: newSteps });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 