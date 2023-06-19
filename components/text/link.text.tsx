import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { FC } from "react";

interface Props extends LinkProps {}

export const Link: FC<Props> = ({
  children,
  fontSize = "xs",
  fontFamily = "Inter",
  color = "purple.500",
  ...rest
}) => (
  <ChakraLink fontSize={fontSize} fontFamily={fontFamily} color={color} {...rest}>
    {children}
  </ChakraLink>
);
