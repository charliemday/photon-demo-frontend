import { baseApi } from "api/base-query";
import { blogUrls } from "api/urls";
import { camelizeKeys, decamelizeKeys } from "humps";
import { ConvertToSnakeCase } from "types";
import { Blog, BlogSection } from "types/blog";
import {
    GenerateBlogBody,
    ListBlogSectionsRequest,
    ListTeamBlogsQueryParams,
    UpdateBlogBody
} from "./types/blog.types";

const { LIST_TEAM_BLOGS, LIST_BLOG_SECTIONS, UPDATE_BLOG, GENERATE_BLOG_OUTLINES, DELETE_BLOG } =
    blogUrls;

// Define a service using a base URL and expected endpoints
export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * List all the Blogs for a particular team
         */
        listTeamBlogs: builder.query<Blog[], ListTeamBlogsQueryParams>({
            query: (body) => ({
                url: LIST_TEAM_BLOGS(body.teamId),
            }),
            transformResponse: (response: ConvertToSnakeCase<Blog[]>) => camelizeKeys(response) as Blog[],
        }),
        /**
         * List all the Blog Outlines for a particular blog
         */
        listBlogSections: builder.query<BlogSection[], ListBlogSectionsRequest>({
            query: (body) => ({
                url: LIST_BLOG_SECTIONS(body.blogId),
            }),
            transformResponse: (response: ConvertToSnakeCase<BlogSection[]>) =>
                camelizeKeys(response) as BlogSection[],
        }),
        /**
         * Update the blog
         */
        updateBlog: builder.mutation<Blog, UpdateBlogBody>({
            query: (body) => ({
                url: UPDATE_BLOG(body.id),
                method: "PATCH",
                body,
            }),
        }),
        /**
         * Generate the blog outlines
         */
        generateBlogOutlines: builder.mutation<Blog, GenerateBlogBody>({
            query: (body) => ({
                url: GENERATE_BLOG_OUTLINES,
                method: "POST",
                body: decamelizeKeys(body),
            }),
        }),
        /**
         * Delete a blog outlin
         */
        deleteBlog: builder.mutation<Blog, { blogId: number }>({
            query: ({ blogId }) => ({
                url: DELETE_BLOG(blogId),
                method: "DELETE",
            }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useListTeamBlogsQuery,
    useListBlogSectionsQuery,
    useUpdateBlogMutation,
    useGenerateBlogOutlinesMutation,
    useDeleteBlogMutation,
} = blogApi;
