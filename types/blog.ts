import { Team, User } from "types";

export enum BlogStatus {
    Published = "published",
    Draft = "draft",
    Archived = "archived",
    Released = "released",
    Queued = "queued",
    Generated = "generated",
}


export interface BlogKeyword {
    id: number;
    keyword: string;
}


export interface Blog {
    id: number;
    title: string;
    created: string;
    modified: string;
    author: Partial<User> | null;
    releaseDate: string;
    status: BlogStatus;
    team: Partial<Team>;
    sections: BlogSection[];
    keywords: BlogKeyword[];
};

export interface BlogSection {
    id: number;
    position: number;
    title: string;
    content: string;
    created: string;
    modified: string;
}