import { Stack } from "@chakra-ui/react";
import { DataOverview } from "components/overview/data.overview";
import { FC } from "react";

interface Props {}

export const WordSeekStats: FC<Props> = () => {
  // TODO: Add data for this component when available
  return (
    <Stack spacing="20px" alignSelf="stretch">
      <DataOverview data={[]} />
    </Stack>
  );
};
