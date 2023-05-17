import { Stack, Text } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import { FC } from "react";

interface Props {
  name: string;
  size?: "base" | "sm";
}

export const ProfileIcon: FC<Props> = ({ name, size = "sm" }) => {
  let width: string;
  let height: string;
  let paddingX: string;
  let paddingY: string;
  let borderRadius: string;
  let fontSize: string;

  switch (size) {
    case "base":
      width = "32px";
      height = "32px";
      paddingX = "9px";
      paddingY = "7px";
      borderRadius = "6px";
      fontSize = "12px";
      break;

    case "sm":
      paddingX = "2px";
      paddingY = "";
      borderRadius = "3px";
      width = "18px";
      height = "18px";
      fontSize = "10px";
      break;
  }

  return (
    <Stack
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
      overflow="hidden"
    >
      <Text
        fontFamily="Inter"
        lineHeight="1.75"
        fontWeight="bold"
        fontSize={fontSize}
        color="#FFFFFF"
        textAlign="center"
        textTransform="uppercase"
      >
        {name.substring(0, 1)}
      </Text>
    </Stack>
  );
};
