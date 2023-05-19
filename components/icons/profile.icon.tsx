import { Flex, Text } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import { FC } from "react";

interface Props {
  initials: string;
  size?: "base" | "sm";
}

export const ProfileIcon: FC<Props> = ({ initials, size = "base" }) => {
  let width: string = "";
  let height: string = "";
  let paddingX: string = "";
  let paddingY: string = "";
  let borderRadius: string = "";
  let fontSize: string = "";

  switch (size) {
    case "base":
      width = "32px";
      height = "32px";
      paddingX = "9px";
      paddingY = "7px";
      borderRadius = "6px";
      fontSize = "xs";
      break;

    case "sm":
      width = "18px";
      height = "18px";
      paddingX = "2px";
      borderRadius = "3px";
      fontSize = "10px";
      break;
  }

  return (
    <Flex
      background={BRAND_COLOR}
      width={width}
      height={height}
      paddingX={paddingX}
      paddingY={paddingY}
      borderRadius={borderRadius}
      borderColor="black"
      borderWidth="0.75px"
      boxShadow="0px 0px 6px 0px rgba(169, 169, 169, 0.15)"
      justify="center"
      align="center"
    >
      <Text
        fontSize={fontSize}
        fontWeight="bold"
        color="white"
        textAlign="center"
        textTransform="uppercase"
      >
        {initials}
      </Text>
    </Flex>
  );
};
