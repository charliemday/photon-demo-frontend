import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";

interface Props extends React.ComponentProps<typeof ChakraButton> {
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
