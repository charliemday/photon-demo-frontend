import { HStack, Stack, useToast } from "@chakra-ui/react";
import { useWordSeekJobsQuery } from "api/engine.api";
import { Button } from "components/button";
import { Body, Heading } from "components/text";
import { FC, useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { typeCheckError } from "utils";

interface Props {
  onClick: () => void;
}

export const WordSeekEmpty: FC<Props> = ({ onClick }) => {
  const { refetch, isFetching, isError, error } = useWordSeekJobsQuery();
  const toast = useToast();

  useEffect(() => {
    if (!isFetching && isError) {
      toast({
        title: "Error fetching data",
        description: typeCheckError(error) || "An unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isFetching, isError, error, toast]);

  return (
    <Stack
      border="solid 1px lightgray"
      borderRadius="lg"
      w="full"
      alignItems="center"
      justifyContent="center"
      h="40vh"
      spacing={6}
      position="relative"
    >
      <HStack
        top={5}
        right={5}
        cursor="pointer"
        opacity={0.75}
        _hover={{ opacity: 1 }}
        position="absolute"
        onClick={() => refetch()}
      >
        <Body>{isFetching ? "Refreshing..." : "Refresh"}</Body>
        <BiRefresh />
      </HStack>
      <Heading fontSize="2xl">🕳️</Heading>
      <Heading fontSize="2xl">Nothing to see here</Heading>
      <Body w="302px" textAlign="center">
        You might want to try pressing this purple-blue button to run the WordSeek automation
      </Body>
      <Button onClick={onClick}>Start WordSeek</Button>
    </Stack>
  );
};
