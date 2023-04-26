import { Divider, Stack, Text } from "@chakra-ui/react";
import { BlogItem } from "components/blog";
import React from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Blog } from "types";

interface Props extends Partial<StepWizardChildProps> {
  blogs?: Blog[];
  onClick?: (blog: Blog) => void;
  teamName?: string;
}

export const BlogList: React.FC<Props> = ({
  blogs,
  nextStep,
  onClick,
  teamName,
}) => {
  const handleBlogClick = (blog: Blog) => {
    if (nextStep) nextStep();
    if (onClick) {
      onClick(blog);
    }
  };

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
