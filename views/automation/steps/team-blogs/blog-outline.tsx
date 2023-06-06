import { Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { BlogSectionItem } from "components/blog/blog-section-item";
import { Button } from "components/button";
import { Label } from "components/text";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { StepWizardChildProps } from "react-step-wizard";
import { BlogSection } from "types/blog";

interface Props extends Partial<StepWizardChildProps> {
  blogSections?: BlogSection[];
  blogTitle?: string;
}

export const BlogOutline: React.FC<Props> = ({
  blogSections,
  previousStep,
  nextStep,
  blogTitle,
}) => {
  const renderEmptyBlogSections = () => (
    <Stack alignItems="center" justifyContent="center" p={12}>
      <Text>{`The blog "${blogTitle}" has no sections yet.`}</Text>
    </Stack>
  );

  return (
    <Stack spacing={6}>
      <HStack w="full" justifyContent="space-between">
        <HStack
          cursor="pointer"
          onClick={previousStep}
          alignItems="center"
          _hover={{
            textDecoration: "underline",
          }}
        >
          <FaArrowLeft fontSize={12} />
          <Label>Back to Blogs</Label>
        </HStack>

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
            <Label>Click to copy the text to your clipboard</Label>
            <Button onClick={nextStep}>Edit</Button>
          </HStack>
        </>
      ) : null}
    </Stack>
  );
};
