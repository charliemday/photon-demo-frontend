import { Box, HStack, Text } from "@chakra-ui/react";
import { FC } from "react";
import { BsArrowRightShort } from "react-icons/bs";

interface Item {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface Props {
  items: Item[];
}

const NavTab: FC<Props> = ({ items }) => {
  return (
    <HStack>
      {items.map(({ label, onClick, isActive }, index) => (
        <HStack key={index}>
          <Box
            cursor="pointer"
            onClick={onClick}
            _hover={{
              textDecoration: "underline",
            }}
            textDecoration={isActive ? "underline" : "none"}
          >
            <Text fontSize="lg" fontWeight={isActive ? "bold" : "normal"}>
              {label}
            </Text>
          </Box>
          {index !== items.length - 1 && <BsArrowRightShort fontSize={32} />}
        </HStack>
      ))}
    </HStack>
  );
};

export default NavTab;
