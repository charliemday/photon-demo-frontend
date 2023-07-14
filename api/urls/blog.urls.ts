export const blogUrls = {
    // Blogs
    LIST_TEAM_BLOGS: (teamId: number) => `blogs?team_id=${teamId}`,
    LIST_BLOG_SECTIONS: (blogId: number) => `blogs/${blogId}/sections`,
    UPDATE_BLOG: (blogId: number) => `blogs/${blogId}/`,
    GENERATE_BLOG_OUTLINES: `blogs/generate-sections/`,
    DELETE_BLOG: (blogId: number) => `blogs/${blogId}/`,
}