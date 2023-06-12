import { Flex } from "@chakra-ui/react";
import { Body } from "components/text";
import { BRAND_COLOR } from "config";
import { FC } from "react";

interface Props {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const Tab: FC<Props> = ({ label, isActive, onClick }) => (
  <Flex
    border={`solid 2px ${BRAND_COLOR}`}
    borderRadius="md"
    p={2}
    cursor="pointer"
    _hover={{
      bgColor: BRAND_COLOR,
      color: "white",
    }}
    bgColor={isActive ? BRAND_COLOR : "white"}
    onClick={onClick}
    color={isActive ? "white" : BRAND_COLOR}
  >
    <Body fontSize="sm">{label}</Body>
  </Flex>
);
