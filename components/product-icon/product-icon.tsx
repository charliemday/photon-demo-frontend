import { Flex, Text } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import { FC } from "react";

interface Props {
  icon: string;
  size?: "base" | "sm";
  inactive?: boolean;
}

export const ProductIcon: FC<Props> = ({ icon, size = "base", inactive }) => {
  let width: string = "";
  let height: string = "";
  let paddingX: string = "";
  let paddingY: string = "";
  let borderRadius: string = "";
  let boxShadow: string = "";

  switch (size) {
    case "base":
      width = "70px";
      height = "70px";
      paddingX = "20px";
      paddingY = "16px";
      borderRadius = "10px";
      boxShadow = "0px 0px 6px 0px rgba(169, 169, 169, 0.15)";
      break;

    case "sm":
      width = "18px";
      height = "18px";
      paddingX = "4px";
      paddingY = "11px";
      borderRadius = "6px";
      break;
  }

  return (
    <Flex
      background={inactive ? "#F6F5FA" : BRAND_COLOR}
      width={width}
      height={height}
      paddingX={paddingX}
      paddingY={paddingY}
      borderRadius={borderRadius}
      borderColor="black"
      borderWidth="1px"
      boxShadow={boxShadow}
      justify="center"
      align="center"
    >
      <Text fontSize="2xl" fontWeight="medium" textAlign="center">
        {icon}
      </Text>
    </Flex>
  );
};
