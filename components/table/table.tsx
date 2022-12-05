import { useState } from "react";
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Skeleton,
  Text,
  Flex,
  HStack,
  Box,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { ToolDetailModal } from "components/modals";
import { UserToolList } from "api/tool.api";
import { format, formatDistanceToNow, formatDistance } from "date-fns";
import { AiOutlineBlock } from "react-icons/ai";
import { Image } from "components/image";

interface Props {
  tableData: UserToolList[];
  isLoading?: boolean;
  isSearching?: boolean;
  isHidden?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 50;
const ICON_SIZE = 20;

export const Table: React.FC<Props> = ({
  tableData,
  isLoading,
  isSearching,
  isHidden,
}) => {
  const [iconError, setIconError] = useState(false);

  const [toolDetailOpen, setToolDetailOpen] = useState(false);
  const [toolDetail, setToolDetail] = useState<UserToolList | null>(null);

  const renderLoading = () =>
    Array.from(Array(3).keys()).map((_, t) => (
      <Tr key={t}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Td key={i}>
            <Skeleton key={i} height="40px" borderRadius="md" />
          </Td>
        ))}
      </Tr>
    ));

  const renderEmptyData = () => (
    <Flex justifyContent="center" alignItems="center" my={6} w="full">
      <Text fontSize="sm" opacity={0.5} m="auto">
        {isSearching
          ? "No results found"
          : "You don't have any tools yet. Add one!"}
      </Text>
    </Flex>
  );

  const renderTableBody = (isHidden?: boolean) => (
    <>
      {isLoading
        ? renderLoading()
        : tableData?.length
        ? tableData.map((item, index) => {
            const { tool, nextRenewalDate, renewalAmount } = item;

            const daysToRenewal = nextRenewalDate
              ? Number(
                  formatDistance(new Date(nextRenewalDate), new Date()).split(
                    " "
                  )?.[0]
                )
              : null;

            const isRenewalDue =
              !daysToRenewal || isNaN(daysToRenewal)
                ? null
                : daysToRenewal <= 7;

            const daysUntil = nextRenewalDate
              ? formatDistanceToNow(new Date(nextRenewalDate), {
                  addSuffix: true,
                })
              : null;

            const showCountdown = daysUntil && daysUntil;

            return (
              <Tr
                key={index}
                cursor="pointer"
                _hover={{
                  backgroundColor: "gray.200",
                }}
                onClick={() => {
                  setToolDetail(item);
                  setToolDetailOpen(true);
                }}
                opacity={isHidden ? 0.2 : 1}
                pointerEvents={isHidden ? "none" : "auto"}
              >
                <Td fontSize="sm" flex={2}>
                  <HStack alignItems="center" spacing={6}>
                    <Box p={2} boxShadow="md" borderRadius="sm">
                      <Box
                        width={ICON_SIZE * 0.25}
                        height={ICON_SIZE * 0.25}
                        position="relative"
                        overflow="hidden"
                        borderRadius="sm"
                      >
                        {iconError || !tool.image ? (
                          <AiOutlineBlock fontSize={ICON_SIZE} />
                        ) : (
                          <Image
                            src={tool.image}
                            alt={tool.name}
                            layout="fill"
                            onError={() => setIconError(true)}
                          />
                        )}
                      </Box>
                    </Box>
                    <Text fontWeight="medium">{tool.name}</Text>
                  </HStack>
                </Td>
                <Td fontSize="sm">
                  {tool.description
                    ? tool.description?.length > MAX_DESCRIPTION_LENGTH
                      ? tool.description?.slice(0, MAX_DESCRIPTION_LENGTH) +
                        "..."
                      : tool.description
                    : "-"}
                </Td>
                <Td>
                  <Text fontSize="sm">You</Text>
                </Td>
                <Td fontSize="sm">
                  {daysUntil && isRenewalDue
                    ? `Renewal ${daysUntil}`
                    : nextRenewalDate
                    ? format(new Date(nextRenewalDate), "Mo MMMM yyyy")
                    : "-"}
                </Td>
                <Td fontSize="sm">
                  {Math.floor(renewalAmount) ? `£${renewalAmount}` : "Free"}
                </Td>
              </Tr>
            );
          })
        : renderEmptyData()}
    </>
  );

  const renderHiddenTableBody = () => (
    <>
      <Stack
        flexDir="column"
        position="absolute"
        top={10}
        alignItems="center"
        w="full"
        spacing={6}
      >
        <Text fontSize="sm">
          {`We're updating your tools. This may take a few minutes.`}
        </Text>
        <Spinner />
      </Stack>
      <>{renderTableBody(true)}</>
    </>
  );

  return (
    <>
      <TableContainer borderRadius={10}>
        <ChakraTable>
          <TableCaption bgColor="gray.200">
            {tableData.length
              ? `${tableData.length} SaaS tool${
                  tableData.length > 1 ? "s" : ""
                }`
              : "No tools yet"}
          </TableCaption>
          <Thead bgColor="gray.200">
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Owner</Th>
              <Th>Next Renewal Date</Th>
              <Th>Renewal Cost</Th>
            </Tr>
          </Thead>
          <Tbody position="relative">
            {isHidden ? renderHiddenTableBody() : renderTableBody()}
          </Tbody>
        </ChakraTable>
      </TableContainer>
      <ToolDetailModal
        isOpen={toolDetailOpen}
        onClose={() => setToolDetailOpen(false)}
        userTool={toolDetail}
      />
    </>
  );
};
