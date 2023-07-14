import { Blog } from "types";

export interface ListTeamBlogsQueryParams {
    teamId: number;
}

export interface ListBlogSectionsRequest {
    blogId: number;
}

export interface UpdateBlogBody extends Partial<Blog> {
    id: number
}

export interface GenerateBlogBody {
    keywords: string[];
    team: number;
}