import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Blog, BlogStatus } from "types/blog";

interface Props {
  item: Blog;
  onClick?: () => void;
}

const BlogStatusColor: {
  [key in BlogStatus]: string;
} = {
  [BlogStatus.Draft]: "yellow.500",
  [BlogStatus.Published]: "green.500",
  [BlogStatus.Queued]: "orange.500",
  [BlogStatus.Archived]: "gray.500",
  [BlogStatus.Released]: "gray.500",
  [BlogStatus.Generated]: "gray.500",
};

export const BlogItem: React.FC<Props> = ({
  item: { title, status },
  onClick,
}) => (
  <HStack
    cursor="pointer"
    _hover={{
      background: "gray.100",
    }}
    py={2}
    px={4}
    borderRadius="md"
    justifyContent="space-between"
    onClick={onClick}
  >
    <Text>{title}</Text>
    <Text fontSize="sm" fontWeight="semibold" color={BlogStatusColor[status]}>
      {status.toUpperCase()}
    </Text>
  </HStack>
);
