import { Checkbox, HStack, Stack } from "@chakra-ui/react";
import { SuggestionsTable } from "components/table";
import { Body } from "components/text";
import { useBuildFaqsTableData } from "hooks";
import { FC, useState } from "react";

interface Props {
  resultId: number;
}

export const ActionsTab: FC<Props> = ({ resultId }) => {
  const [maxPosition, setMaxPosition] = useState<number | null>(null);
  const [minPosition, setMinPosition] = useState<number | null>(null);

  const { rowHeaders, rowItems, isLoading, isError } = useBuildFaqsTableData({
    resultId,
    maxPosition,
    minPosition,
  });

  return (
    <Stack alignItems="center" justifyContent="center" w="full" spacing={6}>
      <Stack alignItems="flex-end" w="full">
        <HStack w="full" justifyContent="flex-end" spacing={6}>
          <Checkbox
            size="sm"
            onChange={({ target }) => {
              setMinPosition(target.checked ? 1 : null);
              setMaxPosition(target.checked ? 5 : null);
            }}
            isChecked={minPosition === 1 && maxPosition === 5}
          >{`1 -> 5`}</Checkbox>
          <Checkbox
            size="sm"
            onChange={({ target }) => {
              setMinPosition(target.checked ? 6 : null);
              setMaxPosition(target.checked ? 20 : null);
            }}
            isChecked={minPosition === 6 && maxPosition === 20}
          >{`6 -> 20`}</Checkbox>
          <Checkbox
            size="sm"
            onChange={({ target }) => {
              setMinPosition(target.checked ? 21 : null);
              setMaxPosition(target.checked ? null : null);
            }}
            isChecked={minPosition === 21 && maxPosition === null}
          >{`20+`}</Checkbox>
        </HStack>
        <Body>Filter by position</Body>
      </Stack>
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
