import { Stack } from "@chakra-ui/react";
import { DataEmptyCard } from "components/cards";
import { DataCard, Props as DataCardProps } from "components/cards/data.card";
import { FC } from "react";

interface Props {
  data: DataCardProps[];
}

export const DataOverview: FC<Props> = ({ data }) => (
  <Stack direction="row" justify="space-between" spacing="12px" width="100%">
    {data?.map((d, key) =>
      d.value ? <DataCard key={key} {...d} /> : <DataEmptyCard key={key} {...d} />,
    )}
  </Stack>
);
