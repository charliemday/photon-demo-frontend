import {
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Stack,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import { UpdateBlogBody, useUpdateBlogMutation } from "api/blog.api";
import { Button } from "components/button";
import { FC, useEffect, useState } from "react";
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

export const EditBlog: FC<Props> = ({ previousStep, blog }) => {
  const [status, setStatus] = useState<BlogStatus | undefined>(blog?.status);
  const [title, setTitle] = useState(blog?.title);

  const blogStatusMap = mapEnum(BlogStatus, (status: string) => status);

  const toast = useToast();

  const [updateBlog, { isLoading, isSuccess }] = useUpdateBlogMutation();

  useEffect(() => {
    if (blog) {
      setStatus(blog.status);
      setTitle(blog.title);
    }
  }, [blog]);

  console.log("Blog", blog);

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

      <Stack py={6} spacing={6}>
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
          <FormLabel>
            Blog Status: <Tag>{status?.toUpperCase()}</Tag>
          </FormLabel>
          <Select
            placeholder="Select option"
            onChange={(e) => setStatus(e.target.value as BlogStatus)}
          >
            {blogStatusMap.map((status) => (
              <option key={status} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </Select>
        </FormControl>

        <Stack spacing={6}>
          <Text>Keywords Associated with this Blog:</Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {blog?.keywords.map(({ keyword }, key) => (
              <GridItem key={key}>
                <Tag key={key}>{keyword}</Tag>
              </GridItem>
            ))}
          </Grid>
        </Stack>
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
