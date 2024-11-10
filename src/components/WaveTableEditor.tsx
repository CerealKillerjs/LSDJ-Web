import React, { useState, useRef, useEffect } from 'react';

interface WaveTableEditorProps {
  onWaveformChange: (waveform: Float32Array) => void;
  initialWaveform?: Float32Array;
}

export const WaveTableEditor: React.FC<WaveTableEditorProps> = ({ onWaveformChange, initialWaveform }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveform, setWaveform] = useState<Float32Array>(
    initialWaveform || new Float32Array(32).fill(0)
  );
  const [isDragging, setIsDragging] = useState(false);

  const drawWaveform = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Dibuja la cuadrícula
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Líneas horizontales
    for (let i = 0; i <= 16; i++) {
      const y = (i / 16) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Líneas verticales
    for (let i = 0; i <= 32; i++) {
      const x = (i / 32) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Dibuja la forma de onda
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    waveform.forEach((value, index) => {
      const x = (index / 31) * width;
      const y = ((1 - value) / 2) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawWaveform(ctx);
  }, [waveform]);

  const updateWaveformAtPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const index = Math.floor((x / rect.width) * 32);
    if (index < 0 || index >= 32) return;

    const value = 1 - (2 * y) / rect.height;
    const clampedValue = Math.max(-1, Math.min(1, value));

    const newWaveform = new Float32Array(waveform);
    newWaveform[index] = clampedValue;
    setWaveform(newWaveform);
    onWaveformChange(newWaveform);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateWaveformAtPosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateWaveformAtPosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePresetClick = (preset: 'sine' | 'square' | 'triangle' | 'sawtooth') => {
    const newWaveform = new Float32Array(32);
    
    for (let i = 0; i < 32; i++) {
      const x = (i / 32) * Math.PI * 2;
      switch (preset) {
        case 'sine':
          newWaveform[i] = Math.sin(x);
          break;
        case 'square':
          newWaveform[i] = i < 16 ? 1 : -1;
          break;
        case 'triangle':
          newWaveform[i] = i < 16 
            ? -1 + (i / 8)
            : 1 - ((i - 16) / 8);
          break;
        case 'sawtooth':
          newWaveform[i] = 1 - ((i / 16) * 2);
          break;
      }
    }
    
    setWaveform(newWaveform);
    onWaveformChange(newWaveform);
  };

  return (
    <div className="wave-table-editor">
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ border: '1px solid #666' }}
      />
      <div className="presets">
        <button onClick={() => handlePresetClick('sine')}>Sine</button>
        <button onClick={() => handlePresetClick('square')}>Square</button>
        <button onClick={() => handlePresetClick('triangle')}>Triangle</button>
        <button onClick={() => handlePresetClick('sawtooth')}>Sawtooth</button>
      </div>
    </div>
  );
}; 