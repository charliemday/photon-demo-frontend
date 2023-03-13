import { SEMRUSH_DATABASES } from "config";

export interface Team {
  id: number;
  created: string;
  modified: string;
  name: string;
  description: string;
  image: string | null;
  logo: string | null;
  url: string | null;
  driveFolderId: string | null;
  uid: string;
}


export type SemrushDatabaseKeys = keyof typeof SEMRUSH_DATABASES;
export type SemrushDatabase = typeof SEMRUSH_DATABASES[SemrushDatabaseKeys];