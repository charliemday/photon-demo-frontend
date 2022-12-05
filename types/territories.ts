export interface Opportunity {
  id: number;
  created: string;
  modified: string;
  name: string;
  value: number;
  account: number; 
}

export interface Account {
  id: number;
  created: string;
  modified: string;
  name: string;
  value: number;
  status: string; // TODO: Maybe this should be an enum??
  territory: number;
}

export interface Territory {
  id: number;
  created: string;
  modified: string;
  name: string;
  description: string;
  image: string | null;
  territoryLeader: number; // TODO: Maybe this should be an object??
  team: number;
  accountsCount: number;
}

