import { Divider, Skeleton, Stack, Text } from "@chakra-ui/react";
import { BlogItem } from "components/blog";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Blog } from "types";

interface Props extends Partial<StepWizardChildProps> {
  blogs?: Blog[];
  onClick?: (blog: Blog) => void;
  teamName?: string;
  isLoading?: boolean;
}

export const BlogList: React.FC<Props> = ({
  blogs,
  nextStep,
  onClick,
  teamName,
  isLoading,
}) => {
  const handleBlogClick = (blog: Blog) => {
    if (nextStep) nextStep();
    if (onClick) {
      onClick(blog);
    }
  };

  if (isLoading) {
    const skeletonHeight = "40px";

    return (
      <Stack spacing={4}>
        <Skeleton height={skeletonHeight} borderRadius="md" />
        <Divider />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={skeletonHeight} borderRadius="md" />
        ))}
      </Stack>
    );
  }

  return (
    <Stack>
      {blogs?.length === 0 ? (
        <Text fontSize="lg" fontWeight="semibold">
          No blogs found for {teamName}
        </Text>
      ) : (
        <>
          <Text fontSize="lg" fontWeight="semibold">
            {blogs?.length} Blog{blogs?.length !== 1 && "s"} found
          </Text>
          <Divider py={2} />
          <Stack>
            {blogs?.map((blog) => (
              <BlogItem
                key={blog.id}
                item={blog}
                onClick={() => handleBlogClick(blog)}
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
};
