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
  teamType: TeamType;
}


export type SemrushDatabaseKeys = keyof typeof SEMRUSH_DATABASES;
export type SemrushDatabase = typeof SEMRUSH_DATABASES[SemrushDatabaseKeys];

export enum TeamType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export interface TeamPerformance {
  traffic: number;
  previousTraffic: number;
  premiumKeywords: number;
  previousPremiumKeywords: number;
  standardKeywords: number;
  previousStandardKeywords: number;
  allKeywords: number;
  previousAllKeywords: number;
  impressions: number;
  previousImpressions: number;
  clicks: number;
  previousClicks: number;
  organicPages: number;
  previousOrganicPages: number;
  referringDomains: number;
  previousReferringDomains: number;

}