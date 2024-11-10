import React, { useEffect, useRef } from 'react';
import { Envelope } from '../types/instrument';

interface EnvelopeVisualizerProps {
  envelope: Envelope;
  width: number;
  height: number;
}

export const EnvelopeVisualizer: React.FC<EnvelopeVisualizerProps> = ({
  envelope,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas
    ctx.clearRect(0, 0, width, height);
    
    // Configurar el estilo
    ctx.strokeStyle = '#2f2f2f';
    ctx.lineWidth = 2;
    
    // Dibujar la envolvente
    ctx.beginPath();
    ctx.moveTo(0, height);

    // Attack
    const attackX = width * 0.2;
    const attackY = height - (height * envelope.attack / 15);
    ctx.lineTo(attackX, attackY);

    // Decay/Sustain
    const decayX = width * 0.4;
    const sustainY = height - (height * envelope.sustain / 15);
    ctx.lineTo(decayX, sustainY);

    // Sustain
    const releaseStartX = width * 0.7;
    ctx.lineTo(releaseStartX, sustainY);

    // Release
    ctx.lineTo(width, height);

    ctx.stroke();
  }, [envelope, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="envelope-visualizer"
    />
  );
}; 