import { HStack, Stack } from "@chakra-ui/react";
import { DataCard } from "components/cards/data.card";
import { DataOverview } from "components/overview/data.overview";
import { useBuildOverviewStats } from "hooks";
import { FC } from "react";

interface Props {}

export const OverviewStats: FC<Props> = () => {
  const { overviewStats, isLoading, isError } = useBuildOverviewStats();

  if (isLoading) {
    return (
      <HStack w="full" spacing={6}>
        {Array.from({ length: 4 }).map((_, index) => (
          <DataCard isLoading key={index} width={240} height={100} />
        ))}
      </HStack>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <Stack justify="flex-start" align="flex-start" spacing="16px" alignSelf="stretch">
      <DataOverview data={overviewStats} />
    </Stack>
  );
};
