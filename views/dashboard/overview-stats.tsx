import { HStack } from "@chakra-ui/react";
import { DataCard } from "components/cards/data.card";
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
    <HStack w="full" spacing={6}>
      {overviewStats.map((data, index) => (
        <DataCard key={index} width={240} {...data} height={125} />
      ))}
    </HStack>
  );
};
