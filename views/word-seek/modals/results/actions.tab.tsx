import { Stack } from "@chakra-ui/react";
import { SuggestionsTable } from "components/table";
import { useBuildFaqsTableData } from "hooks";
import { FC } from "react";

interface Props {
  resultId: number;
}

export const ActionsTab: FC<Props> = ({ resultId }) => {
  const { rowHeaders, rowItems, isLoading, isError } = useBuildFaqsTableData({
    resultId,
  });

  return (
    <Stack alignItems="center" justifyContent="center" w="full" spacing={6}>
      <SuggestionsTable
        rowHeaders={rowHeaders}
        rowItems={rowItems}
        title="FAQs"
        description="Add a short answer to these missing questions as an FAQ at the bottom of the page"
        link="Find out more"
        isLoading={isLoading}
        emptyMessage="No FAQs suggested"
      />
      <SuggestionsTable
        rowHeaders={rowHeaders}
        rowItems={[]}
        title="Add Content"
        description="You can increase the semantic depth of your page by adding missing queries to the relevant section"
        link="Find out more"
        isLoading={isLoading}
        emptyMessage="No Suggested Content to Add"
        comingSoon
      />
      <SuggestionsTable
        rowHeaders={rowHeaders}
        rowItems={[]}
        title="New Section or Page"
        description="You might consider a new content section or a brand new page based around less relevant queries "
        link="Find out more"
        isLoading={isLoading}
        emptyMessage="No suggested New Content"
        comingSoon
      />
    </Stack>
  );
};
