import React, { useState } from 'react';
import { Bookmark } from '../types/bookmark';
import type { Screen } from '../types/screen';
import '../styles/BookmarkManager.css';

interface BookmarkManagerProps {
  bookmarks: Bookmark[];
  onBookmarkChange: (bookmarks: Bookmark[]) => void;
  onJumpToBookmark: (bookmark: Bookmark) => void;
  currentScreen: Screen;
  currentRow: number;
  currentChain: number;
  currentPhrase: number;
}

export const BookmarkManager: React.FC<BookmarkManagerProps> = ({
  bookmarks,
  onBookmarkChange,
  onJumpToBookmark,
  currentScreen,
  currentRow,
  currentChain,
  currentPhrase
}) => {
  const [selectedBookmark, setSelectedBookmark] = useState<number | null>(null);

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: bookmarks.length,
      name: `Mark ${bookmarks.length + 1}`,
      position: {
        screen: currentScreen,
        row: currentRow,
        chain: currentChain,
        phrase: currentPhrase
      },
      color: 'RED',
      note: ''
    };

    onBookmarkChange([...bookmarks, newBookmark]);
    setSelectedBookmark(newBookmark.id);
  };

  const updateBookmark = (id: number, changes: Partial<Bookmark>) => {
    const newBookmarks = bookmarks.map(bookmark =>
      bookmark.id === id ? { ...bookmark, ...changes } : bookmark
    );
    onBookmarkChange(newBookmarks);
  };

  const deleteBookmark = (id: number) => {
    onBookmarkChange(bookmarks.filter(b => b.id !== id));
    setSelectedBookmark(null);
  };

  const markCurrentPosition = (id: number) => {
    updateBookmark(id, {
      position: {
        screen: currentScreen,
        row: currentRow,
        chain: currentChain,
        phrase: currentPhrase
      }
    });
  };

  return (
    <div className="bookmark-manager">
      <div className="bookmark-list">
        <div className="bookmark-header">
          <h3>Bookmarks</h3>
          <button onClick={addBookmark}>+</button>
        </div>
        
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            className={`bookmark-item ${selectedBookmark === bookmark.id ? 'selected' : ''} ${bookmark.color.toLowerCase()}`}
            onClick={() => setSelectedBookmark(bookmark.id)}
          >
            <div className="bookmark-info">
              <span className="bookmark-name">{bookmark.name}</span>
              <span className="bookmark-position">
                {`${bookmark.position.screen}:${bookmark.position.row.toString(16).toUpperCase()}`}
              </span>
            </div>
            <div className="bookmark-actions">
              <button onClick={() => onJumpToBookmark(bookmark)}>→</button>
              <button onClick={() => markCurrentPosition(bookmark.id)}>●</button>
            </div>
          </div>
        ))}
      </div>

      {selectedBookmark !== null && (
        <div className="bookmark-editor">
          <h3>Edit Bookmark</h3>
          <div className="editor-row">
            <label>Name:</label>
            <input
              type="text"
              value={bookmarks[selectedBookmark].name}
              onChange={(e) => updateBookmark(selectedBookmark, { name: e.target.value })}
            />
          </div>

          <div className="editor-row">
            <label>Color:</label>
            <select
              value={bookmarks[selectedBookmark].color}
              onChange={(e) => updateBookmark(selectedBookmark, {
                color: e.target.value as Bookmark['color']
              })}
            >
              <option value="RED">Red</option>
              <option value="GREEN">Green</option>
              <option value="BLUE">Blue</option>
              <option value="YELLOW">Yellow</option>
            </select>
          </div>

          <div className="editor-row">
            <label>Note:</label>
            <textarea
              value={bookmarks[selectedBookmark].note || ''}
              onChange={(e) => updateBookmark(selectedBookmark, { note: e.target.value })}
            />
          </div>

          <button
            className="delete-button"
            onClick={() => deleteBookmark(selectedBookmark)}
          >
            Delete Bookmark
          </button>
        </div>
      )}
    </div>
  );
}; 