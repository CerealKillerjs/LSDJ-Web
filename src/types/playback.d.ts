export type PlayMode = 'PATTERN' | 'SONG' | 'LIVE';
export type SyncMode = 'INTERNAL' | 'MIDI' | 'LTC';
export type PlaybackState = 'PLAYING' | 'STOPPED' | 'PAUSED';

export interface PlaybackSettings {
  state: PlaybackState;
  tempo: number;
  mode: PlayMode;
  sync: SyncMode;
  position: {
    song: number;
    chain: number;
    phrase: number;
    step: number;
  };
  loop: {
    enabled: boolean;
    start: number;
    end: number;
  };
} 