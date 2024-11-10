export interface Sample {
  id: number;
  name: string;
  data: AudioBuffer;
  length: number;  // en samples
  rate: number;    // sample rate original
  start: number;   // punto de inicio
  end: number;     // punto final
  loop: {
    enabled: boolean;
    start: number;
    end: number;
  };
}

export interface Kit {
  id: number;
  name: string;
  samples: Sample[];
}

export interface KitBank {
  kits: Kit[];
  activeKit: number;
} 