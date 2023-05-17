import { Stack, Text } from "@chakra-ui/react";
import { ProductIcon } from "components/product-icon";
import { Tag } from "components/tag";
import { FC } from "react";

interface Props {
  name: string;
  icon: string;
  tag: string;
}

export const ProductSnippet: FC<Props> = ({ name, icon, tag }) => (
  <Stack direction="row" justify="center" align="center" spacing="11px">
    <ProductIcon icon={icon} />

    <Stack justify="center" align="flex-start" spacing="2px">
      <Text
        fontFamily="Inter"
        lineHeight="1.71"
        fontWeight="semibold"
        fontSize="14px"
        textAlign="center"
      >
        {name}
      </Text>

      <Tag text={tag} />
    </Stack>
  </Stack>
);
