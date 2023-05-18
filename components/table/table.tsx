import { Stack } from "@chakra-ui/react";
import { TableHeader } from "./table.header";
import { TableRow } from "./table.row";
import { FC } from "react";

export const Table: FC = () => (
  <Stack
    background="white"
    width="100%"
    p="20px"
    borderRadius="8px"
    borderColor="#ECECEC"
    borderWidth="1px"
    justify="space-between"
    spacing="20px"
  >
    <Stack justify="space-between" spacing="20px">
      <TableHeader headers={["SEO Task", "Type", "Assignee", "Month", "Status"]} />

      {Array.from({ length: 5 }, (_, i) => (
        <TableRow
          text="Best Climbing Chalk Bags"
          type="✍️ Blog Post"
          assigned="Mark Miltion"
          month="April"
          status="To-Do"
          key={i}
        />
      ))}
    </Stack>
  </Stack>
);
