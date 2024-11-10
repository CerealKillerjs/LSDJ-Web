import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import '../styles/Visualizer.css';

interface VisualizerProps {
  isPlaying: boolean;
  currentPosition: {
    song: number;
    chain: number;
    phrase: number;
    step: number;
  };
  channels: {
    pulse1: Tone.Analyser;
    pulse2: Tone.Analyser;
    wave: Tone.Analyser;
    noise: Tone.Analyser;
  };
}

export const Visualizer: React.FC<VisualizerProps> = ({
  isPlaying,
  currentPosition,
  channels
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar fondo
      ctx.fillStyle = 'rgba(47, 47, 47, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar grid
      ctx.strokeStyle = 'rgba(47, 47, 47, 0.2)';
      ctx.lineWidth = 1;

      // Grid vertical
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Grid horizontal
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Dibujar canales
      const channelNames = ['PULSE1', 'PULSE2', 'WAVE', 'NOISE'];
      const channelColors = ['#2f2f2f', '#2f2f2f', '#2f2f2f', '#2f2f2f'];
      const channelAnalysers = [channels.pulse1, channels.pulse2, channels.wave, channels.noise];

      channelNames.forEach((name, i) => {
        const values = channelAnalysers[i].getValue();
        if (!(values instanceof Float32Array)) return;

        // Dibujar forma de onda del canal
        ctx.beginPath();
        ctx.strokeStyle = channelColors[i];
        ctx.lineWidth = 2;

        const sliceHeight = canvas.height / 4;
        const yOffset = i * sliceHeight + sliceHeight / 2;

        values.forEach((value, x) => {
          const xPos = (x / values.length) * canvas.width;
          const yPos = yOffset + (value * sliceHeight / 2);
          
          if (x === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        });

        ctx.stroke();

        // Dibujar nombre del canal con fuente más grande
        ctx.fillStyle = '#2f2f2f';
        ctx.font = '14px monospace';
        ctx.fillText(name, 5, yOffset - sliceHeight/3);
      });

      // Dibujar posición actual con fuente más grande
      if (isPlaying) {
        ctx.fillStyle = '#2f2f2f';
        ctx.font = '16px monospace';
        const posText = `${currentPosition.song.toString(16).padStart(2, '0')}:` +
                       `${currentPosition.chain.toString(16).padStart(2, '0')}:` +
                       `${currentPosition.phrase.toString(16).padStart(2, '0')}:` +
                       `${currentPosition.step.toString(16).padStart(2, '0')}`;
        ctx.fillText(posText, canvas.width - 120, 24);
      }

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentPosition, channels]);

  return (
    <div className="visualizer">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="visualizer-canvas"
      />
    </div>
  );
}; 