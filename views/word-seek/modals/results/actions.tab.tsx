import { Checkbox, HStack, Stack } from "@chakra-ui/react";
import { SuggestionsTable } from "components/table";
import { Body } from "components/text";
import { BRAND_COLOR } from "config";
import { useBuildExistingContentTableData, useBuildFaqsTableData } from "hooks";
import { FC, useState } from "react";
import { PropagateLoader } from "react-spinners";

interface Props {
  resultId: number;
  onInsertClick: (query: string) => void;
}

export const ActionsTab: FC<Props> = ({ resultId, onInsertClick }) => {
  const [maxPosition, setMaxPosition] = useState<number | null>(null);
  const [minPosition, setMinPosition] = useState<number | null>(null);

  const {
    rowHeaders,
    rowItems,
    isLoading: isLoadingFaqs,
    isError,
  } = useBuildFaqsTableData({
    resultId,
    maxPosition,
    minPosition,
  });

  const {
    rowHeaders: existingRowHeaders,
    rowItems: existingRowItems,
    isLoading: isLoadingExisting,
    isError: isErrorExisting,
  } = useBuildExistingContentTableData({
    resultId,
    maxPosition,
    minPosition,
    onClick: onInsertClick,
  });

  const handleLinkClick = (link: string) => window.open(link, "_blank");

  const renderCheckbox = (label: string, max: number | null, min: number | null) => (
    <Checkbox
      size="sm"
      onChange={({ target }) => {
        setMinPosition(target.checked ? min : null);
        setMaxPosition(target.checked ? max : null);
      }}
      colorScheme="white"
      iconColor="black"
      isChecked={minPosition === min && maxPosition === max}
    >
      {label}
    </Checkbox>
  );

  const renderLoading = () => (
    <Stack alignItems="center" justifyContent="center" w="full" spacing={6} py={12}>
      <Body fontSize="sm">
        👀 Generating some suggestions and clustering the data, this will take a minute...
      </Body>
      <PropagateLoader color={BRAND_COLOR} />
    </Stack>
  );

  const isLoading = isLoadingExisting || isLoadingFaqs;

  return (
    <Stack alignItems="center" justifyContent="center" w="full" spacing={6}>
      <Stack alignItems="flex-end" w="full">
        <HStack w="full" justifyContent="flex-end" spacing={6}>
          {renderCheckbox("1 -> 5", 5, 1)}
          {renderCheckbox("6 -> 20", 20, 6)}
          {renderCheckbox("20+", null, 21)}
        </HStack>
        <Body>Filter by position</Body>
      </Stack>
      {isLoading ? (
        renderLoading()
      ) : (
        <>
          <SuggestionsTable
            rowHeaders={rowHeaders}
            rowItems={rowItems}
            title="FAQs"
            description="Add a short answer to these missing questions as an FAQ at the bottom of the page"
            link="Find out more"
            errorMessage={isError ? "Unable to load FAQs" : null}
            emptyMessage="No FAQs suggested"
            onLinkClick={() => handleLinkClick("https://wordseek.getbaser.com/faqs/adding-faqs")}
          />
          <SuggestionsTable
            rowHeaders={existingRowHeaders}
            rowItems={existingRowItems}
            title="Add Content"
            description="You can increase the semantic depth of your page by adding missing queries to the relevant section"
            link="Find out more"
            errorMessage={isErrorExisting ? "Unable to load Existing Content" : null}
            emptyMessage="No Suggested Content to Add"
            onLinkClick={() => handleLinkClick("https://wordseek.getbaser.com/faqs/adding-content")}
          />
        </>
      )}
    </Stack>
  );
};
