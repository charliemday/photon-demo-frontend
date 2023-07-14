import { Flex } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  insertText: string;
}

export const InsertText: FC<Props> = ({ text, insertText }) => {
  const splitText = text ? text.split(insertText) : null;

  if (!splitText) return null;

  return (
    <Flex>
      <i>
        <i>...{splitText[0]}</i>
        <i
          style={{
            backgroundColor: "#68D391",
            borderRadius: "5px",
            padding: "0 5px",
          }}
        >
          {insertText}
        </i>
        <i>{splitText[1]}...</i>
      </i>
    </Flex>
  );
};
