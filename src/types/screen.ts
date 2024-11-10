export const SCREENS = [
  'SONG',
  'CHAIN',
  'PHRASE',
  'WAVE',
  'INSTR',
  'TABLE',
  'GROOVE',
  'PROJECT',
  'KIT',
  'PAN',
  'SPEECH',
  'LIVE',
  'BOOKMARK',
  'COMPRESSION'
] as const;

export type Screen = typeof SCREENS[number]; 