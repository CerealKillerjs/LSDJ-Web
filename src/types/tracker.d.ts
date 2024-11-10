export interface Pattern {
  note: string;
  volume: number;
}

export interface Patterns {
  pulse1: Pattern[];
  pulse2: Pattern[];
  wave: Pattern[];
  noise: Pattern[];
}

export interface TrackerProps {
  onPatternChange?: (patterns: Patterns) => void;
} 