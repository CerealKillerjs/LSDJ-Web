import React, { useState } from 'react';
import { Song, SongRow } from '../types/song';
import '../styles/SongEditor.css';

interface SongEditorProps {
  song: Song;
  onSongChange: (song: Song) => void;
  currentPosition: {
    song: number;
    chain: number;
    phrase: number;
    step: number;
  };
  isPlaying: boolean;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  song,
  onSongChange,
  currentPosition,
  isPlaying
}) => {
  const [selectedRow, setSelectedRow] = useState(0);

  const handleChainChange = (
    rowIndex: number,
    channel: keyof SongRow['chains'],
    value: number
  ) => {
    const newSong = { ...song };
    newSong.rows[rowIndex].chains[channel] = Math.max(0, Math.min(255, value));
    onSongChange(newSong);
  };

  const handleGrooveChange = (rowIndex: number, value: number) => {
    const newSong = { ...song };
    newSong.rows[rowIndex].groove = Math.max(0, Math.min(255, value));
    onSongChange(newSong);
  };

  const handleTempoChange = (rowIndex: number, value: number) => {
    const newSong = { ...song };
    newSong.rows[rowIndex].tempo = Math.max(40, Math.min(295, value));
    onSongChange(newSong);
  };

  const addRow = () => {
    const newSong = { ...song };
    const newRow: SongRow = {
      chains: { pulse1: 0, pulse2: 0, wave: 0, noise: 0 },
      groove: song.defaultGroove,
      tempo: song.tempo
    };
    newSong.rows.splice(selectedRow + 1, 0, newRow);
    onSongChange(newSong);
    setSelectedRow(selectedRow + 1);
  };

  const deleteRow = () => {
    if (song.rows.length > 1) {
      const newSong = { ...song };
      newSong.rows.splice(selectedRow, 1);
      onSongChange(newSong);
      setSelectedRow(Math.max(0, selectedRow - 1));
    }
  };

  return (
    <div className="song-editor">
      <div className="song-rows">
        <div className="header-row">
          <div className="row-number">POS</div>
          <div className="chain-cell">PU1</div>
          <div className="chain-cell">PU2</div>
          <div className="chain-cell">WAV</div>
          <div className="chain-cell">NOI</div>
          <div className="groove-cell">GRV</div>
          <div className="tempo-cell">BPM</div>
        </div>
        {song.rows.map((row, index) => (
          <div
            key={index}
            className={`song-row ${
              index === song.activeRow ? 'active' : ''
            } ${
              isPlaying && index === currentPosition.song ? 'playing' : ''
            }`}
            onClick={() => setSelectedRow(index)}
          >
            <div className="row-number">
              {index.toString(16).toUpperCase().padStart(2, '0')}
            </div>
            {Object.entries(row.chains).map(([channel, chainId]) => (
              <div key={channel} className="chain-cell">
                {chainId.toString(16).toUpperCase().padStart(2, '0')}
              </div>
            ))}
            <div className="groove-cell">
              {row.groove.toString(16).toUpperCase().padStart(2, '0')}
            </div>
            <div className="tempo-cell">
              {row.tempo}
            </div>
          </div>
        ))}
      </div>

      <div className="row-editor">
        <h3>Position {selectedRow.toString(16).toUpperCase()}</h3>
        
        <div className="channel-controls">
          {Object.entries(song.rows[selectedRow].chains).map(([channel, chainId]) => (
            <div key={channel} className="editor-control">
              <label>{channel.toUpperCase()}:</label>
              <input
                type="number"
                min="0"
                max="255"
                value={chainId}
                onChange={(e) => handleChainChange(
                  selectedRow,
                  channel as keyof SongRow['chains'],
                  parseInt(e.target.value)
                )}
              />
              <span className="hex-value">
                {chainId.toString(16).toUpperCase().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        <div className="editor-control">
          <label>Groove:</label>
          <input
            type="number"
            min="0"
            max="255"
            value={song.rows[selectedRow].groove}
            onChange={(e) => handleGrooveChange(selectedRow, parseInt(e.target.value))}
          />
          <span className="hex-value">
            {song.rows[selectedRow].groove.toString(16).toUpperCase().padStart(2, '0')}
          </span>
        </div>

        <div className="editor-control">
          <label>Tempo:</label>
          <input
            type="number"
            min="40"
            max="295"
            value={song.rows[selectedRow].tempo}
            onChange={(e) => handleTempoChange(selectedRow, parseInt(e.target.value))}
          />
          <span>BPM</span>
        </div>

        <div className="row-actions">
          <button onClick={addRow}>Insert Row</button>
          <button onClick={deleteRow}>Delete Row</button>
        </div>
      </div>
    </div>
  );
}; 