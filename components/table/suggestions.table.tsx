import { Box, Divider, Flex, HStack, Skeleton, Stack } from "@chakra-ui/react";
import { Body, Heading, Link } from "components/text";
import { FC, useState } from "react";
import { RowItem } from "./table";
import { HeaderItem } from "./table.header";
import { RowDataItem, TableRowItem } from "./table.row-item";

interface Props {
  title: string;
  description: string;
  link: string;
  previewCount?: number;
  comingSoon?: boolean;
  rowHeaders: HeaderItem[];
  rowItems: RowItem[];
  isLoading: boolean;
  emptyMessage?: string;
  onLinkClick?: () => void;
}

export const SuggestionsTable: FC<Props> = ({
  title,
  description,
  link,
  rowHeaders,
  rowItems,
  isLoading,
  comingSoon,
  onLinkClick,
  previewCount = 3,
  emptyMessage = "No suggestions found",
}) => {
  const [showAll, setShowAll] = useState(false);

  const renderHeaders = () => {
    return (
      <HStack
        w="full"
        justifyContent="space-evenly"
        divider={<Divider orientation="vertical" />}
        h="39px"
      >
        {rowHeaders.map((header, key) => (
          <Body key={key} flex={header.flex || 1} p={3}>
            {header.text}
          </Body>
        ))}
      </HStack>
    );
  };

  const renderRows = (row: RowDataItem[]) => (
    <HStack justifyContent="space-evenly" divider={<Divider orientation="vertical" />} h="39px">
      {row.map((row, key) => (
        <Box key={key} flex={row.flex || 1} p={3}>
          <TableRowItem {...row} />
        </Box>
      ))}
    </HStack>
  );

  const renderPreview = () => {
    if (comingSoon) {
      return (
        <HStack alignItems="center" justifyContent="center" h="full">
          <Body fontSize="sm">🏗️ Coming soon...</Body>
        </HStack>
      );
    }

    if (rowItems.length === 0) {
      return (
        <HStack alignItems="center" justifyContent="center" h="full">
          <Body fontSize="sm">{emptyMessage}</Body>
        </HStack>
      );
    }

    return (
      <Stack spacing={0} divider={<Divider />} flex={1}>
        {rowItems?.slice(0, previewCount).map(({ rowData }) => renderRows(rowData))}
      </Stack>
    );
  };

  const renderAll = () => (
    <Stack spacing={0} divider={<Divider />} flex={1}>
      {rowItems?.map(({ rowData }) => renderRows(rowData))}
    </Stack>
  );

  const renderShowButton = () => {
    if (showAll) {
      9;
      return (
        <HStack w="full" justifyContent="flex-end" pr={4}>
          <Link onClick={() => setShowAll(false)}>Show less</Link>
        </HStack>
      );
    }

    return (
      <HStack w="full" justifyContent="flex-end" pr={4}>
        {rowItems?.length > previewCount && (
          <Link onClick={() => setShowAll(true)}>Show all ({rowItems.length})</Link>
        )}
      </HStack>
    );
  };

  const tableSize = showAll ? (rowItems?.length + 1) * 40 : 157;

  if (isLoading) {
    return (
      <Stack w="full">
        <Skeleton height={200} borderRadius="lg" />
      </Stack>
    );
  }

  return (
    <Stack w="full">
      <Flex
        border="solid 1px lightgray"
        w="full"
        borderRadius="md"
        h={tableSize}
        position="relative"
        opacity={comingSoon ? 0.5 : 1}
      >
        <Stack flex={1} p={6} justifyContent="center">
          <Heading>{title}</Heading>
          <Body>{description}</Body>
          <Link
            onClick={() => {
              onLinkClick && onLinkClick();
            }}
          >
            {link}
          </Link>
        </Stack>
        <Divider orientation="vertical" />
        <Stack flex={4} spacing={0}>
          {renderHeaders()}
          <Divider />
          {showAll ? renderAll() : renderPreview()}
        </Stack>
      </Flex>
      {renderShowButton()}
    </Stack>
  );
};
