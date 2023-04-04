import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import React from "react";

interface Props extends ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<Props> = (props) => (
  <ChakraButton
    bgColor={BRAND_COLOR}
    borderColor={BRAND_COLOR}
    border="2px"
    color="white"
    _hover={{
      borderColor: BRAND_COLOR,
      border: "2px",
      color: BRAND_COLOR,
      bgColor: "white",
    }}
    _active={{
      borderColor: BRAND_COLOR,
      border: "2px",
      color: BRAND_COLOR,
      bgColor: "white",
    }}
    {...props}
  >
    {props.children}
  </ChakraButton>
);
