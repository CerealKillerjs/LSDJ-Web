import React, { useState, useRef } from 'react';
import { Word, Phoneme } from '../types/speech';
import * as Tone from 'tone';
import '../styles/SpeechEditor.css';

interface SpeechEditorProps {
  word: Word;
  onWordChange: (word: Word) => void;
}

interface FormantKey {
  f1: number;
  f2: number;
  f3: number;
  a1: number;
  a2: number;
  a3: number;
}

export const SpeechEditor: React.FC<SpeechEditorProps> = ({ word, onWordChange }) => {
  const [selectedPhoneme, setSelectedPhoneme] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  const handleTextChange = (text: string) => {
    onWordChange({
      ...word,
      text
    });
  };

  const handlePhonemeChange = (index: number, changes: Partial<Phoneme>) => {
    const newWord = { ...word };
    newWord.phonemes[index] = {
      ...newWord.phonemes[index],
      ...changes
    };
    onWordChange(newWord);
  };

  const playWord = async () => {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth().toDestination();
    }

    if (isPlaying) {
      await Tone.Transport.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let time = 0;

    // Reproducir cada fonema
    for (const phoneme of word.phonemes) {
      const { f1, f2, f3, a1, a2, a3 } = phoneme.formants;
      
      // Reproducir cada formante por separado con su amplitud
      synthRef.current.triggerAttackRelease(f1, phoneme.duration / 1000, Tone.now() + time, a1);
      synthRef.current.triggerAttackRelease(f2, phoneme.duration / 1000, Tone.now() + time, a2);
      synthRef.current.triggerAttackRelease(f3, phoneme.duration / 1000, Tone.now() + time, a3);

      time += phoneme.duration / 1000;
    }

    setTimeout(() => setIsPlaying(false), time * 1000);
  };

  const defaultPhoneme: Phoneme = {
    id: 'new',
    duration: 100,
    formants: {
      f1: 500,
      f2: 1500,
      f3: 2500,
      a1: 1,
      a2: 0.5,
      a3: 0.25
    }
  };

  const addPhoneme = () => {
    const newWord = { ...word };
    newWord.phonemes.push({ ...defaultPhoneme });
    onWordChange(newWord);
  };

  const removePhoneme = (index: number) => {
    const newWord = { ...word };
    newWord.phonemes.splice(index, 1);
    onWordChange(newWord);
  };

  const handleFormantChange = (
    index: number, 
    formant: keyof FormantKey, 
    value: number
  ) => {
    const newWord = { ...word };
    newWord.phonemes[index].formants[formant] = value;
    onWordChange(newWord);
  };

  const handleDurationChange = (index: number, duration: number) => {
    const newWord = { ...word };
    newWord.phonemes[index].duration = duration;
    onWordChange(newWord);
  };

  return (
    <div className="speech-editor">
      <div className="phonemes-panel">
        <div className="panel-header">
          <h3>PHONEMES</h3>
          <button onClick={addPhoneme}>ADD</button>
        </div>
        <div className="phonemes-list">
          {word.phonemes.map((phoneme, index) => (
            <div
              key={phoneme.id}
              className={`phoneme-item ${index === selectedPhoneme ? 'selected' : ''}`}
              onClick={() => setSelectedPhoneme(index)}
            >
              <span className="phoneme-index">{index.toString(16).padStart(2, '0').toUpperCase()}</span>
              <span className="phoneme-duration">{phoneme.duration}ms</span>
            </div>
          ))}
        </div>
      </div>

      <div className="phoneme-editor">
        {word.phonemes[selectedPhoneme] && (
          <>
            <div className="editor-header">
              <h3>EDIT PHONEME {selectedPhoneme.toString(16).toUpperCase()}</h3>
              <button onClick={() => removePhoneme(selectedPhoneme)}>DEL</button>
            </div>
            
            <div className="formants-grid">
              <div className="formant-row">
                {(['f1', 'f2', 'f3'] as const).map(formant => (
                  <div key={formant} className="formant-control">
                    <label>{formant.toUpperCase()}</label>
                    <input
                      type="number"
                      value={word.phonemes[selectedPhoneme].formants[formant]}
                      onChange={(e) => handleFormantChange(
                        selectedPhoneme,
                        formant,
                        parseInt(e.target.value)
                      )}
                    />
                  </div>
                ))}
              </div>
              
              <div className="formant-row">
                {(['a1', 'a2', 'a3'] as const).map(amplitude => (
                  <div key={amplitude} className="formant-control">
                    <label>{amplitude.toUpperCase()}</label>
                    <input
                      type="number"
                      value={word.phonemes[selectedPhoneme].formants[amplitude]}
                      onChange={(e) => handleFormantChange(
                        selectedPhoneme,
                        amplitude,
                        parseFloat(e.target.value)
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="duration-control">
              <label>DURATION</label>
              <input
                type="number"
                value={word.phonemes[selectedPhoneme].duration}
                onChange={(e) => handleDurationChange(selectedPhoneme, parseInt(e.target.value))}
                step="10"
                min="10"
                max="1000"
              />
              <span>ms</span>
            </div>
          </>
        )}
      </div>

      <div className="speech-controls">
        <input
          type="text"
          value={word.text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter text..."
        />
        <button 
          className={`play-button ${isPlaying ? 'active' : ''}`}
          onClick={playWord}
        >
          {isPlaying ? 'STOP' : 'PLAY'}
        </button>
      </div>
    </div>
  );
}; 