export type MIDIClockSource = 'INTERNAL' | 'EXTERNAL' | 'AUTO';
export type MIDIChannel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export interface MIDISettings {
  clockSource: MIDIClockSource;
  sync: boolean;
  sendClock: boolean;
  receiveNotes: boolean;
  channel: MIDIChannel;
  transpose: number;
  keyboardOctave: number;
  velocitySensitive: boolean;
}

export interface MIDIMessage {
  type: 'noteon' | 'noteoff' | 'clock' | 'start' | 'stop' | 'continue';
  note?: number;
  velocity?: number;
  channel?: number;
  timestamp: number;
} 