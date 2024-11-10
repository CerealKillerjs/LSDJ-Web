export type PanPosition = 'LEFT' | 'CENTER' | 'RIGHT';

export interface PanningSettings {
  pulse1: PanPosition;
  pulse2: PanPosition;
  wave: PanPosition;
  noise: PanPosition;
  hardPan: boolean;  // true = L/R, false = suave
  vibrato: {
    enabled: boolean;
    speed: number;  // 0-15
    depth: number;  // 0-15
  };
} 