import { Flex } from "@chakra-ui/react";
import { EmptyState } from "./empty.state";
import { FC } from "react";

export const EmptySection: FC = () => (
  <Flex
    background="white"
    pt="40px"
    pb="60px"
    borderRadius="8px"
    borderColor="#ECECEC"
    justify="center"
    align="center"
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
