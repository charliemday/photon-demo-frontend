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
        {rowHeaders.map((header, key) => {
          const Icon = header.icon || null;

          return (
            <HStack
              key={key}
              flex={header.flex || 1}
              p={3}
              cursor={header.onClick ? "pointer" : "default"}
              onClick={() => header.onClick && header.onClick()}
              alignItems="center"
            >
              <Body fontWeight="semibold">{header.text}</Body>
              {Icon && <Icon size={14} style={{ marginLeft: 4 }} />}
            </HStack>
          );
        })}
      </HStack>
    );
  };

  const renderRows = (row: RowDataItem[]) => (
    <HStack
      justifyContent="space-evenly"
      alignItems="center"
      divider={<Divider orientation="vertical" />}
      flex={1}
    >
      {row.map((row, key) => (
        <Box
          key={key}
          flex={row.flex || 1}
          p={3}
          cursor={row.onClick ? "pointer" : "default"}
          onClick={() => row.onClick && row.onClick()}
          h="full"
          verticalAlign="center"
        >
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

  const renderAll = () => {
    if (rowItems.length === 0) {
      return (
        <HStack alignItems="center" justifyContent="center" h="full">
          <Body fontSize="sm">{emptyMessage}</Body>
        </HStack>
      );
    }

    return (
      <Stack spacing={0} divider={<Divider />} flex={1}>
        {rowItems?.map(({ rowData }) => renderRows(rowData))}
      </Stack>
    );
  };

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

  if (isLoading) {
    return (
      <Stack w="full">
        <Skeleton height={200} borderRadius="lg" />
      </Stack>
    );
  }

  return (
    <Stack w="full" pointerEvents={comingSoon ? "none" : "auto"}>
      <Flex border="solid 1px #EEF1F6" w="full" borderRadius="md" opacity={comingSoon ? 0.5 : 1}>
        <Stack flex={1} p={6} justifyContent="flex-start" borderRight="solid 1px #EEF1F6">
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
        <Stack flex={6} spacing={0} h="auto">
          {renderHeaders()}
          <Divider />
          {showAll ? renderAll() : renderPreview()}
        </Stack>
      </Flex>
      {renderShowButton()}
    </Stack>
  );
};
