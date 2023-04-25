import { Box, HStack, Text } from "@chakra-ui/react";
import React from "react";

interface LegendData {
  color: string;
  label: string;
}

interface Props {
  data: LegendData[];
}

const BOX_SIZE = 3;

export const Legend: React.FC<Props> = ({ data }) => {
  return (
    <HStack spacing={6}>
      {data.map((item, index) => (
        <HStack
          key={index}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Box
            h={BOX_SIZE}
            w={BOX_SIZE}
            borderRadius="sm"
            bgColor={item.color}
            mb={1}
          />
          <Text fontSize="sm">{item.label}</Text>
        </HStack>
      ))}
    </HStack>
  );
};
