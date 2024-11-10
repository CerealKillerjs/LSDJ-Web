import { Screen } from '../types/screen';
import { PlaybackState } from '../types/playback';

export const SCREEN_SHORTCUTS: Record<string, Screen> = {
  'q': 'SONG',
  'w': 'CHAIN',
  'e': 'PHRASE',
  'r': 'WAVE',
  't': 'INSTR',
  'y': 'TABLE',
  'u': 'GROOVE',
  'i': 'PROJECT',
  'o': 'KIT',
  'p': 'PAN',
  '[': 'SPEECH',
  ']': 'LIVE',
  '\\': 'BOOKMARK'
};

export const EDIT_SHORTCUTS: Record<string, string> = {
  'c': 'COPY',
  'v': 'PASTE',
  'x': 'CUT',
  'z': 'UNDO',
  'y': 'REDO',
  'Delete': 'DELETE',
  ' ': 'INSERT_NOTE',
  '+': 'TRANSPOSE_UP',
  '-': 'TRANSPOSE_DOWN',
  'Enter': 'PLAY_STOP'
};

export interface KeyboardAction {
  type: 'CHANGE_SCREEN' | 'EDIT' | 'PLAYBACK';
  payload: any;
}

export function handleKeyboardShortcut(
  event: KeyboardEvent,
  currentScreen: Screen,
  playbackState: PlaybackState
): KeyboardAction | null {
  // Ignorar si estamos en un input
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return null;
  }

  // Atajos de pantalla
  const screenKey = event.key.toLowerCase();
  if (SCREEN_SHORTCUTS[screenKey]) {
    return {
      type: 'CHANGE_SCREEN',
      payload: SCREEN_SHORTCUTS[screenKey]
    };
  }

  // Atajos de edición
  if (event.ctrlKey || event.metaKey) {
    const editAction = EDIT_SHORTCUTS[event.key.toLowerCase()];
    if (editAction) {
      return {
        type: 'EDIT',
        payload: editAction
      };
    }
  }

  // Atajos de reproducción
  if (event.key === 'Enter') {
    return {
      type: 'PLAYBACK',
      payload: playbackState === 'PLAYING' ? 'STOP' : 'PLAY'
    };
  }

  return null;
} 