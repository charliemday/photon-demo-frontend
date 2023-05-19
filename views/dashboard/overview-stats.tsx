import { HStack } from "@chakra-ui/react";
import { DataCard } from "components/cards/data.card";
import { useBuildOverviewStats } from "hooks";
import { FC } from "react";

interface Props {}

export const OverviewStats: FC<Props> = () => {
  const { overviewStats } = useBuildOverviewStats();

  return (
    <HStack w="full" spacing={6}>
      {overviewStats.map((data, index) => (
        <DataCard key={index} width={240} {...data} />
      ))}
    </HStack>
  );
};
