import { Stack } from "@chakra-ui/react";
import { ProductIcon } from "components/icons";
import { Tag } from "components/tag";
import { Label } from "components/text";
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
      <Label fontWeight="semibold" textAlign="center">
        {name}
      </Label>

      <Tag text={tag} />
    </Stack>
  </Stack>
);
