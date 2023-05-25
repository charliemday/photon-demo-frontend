import { Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { BlogSectionItem } from "components/blog/blog-section-item";
import React from "react";
import { Blog } from "types";

interface Props {
  blog: Blog;
}

export const BlogTask: React.FC<Props> = ({ blog }) => {
  const blogSections = blog?.sections;
  const blogTitle = blog?.title;

  const renderEmptyBlogSections = () => (
    <Stack alignItems="center" justifyContent="center" p={12}>
      {blog ? (
        <Text>{`The blog "${blogTitle}" has no sections yet.`}</Text>
      ) : (
        <Text>This task has no content yet.</Text>
      )}
    </Stack>
  );

  return (
    <Stack spacing={6} border="solid 1px #ECECEC" borderRadius="md" py={7} px={6}>
      <HStack w="full" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="medium">
          {blogTitle}
        </Text>
      </HStack>
      {blogSections?.length
        ? blogSections?.map((section) => <BlogSectionItem key={section.id} item={section} />)
        : renderEmptyBlogSections()}
      {blogSections?.length ? (
        <>
          <Divider />
          <HStack justifyContent="space-between">
            <Text fontSize="sm">Click to copy the text to your clipboard</Text>
          </HStack>
        </>
      ) : null}
    </Stack>
  );
};