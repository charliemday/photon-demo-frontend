import {
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { UpdateBlogBody, useUpdateBlogMutation } from "api/blog.api";
import { Button } from "components/button";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { StepWizardChildProps } from "react-step-wizard";
import { Blog, BlogStatus } from "types";

interface Props extends Partial<StepWizardChildProps> {
  blog: Blog | null;
}

const mapEnum = (enumObj: any, mapper: Function) => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(enumObj[key])))
    .map((key) => mapper(enumObj[key]));
};

export const EditBlog: React.FC<Props> = ({ previousStep, blog }) => {
  const [status, setStatus] = useState<BlogStatus | undefined>(blog?.status);
  const [title, setTitle] = useState(blog?.title);

  const blogStatusMap = mapEnum(BlogStatus, (status: string) => status);

  const toast = useToast();

  const [updateBlog, { isLoading, isSuccess }] = useUpdateBlogMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Blog updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isLoading, isSuccess, toast]);

  const handleSave = () => {
    if (blog?.id) {
      let body: UpdateBlogBody = {
        id: blog.id,
      };

      if (title) {
        body = {
          ...body,
          title,
        };
      }

      if (status) {
        body = {
          ...body,
          status,
        };
      }

      updateBlog(body);
    }
  };

  return (
    <Stack>
      <HStack
        cursor="pointer"
        onClick={previousStep}
        alignItems="center"
        _hover={{
          textDecoration: "underline",
        }}
      >
        <FaArrowLeft fontSize={12} />
        <Text fontSize="sm">Back to Blog Outline</Text>
      </HStack>

      <Stack pt={6}>
        <FormControl>
          <FormLabel>Blog Title</FormLabel>
          <Input
            type="email"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Blog Status</FormLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogStatus)}
          >
            {blogStatusMap.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider />
      <HStack justifyContent="flex-end">
        <Button isLoading={isLoading} onClick={handleSave}>
          Save
        </Button>
      </HStack>
    </Stack>
  );
};
