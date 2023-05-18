import { Stack } from "@chakra-ui/react";
import { ContentDataCard } from "components/cards/content-data.card";
import { FC } from "react";

interface Props {
  data: {
    title: string;
    value: number;
    color?: string;
  }[];
}

export const ContentDataOverview: FC<Props> = ({ data }) => (
  <Stack direction="row" justify="space-between" align="flex-start" spacing="12px" width="100%">
    {data.map((d) => (
      <ContentDataCard {...d} key={`${d.title}-${d.value}`} />
    ))}
  </Stack>
);
