import React, { useState } from 'react';
import { Phrase, Note } from '../types/phrase';
import '../styles/PhraseEditor.css';

interface PhraseEditorProps {
  phrase: Phrase;
  onPhraseChange: (phrase: Phrase) => void;
  onPlayNote: (note: string) => Promise<void>;
}

export const PhraseEditor: React.FC<PhraseEditorProps> = ({
  phrase,
  onPhraseChange,
  onPlayNote
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = ['2', '3', '4', '5', '6', '7', '8'];

  const handleNoteChange = async (index: number, newNote: string) => {
    const newNotes = [...phrase.notes];
    newNotes[index] = {
      ...newNotes[index],
      note: newNote
    };
    onPhraseChange({ ...phrase, notes: newNotes });

    if (newNote !== '---') {
      await onPlayNote(newNote);
    }
  };

  const createEmptyNote = (): Note => ({
    note: '---',
    instrument: 0,
    volume: 15,
    effects: []
  });

  const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
    // Navegación
    if (e.key === 'ArrowUp') {
      setSelectedStep((index - 1 + 16) % 16);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      setSelectedStep((index + 1) % 16);
      e.preventDefault();
    }

    // Borrar nota
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const newNotes = [...phrase.notes];
      newNotes[index] = createEmptyNote();
      onPhraseChange({ ...phrase, notes: newNotes });
      e.preventDefault();
    }
  };

  return (
    <div className="phrase-editor">
      <div className="phrase-header">
        <span>STEP</span>
        <span>NOTE</span>
        <span>INST</span>
        <span>VOL</span>
      </div>
      <div className="phrase-steps">
        {phrase.notes.map((note, index) => (
          <div 
            key={index} 
            className={`phrase-step ${index === selectedStep ? 'selected' : ''}`}
            onClick={() => setSelectedStep(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
          >
            <span className="step-number">
              {index.toString(16).toUpperCase().padStart(2, '0')}
            </span>
            <div className="note-input">
              <select
                value={note.note === '---' ? '---' : note.note.slice(0, -1)}
                onChange={(e) => {
                  if (e.target.value === '---') {
                    handleNoteChange(index, '---');
                  } else {
                    const currentOctave = note.note === '---' ? '4' : note.note.slice(-1);
                    handleNoteChange(index, e.target.value + currentOctave);
                  }
                }}
              >
                <option value="---">---</option>
                {notes.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {note.note !== '---' && (
                <select
                  value={note.note.slice(-1)}
                  onChange={(e) => {
                    const currentNote = note.note.slice(0, -1);
                    handleNoteChange(index, currentNote + e.target.value);
                  }}
                >
                  {octaves.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              )}
            </div>
            <input
              type="text"
              className="hex-input"
              value={note.instrument.toString(16).toUpperCase()}
              maxLength={1}
              onChange={(e) => {
                const newNotes = [...phrase.notes];
                const value = e.target.value.toUpperCase();
                if (/^[0-9A-F]?$/.test(value)) {
                  newNotes[index] = {
                    ...note,
                    instrument: parseInt(value || '0', 16)
                  };
                  onPhraseChange({ ...phrase, notes: newNotes });
                }
              }}
            />
            <input
              type="text"
              className="hex-input"
              value={note.volume.toString(16).toUpperCase()}
              maxLength={1}
              onChange={(e) => {
                const newNotes = [...phrase.notes];
                const value = e.target.value.toUpperCase();
                if (/^[0-9A-F]?$/.test(value)) {
                  newNotes[index] = {
                    ...note,
                    volume: parseInt(value || '0', 16)
                  };
                  onPhraseChange({ ...phrase, notes: newNotes });
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 