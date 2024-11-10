import { Song } from './song';
import { Table } from './effects';
import { Chain } from './chain';
import { Groove } from './groove';
import { Instrument } from './instrument';
import { Phrase } from './phrase';
import { Kit } from './kit';

export interface Project {
  name: string;
  version: string;
  createdAt: Date;
  modifiedAt: Date;
  tempo: number;
  song: Song;
  chains: Chain[];
  phrases: Phrase[];
  tables: Table[];
  grooves: Groove[];
  instruments: Instrument[];
  kits: Kit[];
}

export interface ProjectMetadata {
  name: string;
  version: string;
  createdAt: Date;
  modifiedAt: Date;
  tempo: number;
}

export type { 
  Project,
  Song,
  Chain,
  Phrase,
  Table,
  Groove,
  Instrument,
  Kit
}; 