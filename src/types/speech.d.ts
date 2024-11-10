export interface Phoneme {
  id: string;
  duration: number;  // en ms
  formants: {
    f1: number;     // frecuencia del primer formante
    f2: number;     // frecuencia del segundo formante
    f3: number;     // frecuencia del tercer formante
    a1: number;     // amplitud del primer formante
    a2: number;     // amplitud del segundo formante
    a3: number;     // amplitud del tercer formante
  };
}

export interface Word {
  id: number;
  text: string;
  phonemes: Phoneme[];
  pitch: number;    // 0-15
  speed: number;    // 0-15
  emphasis: number; // 0-15
}

export interface SpeechBank {
  words: Word[];
  activeWord: number;
} 