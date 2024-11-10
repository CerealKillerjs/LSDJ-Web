export type LiveAction = 
  | 'PLAY_NOTE'
  | 'CHANGE_OCTAVE'
  | 'CHANGE_INSTRUMENT'
  | 'TOGGLE_RECORD'
  | 'CLEAR_SEQUENCE'
  | 'MUTE_CHANNEL'
  | 'SOLO_CHANNEL'
  | 'TRIGGER_TABLE'
  | 'START_SEQUENCE'
  | 'STOP_SEQUENCE';

export interface KeyBinding {
  key: string;
  note: string;
  channel: 'pulse1' | 'pulse2' | 'wave' | 'noise';
  action: LiveAction;
  parameter?: any;
}

export interface LiveSettings {
  octave: number;
  keyBindings: KeyBinding[];
  activeChannel: 'pulse1' | 'pulse2' | 'wave' | 'noise';
  velocity: number;
  transpose: number;
  sequences: any[]; // Definir tipo específico si es necesario
} 