import { Stack } from "@chakra-ui/react";
import { FC } from "react";

import { WordSeekJobTable } from "./word-seek-job-table";
import { WordSeekStats } from "./word-seek-stats";

export const WordSeekView: FC = () => {
  return (
    <Stack py={6}>
      <WordSeekStats />
      <WordSeekJobTable />
    </Stack>
  );
};
