import { Stack } from "@chakra-ui/react";
import { DataCard, Props as DataCardProps } from "components/cards/data.card";
import { FC } from "react";

interface Props {
  data: DataCardProps[];
}

export const DataOverview: FC<Props> = ({ data }) => (
  <Stack direction="row" justify="space-between" align="flex-start" spacing="12px" width="100%">
    {data?.map((d, key) => (
      <DataCard key={key} {...d} />
    ))}
  </Stack>
);
