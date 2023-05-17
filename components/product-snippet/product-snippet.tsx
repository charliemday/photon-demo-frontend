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

    <Stack justify="center" spacing="2px">
      <Text fontSize="sm" fontWeight="semibold" textAlign="center">
        {name}
      </Text>

      <Tag text={tag} />
    </Stack>
  </Stack>
);
