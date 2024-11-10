declare namespace WebMidi {
  interface MIDIInput extends EventTarget {
    id: string;
    name: string;
    manufacturer: string;
    state: string;
    connection: string;
    onmidimessage: ((e: MIDIMessageEvent) => void) | null;
  }

  interface MIDIOutput extends EventTarget {
    id: string;
    name: string;
    manufacturer: string;
    state: string;
    connection: string;
    send(data: number[], timestamp?: number): void;
  }

  interface MIDIAccess extends EventTarget {
    inputs: Map<string, MIDIInput>;
    outputs: Map<string, MIDIOutput>;
    sysexEnabled: boolean;
    onstatechange: ((e: MIDIConnectionEvent) => void) | null;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIInput | MIDIOutput;
  }
}

interface Navigator {
  requestMIDIAccess(): Promise<WebMidi.MIDIAccess>;
} 