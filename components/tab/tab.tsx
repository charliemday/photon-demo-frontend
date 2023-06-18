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
    border={`solid 2px ${isActive ? BRAND_COLOR : "#E7E7E7"}`}
    borderRadius="md"
    p={2}
    cursor="pointer"
    _hover={{
      bgColor: BRAND_COLOR,
      color: "white",
      borderColor: BRAND_COLOR,
    }}
    bgColor={isActive ? BRAND_COLOR : "#F6F5FA"}
    onClick={onClick}
    color={isActive ? "white" : "black"}
  >
    <Body fontSize="lg" fontFamily="ClashGrotesk">
      {label}
    </Body>
  </Flex>
);
