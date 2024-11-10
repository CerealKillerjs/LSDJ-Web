export function transposeNote(note: string, semitones: number): string {
  if (note === '---') return note;
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteParts = note.match(/([A-G]#?)(\d+)/);
  
  if (!noteParts) return note;
  
  const [, noteName, octave] = noteParts;
  let noteIndex = notes.indexOf(noteName);
  let octaveNum = parseInt(octave);
  
  noteIndex += semitones;
  
  // Ajustar octava si nos pasamos de los límites
  while (noteIndex >= notes.length) {
    noteIndex -= notes.length;
    octaveNum++;
  }
  while (noteIndex < 0) {
    noteIndex += notes.length;
    octaveNum--;
  }
  
  // Limitar octavas entre 0 y 8
  octaveNum = Math.max(0, Math.min(8, octaveNum));
  
  return `${notes[noteIndex]}${octaveNum}`;
} 