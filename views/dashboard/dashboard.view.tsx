import { Divider, Grid, Heading, Stack } from "@chakra-ui/react";
import { ProductCard } from "components/cards";
import { Table } from "components/table";
import { HeaderItem } from "components/table/table.header";
import { ROUTES } from "config";
import { useBuildTaskTableData } from "hooks";
import { useRouter } from "next/router";
import { FC } from "react";

const rowHeaders: HeaderItem[] = [
  {
    text: "SEO Task",
    flex: 3,
  },
  {
    text: "Type",
    flex: 2,
  },
  {
    text: "Assignee",
    flex: 1,
  },
  {
    text: "Month",
  },
  {
    text: "Status",
  },
];

export const DashboardView: FC = () => {
  const router = useRouter();
  const { rowItems, isLoading } = useBuildTaskTableData();
  return (
    <Stack spacing={24}>
      <Stack spacing={12}>
        <Stack spacing={6}>
          <Heading fontSize="xl">Task List</Heading>
          <Table
            rowItems={rowItems}
            headers={rowHeaders}
            isLoading={isLoading}
            emptyText="You have no tasks to display."
          />
        </Stack>
      </Stack>

      <Divider my={12} />

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <ProductCard
          title="Content Strategy"
          description="This is a description of the content strategy card"
          emoji="🤖"
          onClick={() => router.push(ROUTES.CONTENT_STRATEGY)}
          buttonLabel="Build a Content Strategy"
        />
        <ProductCard
          title="Word Seek"
          description="This is a description of the word seek card"
          emoji="🚀"
          onClick={() => router.push(ROUTES.WORD_SEEK)}
          buttonLabel="Run a Word Seek Report"
        />
      </Grid>
    </Stack>
  );
};
