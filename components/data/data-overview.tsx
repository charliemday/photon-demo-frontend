import { Stack } from "@chakra-ui/react";
import { DataCard, Props as Data } from "components/cards/data.card";
import { FC } from "react";

interface Props {
  data: Data[];
}

export const DataOverview: FC<Props> = ({ data }) => (
  <Stack direction="row" justify="space-between" spacing="12px">
    {data.map((d) => (
      <DataCard {...d} key={`${d.title}-${d.value}`} />
    ))}
  </Stack>
);
