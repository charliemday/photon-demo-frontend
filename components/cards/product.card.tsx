import { Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { ProductSnippet } from "components/product-snippet";
import { SECONDARY_COLOR } from "config/brand";
import { FC } from "react";

interface Props {
  text: string;
}

export const ProductCard: FC<Props> = ({ text }) => (
  <Stack
    background="white"
    width="342px"
    paddingX="20px"
    paddingY="16px"
    borderRadius="8px"
    borderColor="#ECECEC"
    borderWidth="1px"
    spacing="20px"
  >
    <ProductSnippet name="WordSeek" icon="👀" tag="Trial Available" />
    <Text fontSize="xs">{text}</Text>

    <Button bgColor={SECONDARY_COLOR} textColor="white" borderColor="black" borderWidth="1px">
      View
    </Button>
  </Stack>
);
