import { baseApi } from "api/base-query";
import { apiUrls } from "api/urls.api";
import { camelizeKeys } from "humps";
import { ConvertToSnakeCase } from "types";
import { Blog, BlogSection } from "types/blog";


export interface ListTeamBlogsQueryParams {
    teamId: number;
}

export interface ListBlogSectionsRequest {
    blogId: number;
}


// Define a service using a base URL and expected endpoints
export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * List all the Blogs for a particular team
         */
        listTeamBlogs: builder.query<Blog[], ListTeamBlogsQueryParams>({
            query: (body) => ({
                url: apiUrls.LIST_TEAM_BLOGS(body.teamId),
            }),
            transformResponse: (response: ConvertToSnakeCase<Blog[]>) => camelizeKeys(response) as Blog[]
        }),
        /**
         * List all the Blog Outlines for a particular blog
         */
        listBlogSections: builder.query<BlogSection[], ListBlogSectionsRequest>({
            query: (body) => ({
                url: apiUrls.LIST_BLOG_SECTIONS(body.blogId),
            }),
            transformResponse: (response: ConvertToSnakeCase<BlogSection[]>) => camelizeKeys(response) as BlogSection[]
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useListTeamBlogsQuery, useListBlogSectionsQuery } = blogApi;
