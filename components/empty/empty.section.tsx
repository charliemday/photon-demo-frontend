import { Flex } from "@chakra-ui/react";
import { EmptyState } from "./empty.state";

export const EmptySection = () => (
  <Flex
    background="white"
    width="100%"
    maxWidth="100%"
    pt="40px"
    pb="60px"
    borderColor="#ECECEC"
    borderRadius="8px"
    justify="center"
    align="center"
    overflow="hidden"
  >
    <EmptyState
      icon="🕳"
      heading="Nothing to see here"
      text="You might want to try pressing this purple-blue button to run the
        WordSeek automation"
      button={{
        text: "WordSeek",
        onClick: () => alert("WordSeek"),
      }}
    />
  </Flex>
);
