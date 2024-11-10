import React, { useState, useCallback, useEffect } from 'react';
import * as Tone from 'tone';

// Importar componentes
import { ErrorBoundary } from './ErrorBoundary';
import { ProjectManager } from './ProjectManager';
import { KitEditor } from './KitEditor';
import { PanningEditor } from './PanningEditor';
import { SpeechEditor } from './SpeechEditor';
import { LiveMode } from './LiveMode';
import { PlaybackControls } from './PlaybackControls';
import { SongEditor } from './SongEditor';
import { PhraseEditor } from './PhraseEditor';
import { WaveScreen } from './WaveScreen';
import { InstrumentEditor } from './InstrumentEditor';
import { TableEditor } from './TableEditor';
import { ChainEditor } from './ChainEditor';
import { GrooveEditor } from './GrooveEditor';
import { BookmarkManager } from './BookmarkManager';
import { CompressionManager } from './CompressionManager';

// Importar tipos y utilidades
import { 
  Project,
  Song,
  Chain,
  Phrase,
  Table,
  Groove,
  Instrument,
  Kit 
} from '../types/project';
import { Word } from '../types/speech';
import { Bookmark } from '../types/bookmark';
import { PlaybackSettings, PlaybackState } from '../types/playback';
import { PanningSettings } from '../types/panning';
import { LiveSettings, KeyBinding } from '../types/live';
import { SCREENS, type Screen } from '../types/screen';
import { LSDJSynth } from '../synth/Synth';
import { Compressor } from '../utils/Compressor';
import { ClipboardManager } from '../utils/ClipboardManager';
import { handleKeyboardShortcut } from '../utils/keyboardShortcuts';
import { demoProject } from '../demo/demoProject';

// Importar el tipo AudioState
type AudioState = {
  status: 'initializing' | 'ready' | 'error';
  error?: string;
};

// Importar estilos
import '../styles/LSDJInterface.css';

// Crear instancia del clipboard
const clipboard = ClipboardManager.getInstance();

export const LSDJInterface: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>({ status: 'ready' });
  const [synth, setSynth] = useState<LSDJSynth | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('SONG');
  const [currentProject, setCurrentProject] = useState<Project>(demoProject);
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings>({
    state: 'STOPPED',
    tempo: 120,
    mode: 'PATTERN',
    sync: 'INTERNAL',
    position: { song: 0, chain: 0, phrase: 0, step: 0 },
    loop: { enabled: false, start: 0, end: 16 }
  });

  const [currentSong, setCurrentSong] = useState(demoProject.song);
  const [currentChain, setCurrentChain] = useState(demoProject.chains[0]);
  const [currentPhrase, setCurrentPhrase] = useState(demoProject.phrases[0]);
  const [currentTable, setCurrentTable] = useState(demoProject.tables[0]);
  const [currentGroove, setCurrentGroove] = useState(demoProject.grooves[0]);
  const [currentInstrument, setCurrentInstrument] = useState(demoProject.instruments[0]);
  const [currentKit, setCurrentKit] = useState<Kit>(demoProject.kits[0]);
  const [currentWord, setCurrentWord] = useState<Word>({
    id: 0,
    text: '',
    phonemes: [],
    pitch: 1.0,
    speed: 1.0,
    emphasis: 1.0
  });

  const [panningSettings, setPanningSettings] = useState<PanningSettings>({
    pulse1: 'CENTER',
    pulse2: 'CENTER',
    wave: 'CENTER',
    noise: 'CENTER',
    hardPan: false,
    vibrato: {
      enabled: false,
      speed: 0,
      depth: 0
    }
  });

  const [liveSettings, setLiveSettings] = useState<LiveSettings>({
    octave: 4,
    keyBindings: [] as KeyBinding[],
    activeChannel: 'pulse1',
    velocity: 127,
    transpose: 0,
    sequences: []
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const playDemoArpeggio = useCallback(async (newSynth: LSDJSynth) => {
    console.log("Iniciando arpegio de demostración");
    const notes = ['C4', 'E4', 'G4', 'C5'];
    const delay = 0.15;

    try {
      Tone.Transport.bpm.value = 120;
      console.log("Tempo configurado");

      notes.forEach((note, i) => {
        Tone.Transport.schedule((time) => {
          console.log(`Reproduciendo nota: ${note}`);
          newSynth.playPulse1(note, '8n');
        }, `+${i * delay}`);
      });

      console.log("Notas programadas");
      await Tone.Transport.start();
      console.log("Transporte iniciado");

      return new Promise<void>(resolve => {
        setTimeout(() => {
          console.log("Arpegio completado");
          resolve();
        }, notes.length * delay * 1000 + 100);
      });
    } catch (error) {
      console.error("Error en playDemoArpeggio:", error);
      throw error;
    }
  }, []);

  const initializeAudio = useCallback(async () => {
    console.log("Iniciando inicialización de audio");
    try {
      setAudioState({ status: 'initializing' });

      await Tone.start();
      console.log("Tone.js inicializado");
      
      if (Tone.context.state !== 'running') {
        console.log("Resumiendo contexto de audio");
        await Tone.context.resume();
      }

      console.log("Contexto de audio activo:", Tone.context.state);

      const newSynth = new LSDJSynth();
      setSynth(newSynth);

      await new Promise(resolve => setTimeout(resolve, 100));
      console.log("Sintetizador listo");

      await playDemoArpeggio(newSynth);

      Tone.Transport.stop();
      Tone.Transport.cancel();
      console.log("Transporte detenido");

      setAudioState({ status: 'ready' });
      setAudioInitialized(true);
      console.log("Audio inicializado completamente");

    } catch (error) {
      console.error("Error inicializando audio:", error);
      setAudioState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Error desconocido al inicializar el audio'
      });

      if (synth) {
        synth.dispose();
        setSynth(null);
      }
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
  }, [playDemoArpeggio, synth]);

  useEffect(() => {
    return () => {
      if (synth) {
        synth.dispose();
      }
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, [synth]);

  if (!audioInitialized || !synth) {
    return (
      <div className="lsdj-interface">
        <div className="lsdj-screen">
          <div className="screen-header">
            <div className="screen-title">LSDJ Web</div>
            <div className="screen-info">
              <span>v1.0.0</span>
            </div>
          </div>
          <div className="screen-content">
            <div className="audio-init">
              <h2>AUDIO ENGINE</h2>
              <p>Click to initialize audio engine</p>
              <button 
                className="init-button"
                onClick={() => {
                  console.log("Botón de inicio clickeado");
                  initializeAudio();
                }}
                disabled={audioState.status === 'initializing'}
              >
                {audioState.status === 'initializing' ? 'STARTING...' : 'START'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ('error' in audioState) {
    return (
      <div className="lsdj-interface">
        <div className="lsdj-screen">
          <div className="screen-header">
            <div className="screen-title">ERROR</div>
            <div className="screen-info">
              <span>v1.0.0</span>
            </div>
          </div>
          <div className="screen-content">
            <div className="audio-error">
              <h2>Audio Error</h2>
              <p>{String(audioState.error)}</p>
              <button onClick={initializeAudio}>Retry</button>
              <p className="error-hint">
                Note: You may need to allow audio access in your browser
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    const action = handleKeyboardShortcut(
      e.nativeEvent,
      currentScreen,
      playbackSettings.state
    );

    if (!action) return;

    switch (action.type) {
      case 'CHANGE_SCREEN':
        setCurrentScreen(action.payload);
        break;

      case 'EDIT':
        switch (action.payload) {
          case 'COPY':
            switch (currentScreen) {
              case 'PHRASE':
                clipboard.copy('phrase', currentPhrase);
                break;
              case 'CHAIN':
                clipboard.copy('chain', currentChain);
                break;
              case 'TABLE':
                clipboard.copy('table', currentTable);
                break;
            }
            break;

          case 'PASTE':
            const data = clipboard.paste();
            if (!data) break;

            if (data.type === currentScreen.toLowerCase()) {
              switch (data.type) {
                case 'phrase':
                  handlePhraseChange(data.data);
                  break;
                case 'chain':
                  setCurrentChain(data.data);
                  break;
                case 'table':
                  setCurrentTable(data.data);
                  break;
              }
            }
            break;

          case 'CUT':
            switch (currentScreen) {
              case 'PHRASE':
                clipboard.copy('phrase', currentPhrase);
                handlePhraseChange({
                  ...currentPhrase,
                  notes: Array(16).fill({
                    note: '---',
                    instrument: 0,
                    volume: 15,
                    effects: []
                  })
                });
                break;
              // Implementar para chain y table
            }
            break;

          case 'DELETE':
            switch (currentScreen) {
              case 'PHRASE':
                handlePhraseChange({
                  ...currentPhrase,
                  notes: Array(16).fill({
                    note: '---',
                    instrument: 0,
                    volume: 15,
                    effects: []
                  })
                });
                break;
              // Implementar para chain y table
            }
            break;

          case 'INSERT_NOTE':
            if (currentScreen === 'PHRASE') {
              // Implementar inserción de nota en la posición actual
            }
            break;

          case 'TRANSPOSE_UP':
            if (currentScreen === 'PHRASE') {
              // Implementar transposición hacia arriba
            }
            break;

          case 'TRANSPOSE_DOWN':
            if (currentScreen === 'PHRASE') {
              // Implementar transposición hacia abajo
            }
            break;
        }
        break;

      case 'PLAYBACK':
        if (action.payload === 'PLAY') {
          if (playbackSettings.state !== 'PLAYING') {
            setPlaybackSettings({
              ...playbackSettings,
              state: 'PLAYING'
            });
          }
        } else {
          setPlaybackSettings({
            ...playbackSettings,
            state: 'STOPPED',
            position: {
              song: 0,
              chain: 0,
              phrase: 0,
              step: 0
            }
          });
        }
        break;
    }
  };

  const handleWaveformChange = (waveform: Float32Array) => {
    console.log('Waveform changed:', waveform);
  };

  const handleProjectChange = (project: Project) => {
    setCurrentProject(project);
    setCurrentSong(project.song);
    setCurrentTable(project.tables[0]);
    setCurrentChain(project.chains[0]);
    setCurrentGroove(project.grooves[0]);
    setCurrentInstrument(project.instruments[0]);
  };

  const handleJumpToBookmark = (bookmark: Bookmark) => {
    if (SCREENS.includes(bookmark.position.screen)) {
      setCurrentScreen(bookmark.position.screen);
    }
  };

  const handlePhraseChange = (phrase: Phrase) => {
    const newProject = {
      ...currentProject,
      phrases: currentProject.phrases.map((p: Phrase) =>
        p.id === phrase.id ? phrase : p
      )
    };
    setCurrentProject(newProject);
  };

  const calculateMemoryUsage = () => {
    const stats = Compressor.getMemoryStats(currentProject);
    const percentage = Math.round((stats.usedSize / stats.totalSize) * 100);
    return `${percentage}%`;
  };

  const handlePlayNote = async (note: string) => {
    try {
      if (!synth) return;
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
      synth.playPulse1(note);
    } catch (error) {
      console.error("Error reproduciendo nota:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div 
        className="lsdj-interface"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="lsdj-screen">
          <div className="screen-header">
            <div className="screen-title">{currentScreen}</div>
            <div className="screen-info">
              <span>BPM: {playbackSettings.tempo}</span>
              <span>MEM: {calculateMemoryUsage()}</span>
              <span>v1.0.0</span>
            </div>
          </div>

          <div className="screen-content">
            {currentScreen === 'SONG' && (
              <SongEditor
                song={currentSong}
                onSongChange={setCurrentSong}
                currentPosition={playbackSettings.position}
                isPlaying={playbackSettings.state === 'PLAYING'}
              />
            )}
            {currentScreen === 'PHRASE' && (
              <PhraseEditor
                phrase={currentPhrase}
                onPhraseChange={handlePhraseChange}
                onPlayNote={handlePlayNote}
              />
            )}
            {currentScreen === 'WAVE' && synth && (
              <WaveScreen 
                onWaveformChange={handleWaveformChange}
                isPlaying={playbackSettings.state === 'PLAYING'}
                currentPosition={playbackSettings.position}
                channels={synth.analyzers}
              />
            )}
            {currentScreen === 'INSTR' && (
              <InstrumentEditor
                instrument={currentInstrument}
                onInstrumentChange={setCurrentInstrument}
                currentProject={currentProject}
                onProjectChange={handleProjectChange}
              />
            )}
            {currentScreen === 'TABLE' && (
              <TableEditor 
                table={currentTable}
                onTableChange={setCurrentTable}
              />
            )}
            {currentScreen === 'CHAIN' && (
              <ChainEditor
                chain={currentChain}
                onChainChange={setCurrentChain}
              />
            )}
            {currentScreen === 'GROOVE' && (
              <GrooveEditor
                groove={currentGroove}
                onGrooveChange={setCurrentGroove}
              />
            )}
            {currentScreen === 'PROJECT' && (
              <ProjectManager
                currentProject={currentProject}
                onProjectChange={handleProjectChange}
              />
            )}
            {currentScreen === 'KIT' && currentKit && (
              <KitEditor
                kit={currentKit}
                onKitChange={setCurrentKit}
              />
            )}
            {currentScreen === 'PAN' && (
              <PanningEditor
                settings={panningSettings}
                onSettingsChange={setPanningSettings}
              />
            )}
            {currentScreen === 'SPEECH' && (
              <SpeechEditor
                word={currentWord}
                onWordChange={setCurrentWord}
              />
            )}
            {currentScreen === 'LIVE' && synth && (
              <LiveMode
                settings={liveSettings}
                onSettingsChange={setLiveSettings}
                synth={synth}
              />
            )}
            {currentScreen === 'BOOKMARK' && (
              <BookmarkManager
                bookmarks={bookmarks}
                onBookmarkChange={setBookmarks}
                onJumpToBookmark={handleJumpToBookmark}
                currentScreen={currentScreen}
                currentRow={cursorPosition.y}
                currentChain={0}  // Ajusta según tu estado actual
                currentPhrase={0} // Ajusta según tu estado actual
              />
            )}
            {currentScreen === 'COMPRESSION' && (
              <CompressionManager
                currentProject={currentProject}
                onProjectChange={handleProjectChange}
              />
            )}
          </div>

          <div className="screen-footer">
            {synth && (
              <PlaybackControls
                settings={playbackSettings}
                onSettingsChange={setPlaybackSettings}
                currentProject={currentProject}
                synth={synth}
              />
            )}
          </div>
        </div>

        <div className="lsdj-controls">
          <div className="control-buttons">
            {SCREENS.map((screen: Screen) => (
              <button
                key={screen}
                className={`screen-button ${currentScreen === screen ? 'active' : ''}`}
                onClick={() => setCurrentScreen(screen)}
              >
                {screen}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}; 