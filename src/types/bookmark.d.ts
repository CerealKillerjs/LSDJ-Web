import type { Screen } from './screen';

export interface BookmarkPosition {
  screen: Exclude<Screen, 'VISUAL'>;
  row: number;
  chain: number;
  phrase: number;
}

export interface Bookmark {
  id: number;
  name: string;
  position: BookmarkPosition;
  color: 'RED' | 'GREEN' | 'BLUE' | 'YELLOW';
  note?: string;
}

export interface BookmarkBank {
  bookmarks: Bookmark[];
  activeBookmark: number;
} 